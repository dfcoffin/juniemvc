import React from "react";
import {createPortal} from "react-dom";
import {cn} from "../../../utils/cn";
import {Loader2} from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
  spinnerSize?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  backgroundColor?: string;
  zIndex?: number;
}

const spinnerSizeMap = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-16 w-16",
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = "Loading...",
  className,
  spinnerSize = "md",
  fullScreen = false,
  backgroundColor = "bg-white/80",
  zIndex = 50,
}) => {
  if (!isLoading) return null;

  const overlay = (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        fullScreen ? "fixed inset-0" : "absolute inset-0",
        backgroundColor,
        `z-${zIndex}`,
        "transition-opacity duration-300",
        className,
      )}
    >
      <Loader2
        className={cn(
          "animate-spin text-slate-700",
          spinnerSizeMap[spinnerSize],
        )}
      />
      {message && (
        <div className="mt-4 text-sm font-medium text-slate-700">{message}</div>
      )}
    </div>
  );

  return fullScreen ? createPortal(overlay, document.body) : overlay;
};

// withLoading HOC moved to separate file

export default LoadingOverlay;
