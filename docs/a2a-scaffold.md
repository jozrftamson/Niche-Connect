# A2A Scaffold

This scaffold adds a simple Agent-to-Agent workflow foundation.

## Endpoints

- `POST /api/a2a/run` - creates and executes an orchestrated job
- `POST /api/a2a/agent` - invokes a single agent directly
- `GET /api/a2a/jobs` - lists recent jobs
- `GET /api/a2a/jobs?jobId=<id>` - fetches one job

## Agent IDs

- `niche-scout`
- `hashtag-analyst`
- `account-profiler`

## Example run payload

```json
{
  "goal": "Find opportunities for engagement",
  "input": {
    "niche": "webdev",
    "hashtag": "react",
    "account": "rauchg"
  }
}
```

## Smoke test

```bash
A2A_BASE_URL=https://your-deployment.vercel.app npm run test:a2a
```

Use `http://localhost:5000` for local checks.
