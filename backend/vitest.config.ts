import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: "./src/",
    globals: true,
    environment: "node",
    setupFiles: ["./src/env.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
