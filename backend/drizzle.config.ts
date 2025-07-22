import { DB_CONNECTION_CONFIG } from "@/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "mysql",
  dbCredentials: DB_CONNECTION_CONFIG,
  verbose: true,
  strict: true,
});
