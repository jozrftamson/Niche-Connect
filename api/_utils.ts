import type { IncomingMessage, ServerResponse } from "http";

export async function readJsonBody(req: IncomingMessage) {
  const reqWithBody = req as IncomingMessage & { body?: unknown; rawBody?: unknown };
  if (reqWithBody.body && typeof reqWithBody.body === "object") {
    return reqWithBody.body as Record<string, unknown>;
  }

  if (reqWithBody.rawBody) {
    const raw =
      typeof reqWithBody.rawBody === "string"
        ? reqWithBody.rawBody
        : Buffer.isBuffer(reqWithBody.rawBody)
          ? reqWithBody.rawBody.toString("utf-8")
          : Buffer.from(String(reqWithBody.rawBody)).toString("utf-8");

    return raw ? JSON.parse(raw) : {};
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }
  if (!chunks.length) return {};
  const raw = Buffer.concat(chunks).toString("utf-8");
  return raw ? JSON.parse(raw) : {};
}

export function sendJson(
  res: ServerResponse,
  status: number,
  payload: unknown,
) {
  const body = JSON.stringify(payload);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Length", Buffer.byteLength(body));
  res.end(body);
}
