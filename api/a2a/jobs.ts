import type { IncomingMessage, ServerResponse } from "http";
import { getA2AJob, listA2AJobs } from "../_a2aCore.js";
import { sendJson } from "../_utils.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end();
    return;
  }

  const url = new URL(req.url ?? "/", "http://localhost");
  const jobId = url.searchParams.get("jobId");

  if (jobId) {
    const job = getA2AJob(jobId);
    if (!job) {
      sendJson(res, 404, { ok: false, error: "Job not found" });
      return;
    }

    sendJson(res, 200, { ok: true, job });
    return;
  }

  sendJson(res, 200, { ok: true, jobs: listA2AJobs() });
}
