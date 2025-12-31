import type { IncomingMessage, ServerResponse } from "http";
import { insertPostSchema } from "../shared/schema.js";
import { storage } from "../server/storage.js";
import { readJsonBody, sendJson } from "./_utils.js";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method === "GET") {
    const posts = await storage.listPosts();
    return sendJson(res, 200, { ok: true, posts });
  }

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    const payload = insertPostSchema.parse(body);
    const post = await storage.createPost(payload);
    return sendJson(res, 201, { ok: true, post });
  }

  res.statusCode = 405;
  res.end();
}
