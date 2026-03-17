# Niche-Connect

> Modernes Monorepo mit Web-App + Farcaster/Base Mini App.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-111111?logo=express)](https://expressjs.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=drizzle&logoColor=111111)](https://orm.drizzle.team/)

## Inhalt

- [Preview](#preview)
- [Projektueberblick](#projektueberblick)
- [Apps im Monorepo](#apps-im-monorepo)
- [Tech Stack](#tech-stack)
- [Schnellstart](#schnellstart)
- [Umgebungsvariablen](#umgebungsvariablen)
- [API Endpoints](#api-endpoints)
- [Deployment auf Vercel](#deployment-auf-vercel)
- [NPM Scripts](#npm-scripts)
- [Projektstruktur](#projektstruktur)
- [Architektur Diagramm](#architektur-diagramm)

## Preview

### Hero

![Niche-Connect Hero](apps/miniapp/public/blue-hero.png)

### Product Screens

| Web App | Mini App |
| --- | --- |
| ![Niche-Connect Web Preview](client/public/opengraph.jpg) | ![Mini App Preview](apps/miniapp/public/screenshot.png) |

### Demo GIF Block

![Niche-Connect Demo Loop](docs/media/demo.gif)

Falls das GIF noch nicht vorhanden ist, nutze als temporaeren Fallback:

![Mini App Portrait Preview](apps/miniapp/public/screenshot-portrait.png)

## Projektueberblick

`Niche-Connect` kombiniert zwei Produkte in einem Repo:

- eine **Vite + React + Express** Web-App im Repo-Root
- eine **Next.js Mini App** unter `apps/miniapp` fuer Farcaster/Base

Dadurch kannst du Produktoberflaeche, API und Mini-App parallel entwickeln und getrennt deployen.

## Apps im Monorepo

### `.` (Root): Niche-Connect Web

- Frontend: React + Vite
- Backend: Express (lokal) + Vercel Serverless Functions (`/api/*`)
- Datenbankzugriff: Drizzle ORM + PostgreSQL

### `apps/miniapp`: Base/Farcaster Mini App

- Framework: Next.js 15
- SDKs: `@coinbase/onchainkit`, `@farcaster/miniapp-sdk`, `@farcaster/quick-auth`
- Eigene Auth-Route: `apps/miniapp/app/api/auth/route.ts`

## Tech Stack

- **Languages:** TypeScript
- **Frontend:** React 19, Vite 7, Tailwind CSS 4, Radix UI
- **Backend:** Express 4, Node.js
- **Data:** PostgreSQL, Drizzle ORM, drizzle-kit
- **Mini App:** Next.js 15, OnchainKit, Farcaster SDK
- **Deployment:** Vercel

## Schnellstart

### Voraussetzungen

- Node.js 20+
- npm
- PostgreSQL (oder gehostete DB) fuer die Root-App

### 1. Repository installieren

```bash
cd /home/josef/Niche-Connect
npm install
```

### 2. Root-App starten

```bash
npm run dev
```

### 3. Mini App starten

```bash
cd apps/miniapp
npm install
npm run dev
```

## Umgebungsvariablen

### Root-App (`/`)

Erforderlich fuer DB-Zugriff in den API Functions:

```bash
DATABASE_URL=postgres://user:password@host:5432/dbname
```

### Mini App (`apps/miniapp`)

Typischerweise als `.env.local`:

```bash
NEXT_PUBLIC_PROJECT_NAME="Your App Name"
NEXT_PUBLIC_ONCHAINKIT_API_KEY="<your-cdp-api-key>"
NEXT_PUBLIC_URL="http://localhost:3000"
```

Hinweis: In `apps/miniapp/minikit.config.ts` wird die URL in dieser Reihenfolge aufgeloest:

1. `NEXT_PUBLIC_URL`
2. `VERCEL_PROJECT_PRODUCTION_URL`
3. Fallback `http://localhost:3000`

## API Endpoints

Serverless API unter `/api/*`:

- `GET /api/health` - Healthcheck mit Timestamp
- `POST /api/echo` - Echo fuer Debug/Smoke-Tests
- `GET /api/posts` - Posts abrufen
- `POST /api/posts` - Post erstellen
- `POST /api/posts/sample` - Beispiel-Post erzeugen
- `GET /api/engagements` - Engagements abrufen (optional filterbar mit `postId`, `userId`)
- `POST /api/engagements` - Engagement erstellen

## Deployment auf Vercel

Dieses Monorepo wird als **zwei getrennte Vercel-Projekte** deployed.

### Projekt 1: Mini App

- Root Directory: `apps/miniapp`
- Build Command: `npm run build`
- Output: `.next`

### Projekt 2: Niche-Connect Root-App

- Root Directory: `.`
- Build Command: `npm run build`
- Output: `dist/public`
- API Functions: `api/**/*.ts` (automatisch ueber `@vercel/node`)

Routing fuer die Root-App wird ueber `vercel.json` gesteuert:

- `/api/*` bleibt API
- statische Dateien werden direkt bedient
- alle anderen Routen fallen auf `index.html` zurueck (SPA-Fallback)

## NPM Scripts

### Root (`package.json`)

- `npm run dev` - startet den Node/Express Dev-Server
- `npm run dev:client` - startet Vite auf Port `5000`
- `npm run build` - erstellt Production Build
- `npm run start` - startet die gebaute App
- `npm run check` - TypeScript Typcheck
- `npm run db:push` - pusht Drizzle Schema

### Mini App (`apps/miniapp/package.json`)

- `npm run dev` - Next.js Development
- `npm run build` - Next.js Build
- `npm run start` - Next.js Production Server
- `npm run lint` - Linting

## Projektstruktur

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

## Architektur Diagramm

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

Direktlinks (falls Mermaid-Clicks in deinem Viewer nicht aktiv sind):

- [Root Frontend (`client/`)](./client)
- [Express Server (`server/`)](./server)
- [Vercel API (`api/`)](./api)
- [Schema (`shared/schema.ts`)](./shared/schema.ts)
- [Mini App (`apps/miniapp/`)](./apps/miniapp)

## Hinweis

Die Mini-App basiert auf einem Quickstart-Template. Produktname, Branding und Manifest-Felder in `apps/miniapp/minikit.config.ts` sollten vor Livegang angepasst werden.
