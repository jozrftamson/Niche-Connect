import type { Express } from "express";
import { createApp, initApp } from "../server/app";

let appPromise: Promise<Express> | undefined;

async function getApp(): Promise<Express> {
  if (!appPromise) {
    appPromise = (async () => {
      const app = createApp();
      await initApp(app);
      return app;
    })();
  }

  return appPromise;
}

function stripPathParam(url: string | undefined) {
  if (!url) return "/api";
  const [pathname, queryString] = url.split("?");
  if (!queryString) return pathname;

  const params = new URLSearchParams(queryString);
  const pathParam = params.get("path");
  params.delete("path");

  const nextPath = pathParam ? `/api/${pathParam}` : "/api";
  const nextQuery = params.toString();
  return nextQuery ? `${nextPath}?${nextQuery}` : nextPath;
}

export default async function handler(req: any, res: any) {
  const app = await getApp();
  req.url = stripPathParam(req.url);
  app(req, res);
}
