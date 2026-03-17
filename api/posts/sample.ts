import type { IncomingMessage, ServerResponse } from "http";
import { posts } from "../../shared/schema.js";
import { getDb } from "../_db.js";
import { sendJson } from "../_utils.js";

export default async function handler(
  _req: IncomingMessage,
  res: ServerResponse,
) {
  const db = getDb();
  const rows = await db.insert(posts).values({
    platform: "farcaster",
    platformPostId: `sample-${Date.now()}`,
    text: "Hello from sample post",
    url: "https://example.com",
  }).returning();

  sendJson(res, 201, { ok: true, post: rows[0] });
}
