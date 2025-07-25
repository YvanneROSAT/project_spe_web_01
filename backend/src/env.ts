import dotenv from "dotenv";
dotenv.config({
  quiet: true,
});

import { z } from "zod";

const envSchema = z.object({
  // general
  NODE_ENV: z.enum(["dev", "production", "test"]).default("production"),
  LOG_LEVEL: z.enum(["debug", "info", "error"]).default("info"),
  PORT: z.coerce.number().default(3000),
  BACKEND_URL: z.url(),
  FRONTEND_URL: z.url(),

  // auth
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),

  // redis
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string(),

  // db
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().default("root"),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string().default("project_spe_web"),
});

envSchema.parse(process.env);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
