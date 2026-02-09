import { sql } from "drizzle-orm";
import { boolean, integer, jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const wallets = pgTable("wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  chain: text("chain").notNull(),
  address: text("address").notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertWalletSchema = createInsertSchema(wallets).pick({
  userId: true,
  chain: true,
  address: true,
  isPrimary: true,
});

export const socialAccounts = pgTable("social_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  platform: text("platform").notNull(),
  handle: text("handle").notNull(),
  platformUserId: text("platform_user_id"),
  accessTokenRef: text("access_token_ref"),
  refreshTokenRef: text("refresh_token_ref"),
  tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).pick({
  userId: true,
  platform: true,
  handle: true,
  platformUserId: true,
  accessTokenRef: true,
  refreshTokenRef: true,
  tokenExpiresAt: true,
});

export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(),
  platformPostId: text("platform_post_id").notNull(),
  authorPlatformId: text("author_platform_id"),
  url: text("url"),
  text: text("text"),
  metrics: jsonb("metrics"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertPostSchema = createInsertSchema(posts).pick({
  platform: true,
  platformPostId: true,
  authorPlatformId: true,
  url: true,
  text: true,
  metrics: true,
});

export const engagements = pgTable("engagements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  postId: varchar("post_id").references(() => posts.id).notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertEngagementSchema = createInsertSchema(engagements).pick({
  userId: true,
  postId: true,
  type: true,
  status: true,
  metadata: true,
});

export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  userId: true,
  type: true,
  content: true,
  isActive: true,
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(),
  targetPostId: varchar("target_post_id").references(() => posts.id),
  status: text("status").notNull(),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
  attempts: integer("attempts").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  userId: true,
  action: true,
  targetPostId: true,
  status: true,
  scheduledFor: true,
  attempts: true,
});

export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertEngagement = z.infer<typeof insertEngagementSchema>;
export type Engagement = typeof engagements.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
