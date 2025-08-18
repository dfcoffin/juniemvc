import {useToast} from "./ToastContext";
import type {Toast} from "./types";

// Re-export the useToast hook from ToastContext
export { useToast };

// Custom hook to get toast functions for use in components
export const useToastUtils = () => {
  const { addToast } = useToast();

  return {
    success: (
      message: string,
      options?: Partial<Omit<Toast, "id" | "message" | "type">>,
    ) => {
      return addToast({ message, type: "success", ...options });
    },
    error: (
      message: string,
      options?: Partial<Omit<Toast, "id" | "message" | "type">>,
    ) => {
      return addToast({ message, type: "error", ...options });
    },
    warning: (
      message: string,
      options?: Partial<Omit<Toast, "id" | "message" | "type">>,
    ) => {
      return addToast({ message, type: "warning", ...options });
    },
    info: (
      message: string,
      options?: Partial<Omit<Toast, "id" | "message" | "type">>,
    ) => {
      return addToast({ message, type: "info", ...options });
    },
  };
};
