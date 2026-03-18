import { randomUUID } from "crypto";
import { z } from "zod";

export const a2aAgentIds = ["niche-scout", "hashtag-analyst", "account-profiler"] as const;
export type A2AAgentId = (typeof a2aAgentIds)[number];

export type A2AJobStatus = "pending" | "running" | "completed" | "failed";

export interface A2AMessage {
  at: string;
  from: "orchestrator" | A2AAgentId;
  to: "orchestrator" | A2AAgentId;
  type: "task" | "result" | "error";
  task: string;
  payload: unknown;
}

export interface A2AJob {
  id: string;
  goal: string;
  status: A2AJobStatus;
  createdAt: string;
  updatedAt: string;
  input: Record<string, string>;
  agents: A2AAgentId[];
  trace: A2AMessage[];
  result: Record<string, unknown>;
  error?: string;
}

const a2aRunSchema = z.object({
  goal: z.string().min(3).max(300),
  input: z.record(z.string(), z.string()).default({}),
  agents: z.array(z.enum(a2aAgentIds)).optional(),
});

const a2aAgentInvokeSchema = z.object({
  agentId: z.enum(a2aAgentIds),
  input: z.record(z.string(), z.string()).default({}),
});

const jobs = new Map<string, A2AJob>();

function nowIso() {
  return new Date().toISOString();
}

function pushTrace(job: A2AJob, message: Omit<A2AMessage, "at">) {
  job.trace.push({ at: nowIso(), ...message });
  job.updatedAt = nowIso();
}

function inferAgents(input: Record<string, string>): A2AAgentId[] {
  const selected: A2AAgentId[] = [];

  if (input.niche) selected.push("niche-scout");
  if (input.hashtag) selected.push("hashtag-analyst");
  if (input.account) selected.push("account-profiler");

  return selected.length ? selected : ["niche-scout", "hashtag-analyst", "account-profiler"];
}

function runSingleAgent(agentId: A2AAgentId, input: Record<string, string>) {
  if (agentId === "niche-scout") {
    const niche = input.niche ?? "general";
    return {
      niche,
      candidates: [
        { topic: niche, confidence: 0.92 },
        { topic: `${niche}-growth`, confidence: 0.81 },
      ],
    };
  }

  if (agentId === "hashtag-analyst") {
    const hashtag = (input.hashtag ?? "trending").replace(/^#/, "").toLowerCase();
    return {
      hashtag,
      trendScore: Math.min(99, 60 + hashtag.length * 2),
      related: [hashtag, `${hashtag}tips`, `${hashtag}2026`],
    };
  }

  const account = (input.account ?? "creator").replace(/^@/, "").toLowerCase();
  return {
    account,
    profileScore: Math.min(98, 70 + account.length),
    suggestion: `Focus replies on ${account}'s top content themes`,
  };
}

export function createA2AJob(payload: unknown) {
  const parsed = a2aRunSchema.parse(payload);
  const id = `job_${randomUUID()}`;
  const agents = parsed.agents?.length ? parsed.agents : inferAgents(parsed.input);

  const job: A2AJob = {
    id,
    goal: parsed.goal,
    status: "pending",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    input: parsed.input,
    agents,
    trace: [],
    result: {},
  };

  jobs.set(id, job);
  return job;
}

export function executeA2AJob(jobId: string) {
  const job = jobs.get(jobId);
  if (!job) {
    throw new Error("Job not found");
  }

  try {
    job.status = "running";
    job.updatedAt = nowIso();

    for (const agentId of job.agents) {
      pushTrace(job, {
        from: "orchestrator",
        to: agentId,
        type: "task",
        task: `Run ${agentId}`,
        payload: { goal: job.goal, input: job.input },
      });

      const output = runSingleAgent(agentId, job.input);
      job.result[agentId] = output;

      pushTrace(job, {
        from: agentId,
        to: "orchestrator",
        type: "result",
        task: `${agentId} completed`,
        payload: output,
      });
    }

    job.status = "completed";
    job.updatedAt = nowIso();
  } catch (error) {
    job.status = "failed";
    job.error = error instanceof Error ? error.message : "Unknown execution error";
    job.updatedAt = nowIso();

    pushTrace(job, {
      from: "orchestrator",
      to: "orchestrator",
      type: "error",
      task: "Job failed",
      payload: { error: job.error },
    });
  }

  return job;
}

export function invokeA2AAgent(payload: unknown) {
  const parsed = a2aAgentInvokeSchema.parse(payload);
  const output = runSingleAgent(parsed.agentId, parsed.input);

  return {
    agentId: parsed.agentId,
    input: parsed.input,
    output,
  };
}

export function getA2AJob(jobId: string) {
  return jobs.get(jobId) ?? null;
}

export function listA2AJobs() {
  return Array.from(jobs.values())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 50);
}
