# Niche-Connect

A community engagement platform built with React, Express, TypeScript, and PostgreSQL.

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (version 20 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** (version 16 or higher)

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

The application requires a PostgreSQL database connection. You need to set up the `DATABASE_URL` environment variable.

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** and update the database connection string with your PostgreSQL credentials:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/niche_connect
   ```

   Replace `username`, `password`, and the database name with your actual PostgreSQL credentials.

## Database Setup

After configuring your environment variables, push the database schema:

```bash
npm run db:push
```

This command uses Drizzle Kit to sync your database schema with the definitions in the codebase.

## Running the Application

### Development Mode

You have two options to run the application in development mode:

**Option 1: Run both client and server together** (recommended):
```bash
npm run dev
```

This starts the Express server with hot-reloading on port 5000. The server also handles serving the Vite development client.

**Option 2: Run client separately**:
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
- Check that the database exists or create it: `createdb niche_connect`

### Port Already in Use

If port 5000 is already in use:
- Stop any other applications using port 5000
- Or modify the port in the `.replit` file or application configuration

### Dependencies Installation Fails

If `npm install` fails:
- Try clearing the npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again