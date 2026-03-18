const baseUrl = (process.env.A2A_BASE_URL ?? "http://localhost:5000").replace(/\/$/, "");

async function toJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON (${res.status}): ${text.slice(0, 300)}`);
  }
}

async function assertOk(res, label) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${label} failed (${res.status}): ${text}`);
  }
}

async function run() {
  console.log(`A2A smoke against ${baseUrl}`);

  const runRes = await fetch(`${baseUrl}/api/a2a/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      goal: "Find niche and hashtag opportunities",
      input: { niche: "webdev", hashtag: "react", account: "rauchg" },
    }),
  });
  await assertOk(runRes, "POST /api/a2a/run");
  const runPayload = await toJson(runRes);
  const jobId = runPayload?.job?.id;
  if (!jobId) throw new Error("run response missing job.id");

  const agentRes = await fetch(`${baseUrl}/api/a2a/agent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      agentId: "hashtag-analyst",
      input: { hashtag: "react" },
    }),
  });
  await assertOk(agentRes, "POST /api/a2a/agent");
  const agentPayload = await toJson(agentRes);

  const jobRes = await fetch(`${baseUrl}/api/a2a/jobs?jobId=${encodeURIComponent(jobId)}`);
  await assertOk(jobRes, "GET /api/a2a/jobs?jobId");
  const jobPayload = await toJson(jobRes);

  const listRes = await fetch(`${baseUrl}/api/a2a/jobs`);
  await assertOk(listRes, "GET /api/a2a/jobs");
  const listPayload = await toJson(listRes);

  console.log("A2A smoke summary", {
    jobId,
    runStatus: runPayload?.job?.status,
    traceLength: runPayload?.job?.trace?.length ?? 0,
    agent: agentPayload?.agentId,
    jobsListed: Array.isArray(listPayload?.jobs) ? listPayload.jobs.length : 0,
    fetchedJobStatus: jobPayload?.job?.status,
  });
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
