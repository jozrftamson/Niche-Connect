import type { IncomingMessage, ServerResponse } from "http";
import { insertPostSchema, posts } from "../shared/schema.js";
import { getDb } from "./_db.js";
import { readJsonBody, sendJson } from "./_utils.js";

type SortOption = "newest" | "most-engagement";
type RangeOption = "all" | "24h" | "7d" | "30d";

function getSearchParams(req: IncomingMessage) {
  const rawUrl = req.url ?? "/";
  const parsed = new URL(rawUrl, "http://localhost");

  const niche = parsed.searchParams.get("niche") ?? "all";
  const sort = (parsed.searchParams.get("sort") as SortOption) ?? "newest";
  const range = (parsed.searchParams.get("range") as RangeOption) ?? "all";
  const account = parsed.searchParams.get("account") ?? "";
  const hashtag = parsed.searchParams.get("hashtag") ?? "";

  return {
    niche,
    sort: sort === "most-engagement" ? "most-engagement" : "newest",
    range: ["all", "24h", "7d", "30d"].includes(range) ? (range as RangeOption) : "all",
    account,
    hashtag,
  };
}

function inRange(createdAt: Date | string, range: RangeOption) {
  if (range === "all") return true;

  const created = new Date(createdAt).getTime();
  if (!Number.isFinite(created)) return false;

  const now = Date.now();
  const windows: Record<Exclude<RangeOption, "all">, number> = {
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };

  return now - created <= windows[range as Exclude<RangeOption, "all">];
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method === "GET") {
    const { niche, sort, range, account, hashtag } = getSearchParams(req);
    const db = getDb();
    const rows = await db.select().from(posts);

    const filtered = rows.filter((row) => {
      const nicheMatch = niche === "all" || row.niche === niche;
      const rangeMatch = inRange(row.createdAt, range);
      const accountMatch = !account || row.platformPostId === account;
      const hashtagMatch = !hashtag || (row.text && row.text.includes(`#${hashtag}`));
      return nicheMatch && rangeMatch && accountMatch && hashtagMatch;
    });

    const sorted = filtered.sort((a, b) => {
      if (sort === "most-engagement") {
        const byEngagement = b.engagementScore - a.engagementScore;
        if (byEngagement !== 0) return byEngagement;
      }

      const byDate = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (byDate !== 0) return byDate;

      return a.id.localeCompare(b.id);
    });

    return sendJson(res, 200, {
      ok: true,
      params: { niche, sort, range, account, hashtag },
      count: sorted.length,
      posts: sorted,
    });
  }

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    const payload = insertPostSchema.parse(body);
    const db = getDb();
    const rows = await db.insert(posts).values(payload as any).returning();
    return sendJson(res, 201, { ok: true, post: rows[0] });
  }

  res.statusCode = 405;
  res.end();
}
