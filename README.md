# Niche-Connect

A community engagement platform built with React, Express, TypeScript, and PostgreSQL.

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (version 20 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** (version 12 or higher) - *Optional, only needed for persistent data storage*

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd Niche-Connect
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Environment Setup

The application can run with in-memory storage by default for development. However, for production or if you want persistent data, you'll need to set up a PostgreSQL database.

### Optional: Database Configuration

If you want to use PostgreSQL instead of in-memory storage:

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** and update the database connection string with your PostgreSQL credentials:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/niche_connect
   ```

   Replace `username`, `password`, and the database name with your actual PostgreSQL credentials.

3. **Push the database schema** (only needed if using PostgreSQL):
   ```bash
   npm run db:push
   ```

## Running the Application

### Quick Start (No Database Required)

The fastest way to get started is to run the development server, which uses in-memory storage:

```bash
npm run dev
```

This starts the Express server with hot-reloading on port 5000. The server also handles serving the Vite development client.

### Alternative: Client-Only Development

You can also run only the Vite development server:

```bash
npm run dev:client
```

This runs only the Vite development server on port 5000.

### Production Mode

To run the application in production:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

The production server will run on port 5000 by default.

## Available Scripts

- `npm run dev` - Start the development server (backend with Vite integration)
- `npm run dev:client` - Start only the Vite development client
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes to PostgreSQL

## Accessing the Application

Once the application is running, open your browser and navigate to:

```
http://localhost:5000
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:
- Ensure PostgreSQL is running
- Verify your `DATABASE_URL` is correct in the `.env` file
- Check that the database exists or create it using one of these methods:
  - Using psql: `createdb -U username niche_connect`
  - Using SQL: `CREATE DATABASE niche_connect;`
  - Using a GUI tool like pgAdmin or DBeaver

### Port Already in Use

If port 5000 is already in use:
- Stop any other applications using port 5000
- Or modify the port in the `.replit` file or application configuration

### Dependencies Installation Fails

If `npm install` fails:
- Try clearing the npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

---

## Anleitung auf Deutsch / German Instructions

### Code aus Git Repository ausführen

So führen Sie den Code aus einem Git Repository aus:

1. **Repository klonen** (falls noch nicht geschehen):
   ```bash
   git clone https://github.com/jozrftamson/Niche-Connect.git
   cd Niche-Connect
   ```

2. **Abhängigkeiten installieren**:
   ```bash
   npm install
   ```

3. **Anwendung starten**:
   ```bash
   npm run dev
   ```

4. **Im Browser öffnen**: `http://localhost:5000`

Die Anwendung läuft mit In-Memory-Speicher und benötigt keine Datenbank für die Entwicklung.

**Hinweis**: Git ist ein Versionskontrollsystem zum Verwalten von Code. Um den Code auszuführen, müssen Sie ihn zuerst aus Git klonen (wie oben gezeigt) und dann lokal auf Ihrem Computer mit `npm run dev` starten.