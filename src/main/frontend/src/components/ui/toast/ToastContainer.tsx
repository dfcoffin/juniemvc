import React from "react";
import {createPortal} from "react-dom";
import type {ToastProps} from "./Toast";
import {Toast} from "./Toast";
import {cn} from "../../../utils/cn";

type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

interface ToastContainerProps {
  toasts: Array<Omit<ToastProps, "onClose" | "position">>;
  position?: ToastPosition;
  onClose: (id: string) => void;
}

const positionClasses: Record<ToastPosition, string> = {
  "top-right": "top-0 right-0",
  "top-left": "top-0 left-0",
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "top-center": "top-0 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
};

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = "top-right",
  onClose,
}) => {
  if (!toasts.length) return null;

  return createPortal(
    <div
      className={cn(
        "fixed z-50 p-4 flex flex-col gap-2 max-h-screen overflow-hidden",
        {
          "items-end": position.includes("right"),
          "items-start": position.includes("left"),
          "items-center": position.includes("center"),
          "flex-col-reverse": position.includes("bottom"),
        },
        positionClasses[position],
      )}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onClose}
          position={position}
        />
      ))}
    </div>,
    document.body,
  );
};

export default ToastContainer;
