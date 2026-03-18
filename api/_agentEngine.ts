import { z } from "zod";
import {
  agentPackages as agentPackagesTable,
  insertAgentPackageSchema,
  posts,
} from "../shared/schema.js";
import { getDb } from "./_db.js";

export type AgentSort = "newest" | "most-engagement";
export type AgentRange = "all" | "24h" | "7d" | "30d";

export interface AgentSearchRecord {
  id: string;
  platform: string;
  platformPostId: string;
  text: string;
  url: string | null;
  niche: string;
  engagementScore: number;
  createdAt: string;
  sourceAccount: string;
  hashtags: string[];
}

export interface AgentSearchQuery {
  niche?: string;
  account?: string;
  hashtag?: string;
  range?: AgentRange;
  sort?: AgentSort;
  limit?: number;
}

interface RawPost {
  id: string;
  platform: string;
  platformPostId: string;
  text: string;
  url: string | null;
  niche: string;
  engagementScore: number;
  createdAt: Date | string;
}

const FALLBACK_POSTS: RawPost[] = [
  {
    id: "fallback-1",
    platform: "twitter",
    platformPostId: "sarah_edo-001",
    text: "Tooling in #webdev gets better every year. #javascript",
    url: "https://x.com/sarah_edo/status/1",
    niche: "webdev",
    engagementScore: 92,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "fallback-2",
    platform: "twitter",
    platformPostId: "rauchg-002",
    text: "Performance is business impact. Watch your #lcp and #performance.",
    url: "https://x.com/rauchg/status/2",
    niche: "performance",
    engagementScore: 133,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "fallback-3",
    platform: "linkedin",
    platformPostId: "addyosmani-003",
    text: "Design patterns still matter in #javascript and #architecture.",
    url: "https://linkedin.com/posts/example",
    niche: "learning",
    engagementScore: 74,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "fallback-4",
    platform: "twitter",
    platformPostId: "dan_abramov-004",
    text: "RSC is a mental shift for #react and #frontend teams.",
    url: "https://x.com/dan_abramov/status/4",
    niche: "frontend",
    engagementScore: 180,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

const workflowStepSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("filter"),
    field: z.enum(["niche", "account", "hashtag", "text"]),
    operator: z.enum(["eq", "includes"]).default("includes"),
    value: z.string().optional(),
    fromInput: z.string().optional(),
  }),
  z.object({
    type: z.literal("sort"),
    by: z.enum(["newest", "most-engagement"]).default("newest"),
  }),
  z.object({
    type: z.literal("limit"),
    value: z.number().int().positive().max(200),
  }),
]);

export const workflowSchema = z.object({
  name: z.string().min(1).max(120).default("custom-agent-workflow"),
  input: z.record(z.string(), z.string()).default({}),
  steps: z.array(workflowStepSchema).min(1),
});

export type AgentWorkflow = z.infer<typeof workflowSchema>;

export interface AgentPackageItem {
  id: string;
  title: string;
  description: string;
  workflow: AgentWorkflow;
}

function normalize(input: string | undefined | null) {
  return (input ?? "").trim().toLowerCase();
}

