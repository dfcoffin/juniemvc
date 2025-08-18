/// <reference types="vitest" />
import {configDefaults, defineConfig} from "vitest/config";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov", "json-summary"],
      reportsDirectory: "./coverage",
      exclude: [
        ...(configDefaults.coverage.exclude || []),
        "**/*.d.ts",
        "**/types/**",
        "**/*.config.*",
        "**/dist/**",
        "**/index.ts",
        "**/*.stories.*",
        "**/test/**",
      ],
      all: true,
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
      // Generate coverage for files without tests
      include: ["src/**/*.{ts,tsx}"],
    },
    exclude: [
      ...(configDefaults.exclude || []),
      "e2e/*",
      "src/integration-tests/**",
      "src/components/layout/__tests__/ResponsiveLayout.test.tsx",
    ],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Add HTML reporter for better visualization
    reporters: ["default", "html"],
    outputFile: {
      html: "./test-results/html",
    },
  },
});
