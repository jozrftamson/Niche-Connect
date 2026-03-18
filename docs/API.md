# API Reference

Base URL examples assume local root runtime: `http://localhost:5000`.

## Health and Debug

### GET /api/health

Returns runtime health and timestamp.

Example:

```bash
curl -s http://localhost:5000/api/health
```

### POST /api/echo

Echoes back request body.

Example:

```bash
curl -s -X POST http://localhost:5000/api/echo \
  -H "content-type: application/json" \
  -d '{"hello":"world"}'
```

## Posts

### GET /api/posts

Query params:

- `niche`: default `all`
- `sort`: `newest` or `most-engagement`
- `range`: `all`, `24h`, `7d`, `30d`

Example:

```bash
curl -s "http://localhost:5000/api/posts?niche=webdev&sort=most-engagement&range=7d"
```

Response shape:

```json
{
  "ok": true,
  "params": { "niche": "webdev", "sort": "most-engagement", "range": "7d" },
  "count": 12,
  "posts": []
}
```

### POST /api/posts

Creates a post validated by zod schema.

Example:

```bash
curl -s -X POST http://localhost:5000/api/posts \
  -H "content-type: application/json" \
  -d '{
    "platform":"x",
    "platformPostId":"post-001",
    "text":"Hello niche",
    "url":"https://example.com/post/1",
    "niche":"webdev",
    "engagementScore":12
  }'
```

### POST /api/posts/sample

Creates a sample post record.

```bash
curl -s -X POST http://localhost:5000/api/posts/sample
```

## Engagements

### GET /api/engagements

Optional query params:

- `postId`
- `userId`

```bash
curl -s "http://localhost:5000/api/engagements?postId=abc123"
```

### POST /api/engagements

```bash
curl -s -X POST http://localhost:5000/api/engagements \
  -H "content-type: application/json" \
  -d '{
    "postId":"abc123",
    "userId":"user-42",
    "type":"comment",
    "message":"Nice post"
  }'
```

## Agent APIs

### GET /api/agents/search

Query params:

- `niche` (default `all`)
- `account`
- `hashtag`
- `sort`: `newest` or `most-engagement`
- `range`: `all`, `24h`, `7d`, `30d`
- `limit` (numeric)

```bash
curl -s "http://localhost:5000/api/agents/search?niche=webdev&hashtag=react&sort=most-engagement&range=7d&limit=20"
```

Response shape:

```json
{
  "ok": true,
  "sourceCount": 100,
  "count": 20,
  "params": {},
  "results": []
}
```

### POST /api/agents/workflow

Accepts workflow payload directly or via package resolution using `packageId`.

Direct workflow example:

```bash
curl -s -X POST http://localhost:5000/api/agents/workflow \
  -H "content-type: application/json" \
  -d '{
    "workflow": {
      "name": "trend-radar",
      "input": { "hashtag": "react" },
      "steps": [
        { "type": "filter", "field": "hashtag", "operator": "includes", "fromInput": "hashtag" },
        { "type": "sort", "by": "most-engagement" },
        { "type": "limit", "value": 25 }
      ]
    }
  }'
```

Package-based workflow example:

```bash
curl -s -X POST http://localhost:5000/api/agents/workflow \
  -H "content-type: application/json" \
  -d '{
    "packageId": "pkg-id-here",
    "input": { "account": "rauchg" }
  }'
```

### GET /api/agents/packages

```bash
curl -s http://localhost:5000/api/agents/packages
```

### POST /api/agents/packages

```bash
curl -s -X POST http://localhost:5000/api/agents/packages \
  -H "content-type: application/json" \
  -d '{
    "slug":"account-monitor-v1",
    "title":"Account Monitor",
    "description":"Track high-engagement posts for one account",
    "workflowJson":"{\"name\":\"account-monitor\",\"input\":{\"account\":\"rauchg\"},\"steps\":[{\"type\":\"filter\",\"field\":\"account\",\"operator\":\"includes\",\"fromInput\":\"account\"},{\"type\":\"sort\",\"by\":\"most-engagement\"},{\"type\":\"limit\",\"value\":10}]}"
  }'
```

## A2A APIs

### POST /api/a2a/run

Creates and executes an orchestrated A2A job.

```bash
curl -s -X POST http://localhost:5000/api/a2a/run \
  -H "content-type: application/json" \
  -d '{
    "goal":"Find opportunities for engagement",
    "input":{
      "niche":"webdev",
      "hashtag":"react",
      "account":"rauchg"
    }
  }'
```

### POST /api/a2a/agent

Invokes a single A2A agent.

```bash
curl -s -X POST http://localhost:5000/api/a2a/agent \
  -H "content-type: application/json" \
  -d '{
    "agentId":"niche-scout",
    "input":{"niche":"webdev"}
  }'
```

### GET /api/a2a/jobs

Lists jobs:

```bash
curl -s http://localhost:5000/api/a2a/jobs
```

Fetches one job:

```bash
curl -s "http://localhost:5000/api/a2a/jobs?jobId=<job-id>"
```

## Error Behavior

- Validation failures return `400` with `ok: false` and `issues` from zod.
- Missing resources (for example package/job) return `404`.
- Unsupported HTTP method returns `405`.
- Internal failures return `500`.
