# 🚀 Niche-Connect

> 🧩 Modernes Monorepo mit Web-App + Farcaster/Base Mini App.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-111111?logo=express)](https://expressjs.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=drizzle&logoColor=111111)](https://orm.drizzle.team/)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fjozrftamson%2FNiche-Connect.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fjozrftamson%2FNiche-Connect?ref=badge_shield)

## Inhalt 📚

- 📘 Dokumentations-Hub
- 🌐 Live
- 🎨 Social und Icon Lizenzen
- 👀 Preview
- 🧭 Projektueberblick
- 🏗️ Apps im Monorepo
- 🛠️ Tech Stack
- ⚡ Schnellstart
- 🔐 Umgebungsvariablen
- 🔌 API Endpoints
- 🚢 Deployment auf Vercel
- 📜 NPM Scripts
- 🗂️ Projektstruktur
- 🧠 Architektur Diagramm

## Dokumentations-Hub 📘

Die technische Projektdokumentation liegt im Ordner `docs/`.

- 🧭 Einstieg: [`docs/README.md`](docs/README.md)
- 🛠️ Entwicklung: [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md)
- 🧠 Architektur: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- 🔌 API Referenz: [`docs/API.md`](docs/API.md)
- 🤝 Contribution Guide: [`CONTRIBUTING.md`](CONTRIBUTING.md)
- 🚀 Release Workflow: [`docs/RELEASE.md`](docs/RELEASE.md)

## Live 🌐

- 🖥️ Web App (Landing): [https://niche-connect.vercel.app](https://niche-connect.vercel.app)
- 🔐 Direkt zum Login: [https://niche-connect.vercel.app/auth](https://niche-connect.vercel.app/auth)
- ❤️ API Health: [https://niche-connect.vercel.app/api/health](https://niche-connect.vercel.app/api/health)

## Social und Icon Lizenzen 🎨

🔗 Wenn du unten im Footer Social-Links zeigst, kannst du diese Accounts verwenden:

- 💬 Discord: [https://discord.com](https://discord.com) (spaeter durch deinen Server-Link ersetzen)
- 🐦 X: [https://x.com](https://x.com) (spaeter durch dein Profil ersetzen)
- 🐙 GitHub: [https://github.com](https://github.com) (spaeter durch dein Org/User ersetzen)
- 🦋 Bluesky: [https://bsky.app](https://bsky.app) (spaeter durch dein Profil ersetzen)
- 🔵 Base: [https://www.base.org](https://www.base.org)

🧾 Icon-Hinweis pro Zeile/Beschreibung:

- 💬 Discord Icon (MessageCircle), Quelle: lucide-react, Lizenz: ISC
- 🐦 X Icon (Twitter), Quelle: lucide-react, Lizenz: ISC
- 🐙 GitHub Icon (Github), Quelle: lucide-react, Lizenz: ISC
- 🦋 Bluesky Badge (Text-Badge), keine externe Icon-Lizenz noetig
- 🔵 Base Badge (Text-Badge), keine externe Icon-Lizenz noetig

⚠️ Wichtig: Plattform-Logos koennen zusaetzliche Markenrichtlinien haben. Vor Produktivnutzung immer die Brand-Guidelines von Discord, X, GitHub, Bluesky und Base pruefen.

## Preview 👀

### 🦸 Hero

🖼️ ![Niche-Connect Hero](apps/miniapp/public/blue-hero.png)

### 📱 Product Screens

- 🖥️ Web App: ![Niche-Connect Web Preview](client/public/opengraph.jpg)
- 📲 Mini App: ![Mini App Preview](apps/miniapp/public/screenshot.png)

### 🎬 Demo GIF Block

🖼️ ![Niche-Connect Demo Loop](docs/media/demo.gif)

🧪 Falls das GIF noch nicht vorhanden ist, nutze als temporaeren Fallback:

🖼️ ![Mini App Portrait Preview](apps/miniapp/public/screenshot-portrait.png)

## Projektueberblick 🧭

📦 `Niche-Connect` kombiniert zwei Produkte in einem Repo:

- 🌍 eine **Vite + React + Express** Web-App im Repo-Root
- 🛰️ eine **Next.js Mini App** unter `apps/miniapp` fuer Farcaster/Base

✅ Dadurch kannst du Produktoberflaeche, API und Mini-App parallel entwickeln und getrennt deployen.

## Apps im Monorepo 🏗️

### 🌐 `.` (Root): Niche-Connect Web

- 🎨 Frontend: React + Vite
- ⚙️ Backend: Express (lokal) + Vercel Serverless Functions (`/api/*`)
- 🗄️ Datenbankzugriff: Drizzle ORM + PostgreSQL

### 📲 `apps/miniapp`: Base/Farcaster Mini App

- 🧱 Framework: Next.js 15
- 🧰 SDKs: `@coinbase/onchainkit`, `@farcaster/miniapp-sdk`, `@farcaster/quick-auth`
- 🔐 Eigene Auth-Route: `apps/miniapp/app/api/auth/route.ts`

## Tech Stack 🛠️

- 📝 **Languages:** TypeScript
- 🎨 **Frontend:** React 19, Vite 7, Tailwind CSS 4, Radix UI
- ⚙️ **Backend:** Express 4, Node.js
- 🗄️ **Data:** PostgreSQL, Drizzle ORM, drizzle-kit
- 📲 **Mini App:** Next.js 15, OnchainKit, Farcaster SDK
- 🚀 **Deployment:** Vercel

## Schnellstart ⚡

### 📋 Voraussetzungen

- 🟢 Node.js 20+
- 📦 npm
- 🐘 PostgreSQL (oder gehostete DB) fuer die Root-App

### 1. 📥 Repository installieren

```bash
cd /home/josef/Niche-Connect
npm install
```

### 2. ▶️ Root-App starten

```bash
npm run dev
```

### 3. 📲 Mini App starten

```bash
cd apps/miniapp
npm install
npm run dev
```

## Umgebungsvariablen 🔐

### 🌐 Root-App (`/`)

🧾 Erforderlich fuer DB-Zugriff in den API Functions:

```bash
DATABASE_URL=postgres://user:password@host:5432/dbname
```

### 📲 Mini App (`apps/miniapp`)

🧾 Typischerweise als `.env.local`:

```bash
NEXT_PUBLIC_PROJECT_NAME="Your App Name"
NEXT_PUBLIC_ONCHAINKIT_API_KEY="<your-cdp-api-key>"
NEXT_PUBLIC_URL="http://localhost:3000"
```

💡 Hinweis: In `apps/miniapp/minikit.config.ts` wird die URL in dieser Reihenfolge aufgeloest:

1. 🌍 `NEXT_PUBLIC_URL`
2. 🏷️ `VERCEL_PROJECT_PRODUCTION_URL`
3. 🔁 Fallback `http://localhost:3000`

## CI and security checks

The repository now includes a four-part security baseline:

- `.github/workflows/super-linter.yml`
- `.github/workflows/trivy.yml`
- `.github/workflows/codeql.yml`
- `.github/dependabot.yml`

They run on pull requests, pushes to `main`, and manual workflow dispatches where applicable.

Current checks focus on practical security and repository hygiene:

- GitHub Actions workflow linting
- secret scanning with Gitleaks via Super-Linter
- `.env` file validation
- JSON, YAML, and Markdown validation/formatting checks
- filesystem vulnerability, secret, and misconfiguration scanning with Trivy
- semantic code scanning for JavaScript/TypeScript with CodeQL
- automated dependency and GitHub Actions update PRs via Dependabot

This setup is intentionally conservative so it adds security value without forcing a large code-format migration in the app code.
A useful next step would be adding a repo-wide ESLint or Biome configuration for the root app and then enabling JavaScript/TypeScript checks in Super-Linter too.

You can run Super-Linter locally with Docker:

```bash
docker run --rm \
  -e RUN_LOCAL=true \
  -e DEFAULT_BRANCH=main \
  -e VALIDATE_ALL_CODEBASE=true \
  -e IGNORE_GITIGNORED_FILES=true \
  -e VALIDATE_ENV=true \
  -e VALIDATE_GITHUB_ACTIONS=true \
  -e VALIDATE_GITHUB_ACTIONS_ZIZMOR=true \
  -e VALIDATE_GITLEAKS=true \
  -e VALIDATE_JSON=true \
  -e VALIDATE_JSON_PRETTIER=true \
  -e VALIDATE_MARKDOWN=true \
  -e VALIDATE_YAML=true \
  -e VALIDATE_YAML_PRETTIER=true \
  -v "$(pwd)":/tmp/lint \
  ghcr.io/super-linter/super-linter:latest
```

You can run Trivy locally with Docker:

```bash
docker run --rm \
  -v "$(pwd)":/workdir \
  -w /workdir \
  ghcr.io/aquasecurity/trivy:latest fs \
  --config trivy.yaml \
  --skip-dirs .git \
  --skip-dirs .local \
  --skip-dirs dist \
  --skip-dirs node_modules \
  --skip-dirs apps/miniapp/.next \
  --skip-dirs apps/miniapp/node_modules \
  .
```

Dependabot checks weekly for updates in:

- root npm dependencies (`/package.json`)
- miniapp npm dependencies (`/apps/miniapp/package.json`)
- GitHub Actions versions under `.github/workflows`

CodeQL runs on pull requests, pushes to `main`, weekly on a schedule, and via manual dispatch. It is configured for JavaScript/TypeScript and complements Trivy by analyzing source code patterns instead of only filesystem/package risks.

Recommended review flow for security automation:

1. let CI run first
2. fix CodeQL or Trivy findings with the highest severity first
3. merge patch/minor Dependabot updates that pass cleanly
4. review major dependency updates more carefully

## API Endpoints 🔌

⚡ Serverless API unter `/api/*`:

- ❤️ `GET /api/health` - Healthcheck mit Timestamp
- 🧪 `POST /api/echo` - Echo fuer Debug/Smoke-Tests
- 📖 `GET /api/posts` - Posts abrufen
- ✍️ `POST /api/posts` - Post erstellen
- 🎲 `POST /api/posts/sample` - Beispiel-Post erzeugen
- 📈 `GET /api/engagements` - Engagements abrufen (optional filterbar mit `postId`, `userId`)
- ✅ `POST /api/engagements` - Engagement erstellen

## Deployment auf Vercel 🚢

📦 Dieses Monorepo wird als **zwei getrennte Vercel-Projekte** deployed.

### 1️⃣ Projekt 1: Mini App

- 📁 Root Directory: `apps/miniapp`
- 🛠️ Build Command: `npm run build`
- 📤 Output: `.next`

### 2️⃣ Projekt 2: Niche-Connect Root-App

- 📁 Root Directory: `.`
- 🛠️ Build Command: `npm run build`
- 📤 Output: `dist/public`
- ⚡ API Functions: `api/**/*.ts` (automatisch ueber `@vercel/node`)

🧭 Routing fuer die Root-App wird ueber `vercel.json` gesteuert:

- 🔌 `/api/*` bleibt API
- 📄 statische Dateien werden direkt bedient
- 🔁 alle anderen Routen fallen auf `index.html` zurueck (SPA-Fallback)

## NPM Scripts 📜

### 🌐 Root (`package.json`)

- ▶️ `npm run dev` - startet den Node/Express Dev-Server
- 🧪 `npm run dev:client` - startet Vite auf Port `5000`
- 🏗️ `npm run build` - erstellt Production Build
- 🚀 `npm run start` - startet die gebaute App
- ✅ `npm run check` - TypeScript Typcheck
- 🗃️ `npm run db:push` - pusht Drizzle Schema

### 📲 Mini App (`apps/miniapp/package.json`)

- ▶️ `npm run dev` - Next.js Development
- 🏗️ `npm run build` - Next.js Build
- 🚀 `npm run start` - Next.js Production Server
- 🧹 `npm run lint` - Linting

## Projektstruktur 🗂️

```text
.
|- api/                 # Vercel Functions fuer Root-App
|- apps/miniapp/        # Next.js Mini App (Farcaster/Base)
|- client/              # React Frontend (Vite)
|- server/              # Express Server (lokale Runtime)
|- shared/              # Shared Types/Schemas
|- script/build.ts      # Build Pipeline
|- vercel.json          # Vercel Routing/Build Konfiguration
```

## Architektur Diagramm 🧠

```mermaid
flowchart LR
  U[User Browser]
  FE[Root Frontend\nclient/ (Vite + React)]
  EX[Express Dev Server\nserver/]
  VF[Vercel Functions\napi/*]
  DB[(PostgreSQL)]
  MA[Mini App\napps/miniapp (Next.js)]
  FC[Farcaster/Base]

  U --> FE
  FE --> EX
  FE --> VF
  VF --> DB

  U --> MA
  MA --> FC

  click FE "./client" "Open client/"
  click EX "./server" "Open server/"
  click VF "./api" "Open api/"
  click DB "./shared/schema.ts" "Open schema"
  click MA "./apps/miniapp" "Open miniapp"
```

🔗 Direktlinks (falls Mermaid-Clicks in deinem Viewer nicht aktiv sind):

- 🎨 [Root Frontend (`client/`)](./client)
- ⚙️ [Express Server (`server/`)](./server)
- 🔌 [Vercel API (`api/`)](./api)
- 🧬 [Schema (`shared/schema.ts`)](./shared/schema.ts)
- 📲 [Mini App (`apps/miniapp/`)](./apps/miniapp)

## Hinweis ℹ️

🛎️ Die Mini-App basiert auf einem Quickstart-Template. Produktname, Branding und Manifest-Felder in `apps/miniapp/minikit.config.ts` sollten vor Livegang angepasst werden.

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fjozrftamson%2FNiche-Connect.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fjozrftamson%2FNiche-Connect?ref=badge_large)
