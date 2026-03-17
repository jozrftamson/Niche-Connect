import type { IncomingMessage, ServerResponse } from "http";
import { ZodError } from "zod";
import { fetchAgentRecords, getAgentPackageById, runAgentWorkflow } from "../_agentEngine.js";
import { readJsonBody, sendJson } from "../_utils.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end();
    return;
  }

  try {
    const body = await readJsonBody(req);
    const records = await fetchAgentRecords();
    let workflowPayload = body.workflow ?? body;

    if (body.packageId) {
      const pkg = await getAgentPackageById(String(body.packageId));
      if (!pkg) {
        sendJson(res, 404, {
          ok: false,
          error: "Package not found",
        });
        return;
      }

      workflowPayload = {
        ...pkg.workflow,
        input: {
          ...pkg.workflow.input,
          ...(body.input ?? {}),
        },
      };
    }

    const execution = runAgentWorkflow(records, workflowPayload);

    sendJson(res, 200, {
      ok: true,
      sourceCount: records.length,
      ...execution,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      sendJson(res, 400, {
        ok: false,
        error: "Invalid workflow payload",
        issues: error.issues,
      });
      return;
    }

    sendJson(res, 500, {
      ok: false,
      error: "Workflow execution failed",
    });
  }
}
