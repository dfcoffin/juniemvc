export { default as ErrorBoundary } from "./ErrorBoundary";
export { default as ErrorPage } from "./ErrorPage";

/**
 * Utility function to extract error message from different error types
 * @param error The error object from useRouteError or any other source
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}
