import type { IncomingMessage, ServerResponse } from "http";
import { readJsonBody, sendJson } from "./_utils.js";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const body = await readJsonBody(req);
  sendJson(res, 200, { ok: true, body });
}
