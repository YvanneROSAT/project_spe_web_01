import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string(),
  PORT: z.string().transform((v) => parseInt(v)),
});

envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
