import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

const envSchema = z.object({
  // general
  NODE_ENV: z.enum(["dev", "production", "test"]).default("production"),
  LOG_LEVEL: z.enum(["debug", "info"]).default("info"),
  PORT: z.string().transform((v) => parseInt(v)),
  FRONTEND_URL: z.url(),

  // auth
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),

  // db
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z
    .string()
    .transform((v) => parseInt(v))
    .default(3306),
  DB_USER: z.string().default("root"),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string().default("project_spe_web"),
});

envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
