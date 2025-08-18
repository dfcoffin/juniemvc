/* eslint-disable react-refresh/only-export-components */
import React, {createContext, ReactNode, useCallback, useContext, useState,} from "react";
import {v4 as uuidv4} from "uuid";
import ToastContainer from "./ToastContainer";
import type {Toast, ToastContextType} from "./types";

// Create the context with default values
const ToastContext = createContext<ToastContextType>({
  addToast: () => "",
  removeToast: () => {},
  removeAllToasts: () => {},
  toasts: [],
});

// Custom hook to use the toast context
export const useToast = () => useContext(ToastContext);

interface ToastProviderProps {
  children: ReactNode;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = "top-right",
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add a new toast
  const addToast = useCallback(
    (toast: Omit<Toast, "id">): string => {
      const id = uuidv4();

      // Add the new toast to the beginning of the array
      setToasts((prevToasts) => {
        // If we have reached the maximum number of toasts, remove the oldest one
        const newToasts =
          maxToasts && prevToasts.length >= maxToasts
            ? prevToasts.slice(0, maxToasts - 1)
            : [...prevToasts];

        return [{ id, ...toast }, ...newToasts];
      });

      return id;
    },
    [maxToasts],
  );

  // Remove a toast by id
  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Remove all toasts
  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Create convenient helper methods
  const toast = {
    success: (
      message: string,
      options?: Partial<Omit<Toast, "id" | "message" | "type">>,
    ) => addToast({ message, type: "success", ...options }),

    error: (
      message: string,
      options?: Partial<Omit<Toast, "id" | "message" | "type">>,
    ) => addToast({ message, type: "error", ...options }),

    warning: (
      message: string,
      options?: Partial<Omit<Toast, "id" | "message" | "type">>,
    ) => addToast({ message, type: "warning", ...options }),

    info: (
      message: string,
      options?: Partial<Omit<Toast, "id" | "message" | "type">>,
    ) => addToast({ message, type: "info", ...options }),
  };

  return (
    <ToastContext.Provider
      value={
        {
          addToast,
          removeToast,
          removeAllToasts,
          toasts,
          ...toast,
        } as ToastContextType
      }
    >
      {children}
      <ToastContainer
        toasts={toasts}
        position={position}
        onClose={removeToast}
      />
    </ToastContext.Provider>
  );
};

// Toast utility functions are now in toastUtils.ts
