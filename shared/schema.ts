import { sql } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const posts = pgTable(
  "posts",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    platform: text("platform").notNull(),
    platformPostId: text("platform_post_id").notNull().unique(),
    text: text("text").notNull(),
    url: text("url"),
    niche: text("niche").notNull().default("general"),
    engagementScore: integer("engagement_score").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    postsNicheIdx: index("posts_niche_idx").on(table.niche),
    postsCreatedAtIdx: index("posts_created_at_idx").on(table.createdAt),
    postsEngagementIdx: index("posts_engagement_idx").on(table.engagementScore),
  }),
);

export const agentPackages = pgTable(
  "agent_packages",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    workflowJson: text("workflow_json").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    agentPackagesSlugIdx: index("agent_packages_slug_idx").on(table.slug),
    agentPackagesUpdatedAtIdx: index("agent_packages_updated_at_idx").on(table.updatedAt),
  }),
);

export const insertPostSchema = createInsertSchema(posts).pick({
  platform: true,
  platformPostId: true,
  text: true,
  url: true,
  niche: true,
  engagementScore: true,
});

export const engagements = pgTable(
  "engagements",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    postId: text("post_id").notNull(),
    userId: text("user_id").notNull(),
    type: text("type").notNull().default("comment"),
    message: text("message"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    engagementsPostIdx: index("engagements_post_idx").on(table.postId),
    engagementsUserIdx: index("engagements_user_idx").on(table.userId),
    engagementsCreatedAtIdx: index("engagements_created_at_idx").on(table.createdAt),
  }),
);

export const insertEngagementSchema = createInsertSchema(engagements).pick({
  postId: true,
  userId: true,
  type: true,
  message: true,
});

export const insertAgentPackageSchema = createInsertSchema(agentPackages).pick({
  slug: true,
  title: true,
  description: true,
  workflowJson: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertEngagement = z.infer<typeof insertEngagementSchema>;
export type Engagement = typeof engagements.$inferSelect;
export type InsertAgentPackage = z.infer<typeof insertAgentPackageSchema>;
export type AgentPackage = typeof agentPackages.$inferSelect;
