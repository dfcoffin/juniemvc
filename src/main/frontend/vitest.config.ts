/// <reference types="vitest" />
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {configDefaults} from 'vitest/config';
import path from 'path';
import {expect} from 'vitest';
import {toMatchImageSnapshot} from 'jest-image-snapshot';

// Extend vitest with snapshot matcher
expect.extend({ toMatchImageSnapshot });

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      reportsDirectory: './coverage',
      exclude: [
        ...configDefaults.coverage.exclude || [],
        '**/*.d.ts',
        '**/types/**',
        '**/*.config.*',
        '**/dist/**',
        '**/index.ts',
        '**/*.stories.*',
        '**/test/**',
      ],
      all: true,
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
      // Generate coverage for files without tests
      include: ['src/**/*.{ts,tsx}'],
    },
    exclude: [...configDefaults.exclude || [], 'e2e/*'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    // Add HTML reporter for better visualization
    reporters: ['default', 'html'],
    outputFile: {
      html: './test-results/html',
    },
  },
});