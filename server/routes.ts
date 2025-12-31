import type { Express } from "express";
import type { Server } from "http";
import { insertEngagementSchema, insertPostSchema } from "../shared/schema.js";
import { storage } from "./storage";

export async function registerRoutes(
  _httpServer: Server | undefined,
  app: Express
): Promise<void> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  app.post("/api/echo", (req, res) => {
    const body = req.body ?? {};
    res.json({ ok: true, body });
  });

  app.get("/api/posts", async (_req, res) => {
    const posts = await storage.listPosts();
    res.json({ ok: true, posts });
  });

  app.post("/api/posts", async (req, res) => {
    const payload = insertPostSchema.parse(req.body);
    const post = await storage.createPost(payload);
    res.status(201).json({ ok: true, post });
  });

  app.post("/api/posts/sample", async (_req, res) => {
    const post = await storage.createPost({
      platform: "farcaster",
      platformPostId: `sample-${Date.now()}`,
      text: "Hello from sample post",
      url: "https://example.com",
    });
    res.status(201).json({ ok: true, post });
  });

  app.get("/api/engagements", async (req, res) => {
    const engagements = await storage.listEngagements();
    const { postId, userId } = req.query;
    const filtered = engagements.filter((item) => {
      if (typeof postId === "string" && item.postId !== postId) return false;
      if (typeof userId === "string" && item.userId !== userId) return false;
      return true;
    });
    res.json({ ok: true, engagements: filtered });
  });

  app.post("/api/engagements", async (req, res) => {
    const payload = insertEngagementSchema.parse(req.body);
    const engagement = await storage.createEngagement(payload);
    res.status(201).json({ ok: true, engagement });
  });

  return;
}
