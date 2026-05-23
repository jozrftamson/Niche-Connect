import type { Express } from "express";
import type { Server } from "http";
import { access } from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";

type ApiHandler = (req: any, res: any) => unknown | Promise<unknown>;

const handlerCache = new Map<string, ApiHandler>();

function toApiFsPath(urlPath: string) {
  const withoutPrefix = urlPath.replace(/^\/api\/?/, "");
  const safe = withoutPrefix.replace(/^\/+/, "").replace(/\.\.(\/|\\)/g, "");
  if (!safe) return null;
  return path.resolve(process.cwd(), "api", `${safe}.ts`);
}

async function loadHandler(fsPath: string): Promise<ApiHandler | null> {
  const cached = handlerCache.get(fsPath);
  if (cached) return cached;

  try {
    await access(fsPath);
  } catch {
    return null;
  }

  const mod = (await import(pathToFileURL(fsPath).href)) as { default?: unknown };
  if (typeof mod.default !== "function") return null;

  const handler = mod.default as ApiHandler;
  handlerCache.set(fsPath, handler);
  return handler;
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.all("/api/*", async (req, res) => {
    if (process.env.NODE_ENV === "production") {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: false, error: "API routes are not served by the Express production build." }));
      return;
    }

    const fsPath = toApiFsPath(req.path);
    if (!fsPath) {
      res.statusCode = 404;
      res.end();
      return;
    }

    const handler = await loadHandler(fsPath);
    if (!handler) {
      res.statusCode = 404;
      res.end();
      return;
    }

    // Ensure handlers that parse req.url (including query params) see the full original URL.
    req.url = req.originalUrl;

    try {
      await handler(req, res);
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          ok: false,
          error: error instanceof Error ? error.message : "Internal error",
        }),
      );
    }
  });

  return httpServer;
}
