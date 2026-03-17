import type { IncomingMessage, ServerResponse } from "http";
import { ZodError } from "zod";
import { fetchAgentPackages, saveAgentPackage } from "../_agentEngine.js";
import { readJsonBody, sendJson } from "../_utils.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === "GET") {
    const packages = await fetchAgentPackages();
    sendJson(res, 200, {
      ok: true,
      count: packages.length,
      packages,
    });
    return;
  }

  if (req.method === "POST") {
    try {
      const body = await readJsonBody(req);
      const saved = await saveAgentPackage(body);
      sendJson(res, 201, { ok: true, package: saved });
      return;
    } catch (error) {
      if (error instanceof ZodError) {
        sendJson(res, 400, {
          ok: false,
          error: "Invalid package payload",
          issues: error.issues,
        });
        return;
      }

      sendJson(res, 500, {
        ok: false,
        error: "Could not persist package",
      });
      return;
    }
  }

  res.statusCode = 405;
  res.end();
}
