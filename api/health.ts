import type { IncomingMessage, ServerResponse } from "http";
import { sendJson } from "./_utils";

export default async function handler(
  _req: IncomingMessage,
  res: ServerResponse,
) {
  sendJson(res, 200, { ok: true, timestamp: new Date().toISOString() });
}
