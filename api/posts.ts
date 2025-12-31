import type { IncomingMessage, ServerResponse } from "http";
import { insertPostSchema, posts } from "../shared/schema.js";
import { getDb } from "./_db.js";
import { readJsonBody, sendJson } from "./_utils.js";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method === "GET") {
    const db = getDb();
    const rows = await db.select().from(posts);
    return sendJson(res, 200, { ok: true, posts: rows });
  }

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    const payload = insertPostSchema.parse(body);
    const db = getDb();
    const rows = await db.insert(posts).values(payload).returning();
    return sendJson(res, 201, { ok: true, post: rows[0] });
  }

  res.statusCode = 405;
  res.end();
}
