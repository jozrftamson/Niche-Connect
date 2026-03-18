import type { IncomingMessage, ServerResponse } from "http";
import { ZodError } from "zod";
import { createA2AJob, executeA2AJob } from "../_a2aCore.js";
import { readJsonBody, sendJson } from "../_utils.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end();
    return;
  }

  try {
    const body = await readJsonBody(req);
    const job = createA2AJob(body);
    const executed = executeA2AJob(job.id);
    sendJson(res, 200, { ok: true, job: executed });
  } catch (error) {
    if (error instanceof ZodError) {
      sendJson(res, 400, { ok: false, error: "Invalid A2A run payload", issues: error.issues });
      return;
    }

    sendJson(res, 500, { ok: false, error: "A2A run failed" });
  }
}