function extractHashtags(text: string) {
  const tags = text.match(/#[a-z0-9_]+/gi) ?? [];
  return Array.from(new Set(tags.map((tag) => tag.slice(1).toLowerCase())));
}

function deriveAccount(row: RawPost) {
  const fromId = row.platformPostId.split(/[-:/]/)[0]?.trim();
  if (fromId) return fromId.toLowerCase();

  if (row.url) {
    try {
      const url = new URL(row.url);
      const firstPath = url.pathname.split("/").filter(Boolean)[0];
      if (firstPath) return firstPath.toLowerCase();
      return url.hostname.toLowerCase();
    } catch {
      return row.platform.toLowerCase();
    }
  }

  return row.platform.toLowerCase();
}

function toRecord(row: RawPost): AgentSearchRecord {
  return {
    id: row.id,
    platform: row.platform,
    platformPostId: row.platformPostId,
    text: row.text,
    url: row.url,
    niche: row.niche,
    engagementScore: row.engagementScore,
    createdAt: new Date(row.createdAt).toISOString(),
    sourceAccount: deriveAccount(row),
    hashtags: extractHashtags(row.text),
  };
}

function withinRange(createdAt: string, range: AgentRange) {
  if (range === "all") return true;

  const created = new Date(createdAt).getTime();
  if (!Number.isFinite(created)) return false;

  const now = Date.now();
  const windows: Record<Exclude<AgentRange, "all">, number> = {
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };

  return now - created <= windows[range as Exclude<AgentRange, "all">];
}

function sortRecords(items: AgentSearchRecord[], sort: AgentSort) {
  return items.sort((a, b) => {
    if (sort === "most-engagement") {
      const byEngagement = b.engagementScore - a.engagementScore;
      if (byEngagement !== 0) return byEngagement;
    }

    const byDate = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (byDate !== 0) return byDate;

    return a.id.localeCompare(b.id);
  });
}

export async function fetchAgentRecords() {
  try {
    const db = getDb();
    const rows = await db.select().from(posts);
    return rows.map((row: unknown) => toRecord(row as RawPost));
  } catch {
    return FALLBACK_POSTS.map((row) => toRecord(row));
  }
}

export function searchAgentRecords(records: AgentSearchRecord[], query: AgentSearchQuery) {
  const niche = normalize(query.niche);
  const account = normalize(query.account);
  const hashtag = normalize(query.hashtag).replace(/^#/, "");
  const range = query.range ?? "all";
  const sort = query.sort ?? "newest";
  const limit = Math.min(Math.max(query.limit ?? 50, 1), 200);

  const filtered = records.filter((record) => {
    const nicheMatch = !niche || niche === "all" || normalize(record.niche) === niche;
    const accountMatch = !account || normalize(record.sourceAccount).includes(account);
    const hashtagMatch = !hashtag || record.hashtags.includes(hashtag);
    const rangeMatch = withinRange(record.createdAt, range);
    return nicheMatch && accountMatch && hashtagMatch && rangeMatch;
  });

  const sorted = sortRecords(filtered, sort);
  return sorted.slice(0, limit);
}

export function runAgentWorkflow(records: AgentSearchRecord[], workflowInput: unknown) {
  const workflow = workflowSchema.parse(workflowInput);
  let current = [...records];
  const trace: Array<{ step: number; type: string; count: number }> = [];

  workflow.steps.forEach((step, index) => {
    if (step.type === "filter") {
      const runtimeValue = step.fromInput ? workflow.input[step.fromInput] : step.value;
      const expected = normalize(runtimeValue);

      if (expected) {
        current = current.filter((item) => {
          const fieldValue =
            step.field === "niche"
              ? item.niche
              : step.field === "account"
                ? item.sourceAccount
                : step.field === "hashtag"
                  ? item.hashtags.join(" ")
                  : item.text;

          const normalizedField = normalize(fieldValue);
          return step.operator === "eq" ? normalizedField === expected : normalizedField.includes(expected);
        });
      }
    }

    if (step.type === "sort") {
      current = sortRecords(current, step.by);
    }

    if (step.type === "limit") {
      current = current.slice(0, step.value);
    }

    trace.push({ step: index + 1, type: step.type, count: current.length });
  });

  return {
    workflow: {
      name: workflow.name,
      steps: workflow.steps.length,
    },
    trace,
    result: current,
  };
}

export const defaultAgentPackages: AgentPackageItem[] = [
  {
    id: "niche-scout",
    title: "Niche Scout",
    description: "Find latest posts by niche and hashtag.",
    workflow: {
      name: "niche-scout",
      input: {
        niche: "webdev",
        hashtag: "javascript",
      },
      steps: [
        { type: "filter", field: "niche", operator: "eq", fromInput: "niche" },
        { type: "filter", field: "hashtag", operator: "includes", fromInput: "hashtag" },
        { type: "sort", by: "newest" },
        { type: "limit", value: 20 },
      ],
    },
  },
  {
    id: "account-monitor",
    title: "Account Monitor",
    description: "Track high-engagement posts for one account.",
    workflow: {
      name: "account-monitor",
      input: {
        account: "rauchg",
      },
      steps: [
        { type: "filter", field: "account", operator: "includes", fromInput: "account" },
        { type: "sort", by: "most-engagement" },
        { type: "limit", value: 10 },
      ],
    },
  },
  {
    id: "trend-radar",
    title: "Trend Radar",
    description: "Scan a hashtag across all niches sorted by engagement.",
    workflow: {
      name: "trend-radar",
      input: {
        hashtag: "react",
      },
      steps: [
        { type: "filter", field: "hashtag", operator: "includes", fromInput: "hashtag" },
        { type: "sort", by: "most-engagement" },
        { type: "limit", value: 25 },
      ],
    },
  },
];

interface RawAgentPackageRow {
  slug: string;
  title: string;
  description: string;
  workflowJson: string;
}

function fromPackageRow(row: RawAgentPackageRow): AgentPackageItem | null {
  try {
    const workflow = workflowSchema.parse(JSON.parse(row.workflowJson));
    return {
      id: row.slug,
      title: row.title,
      description: row.description,
      workflow,
    };
  } catch {
    return null;
  }
}

export async function fetchAgentPackages() {
  try {
    const db = getDb();
    const rows = await db.select().from(agentPackagesTable);

    const parsed = rows
      .map((row: unknown) => fromPackageRow(row as RawAgentPackageRow))
      .filter((item: AgentPackageItem | null): item is AgentPackageItem => Boolean(item));

    parsed.sort((a: AgentPackageItem, b: AgentPackageItem) => a.title.localeCompare(b.title));

    return parsed.length ? parsed : defaultAgentPackages;
  } catch {
    return defaultAgentPackages;
  }
}

export async function saveAgentPackage(payload: unknown) {
  const parsed = insertAgentPackageSchema.parse(payload);
  const workflow = workflowSchema.parse(JSON.parse(parsed.workflowJson));

  try {
    const db = getDb();
    const rows = await db
      .insert(agentPackagesTable)
      .values({
        slug: parsed.slug,
        title: parsed.title,
        description: parsed.description,
        workflowJson: JSON.stringify(workflow),
      } as any)
      .onConflictDoUpdate({
        target: agentPackagesTable.slug,
        set: {
          title: parsed.title,
          description: parsed.description,
          workflowJson: JSON.stringify(workflow),
        } as any,
      })
      .returning();

    const persisted = rows[0];
    const mapped = fromPackageRow(persisted as unknown as RawAgentPackageRow);
    if (!mapped) {
      throw new Error("Saved package could not be parsed");
    }

    return mapped;
  } catch {
    // Fallback for environments without DB connectivity.
    return {
      id: parsed.slug,
      title: parsed.title,
      description: parsed.description,
      workflow,
    };
  }
}

export async function getAgentPackageById(id: string) {
  try {
    const db = getDb();
    const rows = await db.select().from(agentPackagesTable);
    const row = rows.find((item: unknown) => {
      const candidate = item as { slug?: string };
      return candidate.slug === id;
    });

    if (row) {
      const mapped = fromPackageRow(row as unknown as RawAgentPackageRow);
      if (mapped) return mapped;
    }
  } catch {
    // Fall through to defaults
  }

  return defaultAgentPackages.find((pkg) => pkg.id === id) ?? null;
}
