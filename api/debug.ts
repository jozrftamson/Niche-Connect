import type { IncomingMessage, ServerResponse } from "http";
import { sendJson } from "./_utils.js";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  sendJson(res, 200, {
    ok: true,
    timestamp: new Date().toISOString(),
    node: process.version,
    method: req.method,
    url: req.url,
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
  });
}
