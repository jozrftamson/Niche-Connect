import type { IncomingMessage, ServerResponse } from "http";
import { engagements, insertEngagementSchema } from "../shared/schema.js";
import { getDb } from "./_db.js";
import { readJsonBody, sendJson } from "./_utils.js";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method === "GET") {
    const db = getDb();
    const url = new URL(req.url ?? "", "http://localhost");
    const postId = url.searchParams.get("postId");
    const userId = url.searchParams.get("userId");

    const rows = await db.select().from(engagements);
    const filtered = rows.filter((item) => {
      if (postId && item.postId !== postId) return false;
      if (userId && item.userId !== userId) return false;
      return true;
    });

    return sendJson(res, 200, { ok: true, engagements: filtered });
  }

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    const payload = insertEngagementSchema.parse(body);
    const db = getDb();
    const rows = await db.insert(engagements).values(payload).returning();
    return sendJson(res, 201, { ok: true, engagement: rows[0] });
  }

  res.statusCode = 405;
  res.end();
}
