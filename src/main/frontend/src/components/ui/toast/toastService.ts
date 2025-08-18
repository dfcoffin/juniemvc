import {useToast} from "./ToastContext";

// We need to get a reference to the useToast hook at runtime
// This is a singleton for the toast functionality
let toastHookRef: ReturnType<typeof useToast> | null = null;

// Custom hook that should be used in your app root component
export const useInitializeToast = () => {
  const toast = useToast();
  toastHookRef = toast;
  return toast;
};

// This function should be called in your app root component to initialize the toast reference
export const initializeToast = () => {
  // This is just a wrapper that will be used in JSX
  // The actual hook usage happens in useInitializeToast
  return null;
};

// Utility to check if toast is initialized
const ensureToastInitialized = () => {
  if (!toastHookRef) {
    console.warn(
      "Toast not initialized. Call initializeToast() in your app root component.",
    );
    return false;
  }
  return true;
};

// Toast utility methods that can be imported directly
export const toast = {
  success: (
    message: string,
    options?: { title?: string; duration?: number },
  ) => {
    if (ensureToastInitialized()) {
      return toastHookRef!.addToast({
        message,
        type: "success",
        ...options,
      });
    }
    return "";
  },

  error: (message: string, options?: { title?: string; duration?: number }) => {
    if (ensureToastInitialized()) {
      return toastHookRef!.addToast({
        message,
        type: "error",
        ...options,
      });
    }
    return "";
  },

  warning: (
    message: string,
    options?: { title?: string; duration?: number },
  ) => {
    if (ensureToastInitialized()) {
      return toastHookRef!.addToast({
        message,
        type: "warning",
        ...options,
      });
    }
    return "";
  },

  info: (message: string, options?: { title?: string; duration?: number }) => {
    if (ensureToastInitialized()) {
      return toastHookRef!.addToast({
        message,
        type: "info",
        ...options,
      });
    }
    return "";
  },
};
