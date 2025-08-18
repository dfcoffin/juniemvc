/**
 * Responsive testing utilities
 *
 * This file contains utilities for testing responsive behavior in components
 * by simulating different viewport sizes and device types.
 */
import {vi} from "vitest";

// Define common viewport sizes for responsive testing
export const viewports = {
  // Mobile viewports
  mobileSm: { width: 320, height: 568 }, // iPhone SE
  mobileMd: { width: 375, height: 667 }, // iPhone 8
  mobileLg: { width: 414, height: 896 }, // iPhone 11 Pro Max

  // Tablet viewports
  tabletSm: { width: 600, height: 960 },
  tabletMd: { width: 768, height: 1024 }, // iPad
  tabletLg: { width: 1024, height: 1366 }, // iPad Pro

  // Desktop viewports
  desktopSm: { width: 1280, height: 720 },
  desktopMd: { width: 1440, height: 900 },
  desktopLg: { width: 1920, height: 1080 },
};

// Set viewport size for testing
export const setViewport = (width: number, height: number): void => {
  // Set viewport size
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: height,
  });

  // Trigger resize event
  window.dispatchEvent(new Event("resize"));
};

// Reset viewport to default size
export const resetViewport = (): void => {
  setViewport(1024, 768); // Default test viewport
};

// Set device type for testing
export const setDeviceType = (
  deviceType: "mobile" | "tablet" | "desktop",
): void => {
  let userAgent = "";

  switch (deviceType) {
    case "mobile":
      userAgent =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1";
      setViewport(viewports.mobileMd.width, viewports.mobileMd.height);
      break;
    case "tablet":
      userAgent =
        "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1";
      setViewport(viewports.tabletMd.width, viewports.tabletMd.height);
      break;
    case "desktop":
    default:
      userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
      setViewport(viewports.desktopMd.width, viewports.desktopMd.height);
      break;
  }

  // Set user agent
  Object.defineProperty(window.navigator, "userAgent", {
    value: userAgent,
    configurable: true,
  });
};

// Helper to test media queries
export const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

// Reset all responsive mocks
export const resetResponsiveMocks = (): void => {
  resetViewport();

  // Reset userAgent
  Object.defineProperty(window.navigator, "userAgent", {
    value:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    configurable: true,
  });

  // Reset matchMedia
  mockMatchMedia(false);
};
