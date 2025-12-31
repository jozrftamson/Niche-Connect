import type { IncomingMessage, ServerResponse } from "http";
import { storage } from "../../server/storage.js";
import { sendJson } from "../_utils.js";

export default async function handler(
  _req: IncomingMessage,
  res: ServerResponse,
) {
  const post = await storage.createPost({
    platform: "farcaster",
    platformPostId: `sample-${Date.now()}`,
    text: "Hello from sample post",
    url: "https://example.com",
  });

  sendJson(res, 201, { ok: true, post });
}
