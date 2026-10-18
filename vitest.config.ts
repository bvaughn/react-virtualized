import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: true,
      include: ["lib/**/*.test.{ts,tsx}"],
      setupFiles: "./vitest.setup.ts"
    }
  })
);
