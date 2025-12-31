import type { Express } from "express";
import { createApp, initApp } from "../server/app";

let appPromise: Promise<Express> | undefined;

async function getApp(): Promise<Express> {
  if (!appPromise) {
    appPromise = (async () => {
      const app = createApp();
      await initApp(app);
      return app;
    })();
  }

  return appPromise;
}

export default async function handler(req: any, res: any) {
  const app = await getApp();
  app(req, res);
}
