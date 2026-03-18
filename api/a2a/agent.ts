import type { IncomingMessage, ServerResponse } from "http";
import { ZodError } from "zod";
import { invokeA2AAgent } from "../_a2aCore.js";
import { readJsonBody, sendJson } from "../_utils.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end();
    return;
  }

  try {
    const body = await readJsonBody(req);
    const result = invokeA2AAgent(body);
    sendJson(res, 200, { ok: true, ...result });
  } catch (error) {
    if (error instanceof ZodError) {
      sendJson(res, 400, { ok: false, error: "Invalid A2A agent payload", issues: error.issues });
      return;
    }

    sendJson(res, 500, { ok: false, error: "A2A agent invocation failed" });
  }
}
