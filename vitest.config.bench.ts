import codspeedPlugin from "@codspeed/vitest-plugin";
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  plugins: [codspeedPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  test: {
    benchmark: {
      include: ["benches/**/*.bench.ts"],
    },
  },
});
