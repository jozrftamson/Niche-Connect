import type { IncomingMessage, ServerResponse } from "http";
import { insertEngagementSchema } from "../shared/schema.js";
import { storage } from "../server/storage.js";
import { readJsonBody, sendJson } from "./_utils.js";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method === "GET") {
    const url = new URL(req.url ?? "", "http://localhost");
    const postId = url.searchParams.get("postId");
    const userId = url.searchParams.get("userId");

    const engagements = await storage.listEngagements();
    const filtered = engagements.filter((item) => {
      if (postId && item.postId !== postId) return false;
      if (userId && item.userId !== userId) return false;
      return true;
    });

    return sendJson(res, 200, { ok: true, engagements: filtered });
  }

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    const payload = insertEngagementSchema.parse(body);
    const engagement = await storage.createEngagement(payload);
    return sendJson(res, 201, { ok: true, engagement });
  }

  res.statusCode = 405;
  res.end();
}
