import cors from "cors";
import express from "express";
import helmet from "helmet";

import { connectToDatabase } from "./config/db.config";
import { env } from "./config/env.config";

async function bootstrap(): Promise<void> {
  await connectToDatabase();

  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  app.listen(env.PORT, () => {
    console.log(`API running on port ${env.PORT}`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error("Application failed to start", error);
  process.exit(1);
});
