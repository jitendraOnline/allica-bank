import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts", // optional, see step 4
    css: true,
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
