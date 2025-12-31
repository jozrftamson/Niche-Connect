import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  engagements,
  posts,
  type Engagement,
  type InsertEngagement,
  type InsertPost,
  type InsertUser,
  type Post,
  type User,
  users,
} from "../shared/schema.js";
import { randomUUID } from "crypto";

let pool: Pool | undefined;
let dbInstance: ReturnType<typeof drizzle> | undefined;

function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  if (!pool) {
    pool = new Pool({ connectionString });
  }

  if (!dbInstance) {
    dbInstance = drizzle(pool);
  }

  return dbInstance;
}

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listPosts(): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  listEngagements(): Promise<Engagement[]>;
  createEngagement(engagement: InsertEngagement): Promise<Engagement>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<string, Post>;
  private engagements: Map<string, Engagement>;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.engagements = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async listPosts(): Promise<Post[]> {
    return Array.from(this.posts.values());
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = randomUUID();
    const post: Post = {
      id,
      platform: insertPost.platform,
      platformPostId: insertPost.platformPostId,
      authorPlatformId: insertPost.authorPlatformId ?? null,
      url: insertPost.url ?? null,
      text: insertPost.text ?? null,
      metrics: insertPost.metrics ?? null,
      createdAt: new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  async listEngagements(): Promise<Engagement[]> {
    return Array.from(this.engagements.values());
  }

  async createEngagement(
    insertEngagement: InsertEngagement,
  ): Promise<Engagement> {
    const id = randomUUID();
    const engagement: Engagement = {
      id,
      userId: insertEngagement.userId,
      postId: insertEngagement.postId,
      type: insertEngagement.type,
      status: insertEngagement.status,
      metadata: insertEngagement.metadata ?? null,
      createdAt: new Date(),
    };
    this.engagements.set(id, engagement);
    return engagement;
  }
}

export class DbStorage implements IStorage {
  private db = getDb();

  async getUser(id: string): Promise<User | undefined> {
    const rows = await this.db.select().from(users).where(eq(users.id, id));
    return rows[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const rows = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return rows[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const rows = await this.db.insert(users).values(insertUser).returning();
    return rows[0];
  }

  async listPosts(): Promise<Post[]> {
    return this.db.select().from(posts);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const rows = await this.db.insert(posts).values(insertPost).returning();
    return rows[0];
  }

  async listEngagements(): Promise<Engagement[]> {
    return this.db.select().from(engagements);
  }

  async createEngagement(
    insertEngagement: InsertEngagement,
  ): Promise<Engagement> {
    const rows = await this.db
      .insert(engagements)
      .values(insertEngagement)
      .returning();
    return rows[0];
  }
}

export const storage = process.env.DATABASE_URL
  ? new DbStorage()
  : new MemStorage();
