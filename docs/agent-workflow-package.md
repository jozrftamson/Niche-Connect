# Agent Package Blueprint for Niche-Connect

This document describes what your miniapp-based website needs to run multiple agents for niche, account, and hashtag search using JSON workflows.

## Implemented in this repo

- Search endpoint: `GET /api/agents/search`
- Workflow engine endpoint: `POST /api/agents/workflow`
- Package catalog endpoint: `GET /api/agents/packages`
- Package persistence endpoint: `POST /api/agents/packages`
- Shared workflow motor: `api/_agentEngine.ts`
- Feed UI filters for `niche`, `account`, `hashtag`, `range`, `sort`
- Agent Studio UI route: `/agents`

## Core website requirements for multi-agent operation

1. Agent registry

- Store package metadata (`id`, `title`, `description`, `workflow template`).
- Support versioning so workflow changes are traceable.

1. Workflow runtime

- Validate JSON workflow input before execution.
- Execute steps deterministically (`filter`, `sort`, `limit`).
- Return execution trace with per-step record counts.

1. Data normalization

- Normalize account names and hashtags to lowercase.
- Convert all timestamps to ISO format.
- Keep a stable schema for post/search records.

1. API contract stability

- Keep all agent routes under `/api/agents/*`.
- Return consistent payload shape: `ok`, `count`, `params` or `trace`, `results`.
- Include source/result counts for observability.

1. UI integration

- Sync filter state to URL for deep-link sharing.
- Provide direct filters for niche, account, hashtag.
- Surface loading state for agent queries.

1. Safety and controls

- Enforce limit boundaries (`1..200`) to avoid oversized responses.
- Validate workflow schema with strict typing.
- Reject invalid payloads with clear issue lists.

1. Miniapp connection layer

- Keep miniapp UI thin: call `search` for simple usage, `workflow` for advanced automation.
- Reuse same workflow templates between web and miniapp.
- Keep auth/session integration separate from workflow logic.

## JSON workflow format

```json
{
  "name": "trend-radar",
  "input": {
    "hashtag": "react"
  },
  "steps": [
    { "type": "filter", "field": "hashtag", "operator": "includes", "fromInput": "hashtag" },
    { "type": "sort", "by": "most-engagement" },
    { "type": "limit", "value": 25 }
  ]
}
```

## Example: simple search call

`GET /api/agents/search?niche=webdev&account=rauchg&hashtag=react&range=7d&sort=most-engagement&limit=20`

## Example: workflow execution call

```http
POST /api/agents/workflow
Content-Type: application/json
```

```json
{
  "workflow": {
    "name": "account-monitor",
    "input": {
      "account": "rauchg"
    },
    "steps": [
      { "type": "filter", "field": "account", "operator": "includes", "fromInput": "account" },
      { "type": "sort", "by": "most-engagement" },
      { "type": "limit", "value": 10 }
    ]
  }
}
```

## Smoke test

Run the API smoke test against local or deployed base URL:

`AGENT_BASE_URL=https://your-host npm run test:agents`

## Next technical upgrades

- Add `step.type = "project"` for custom response shape per workflow.
- Add DB-level indexing for `niche`, `createdAt`, `engagementScore`.
- Add per-package ACL if packages are user-owned.
- Add audit log for workflow runs and latency metrics.
