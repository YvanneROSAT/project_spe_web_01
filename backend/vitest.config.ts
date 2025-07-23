import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: "./src/",
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
