import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "production"]).default("production"),
  JWT_SECRET: z.string(),
  PORT: z.string().transform((v) => parseInt(v)),
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
