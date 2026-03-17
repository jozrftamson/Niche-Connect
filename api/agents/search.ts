import type { IncomingMessage, ServerResponse } from "http";
import { fetchAgentRecords, searchAgentRecords, type AgentRange, type AgentSort } from "../_agentEngine.js";
import { sendJson } from "../_utils.js";

function parseQuery(req: IncomingMessage) {
  const rawUrl = req.url ?? "/";
  const url = new URL(rawUrl, "http://localhost");
  const sortRaw = url.searchParams.get("sort") ?? "newest";
  const rangeRaw = url.searchParams.get("range") ?? "all";

  return {
    niche: url.searchParams.get("niche") ?? "all",
    account: url.searchParams.get("account") ?? "",
    hashtag: url.searchParams.get("hashtag") ?? "",
    sort: (sortRaw === "most-engagement" ? "most-engagement" : "newest") as AgentSort,
    range: (["all", "24h", "7d", "30d"].includes(rangeRaw) ? rangeRaw : "all") as AgentRange,
    limit: Number(url.searchParams.get("limit") ?? 50),
  };
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end();
    return;
  }

  const params = parseQuery(req);
  const records = await fetchAgentRecords();
  const results = searchAgentRecords(records, params);

  sendJson(res, 200, {
    ok: true,
    sourceCount: records.length,
    count: results.length,
    params,
    results,
  });
}
