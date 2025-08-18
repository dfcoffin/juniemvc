import "@testing-library/jest-dom";
import {afterEach, expect, vi} from "vitest";
import {cleanup} from "@testing-library/react";
import {toHaveNoAccessibilityViolations} from "./axe-setup";
import {toMatchImageSnapshot} from "jest-image-snapshot";

// Add custom matchers
expect.extend({
  toHaveNoAccessibilityViolations,
  toMatchImageSnapshot,
});

// Automatically unmount and cleanup DOM after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  callback: IntersectionObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// Assign the mock to the global object
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Silence console warnings during tests
const originalConsoleWarn = console.warn;
console.warn = (...args: unknown[]) => {
  // Filter out specific warnings you want to ignore during tests
  if (
    args[0] &&
    typeof args[0] === "string" &&
    (args[0].includes("React does not recognize the") ||
      args[0].includes("Warning: useLayoutEffect does nothing on the server"))
  ) {
    return;
  }
  originalConsoleWarn(...args);
};
