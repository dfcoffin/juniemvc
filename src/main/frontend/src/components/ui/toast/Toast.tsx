import React, {useEffect, useState} from "react";
import {cn} from "../../../utils/cn";
import {AlertCircle, AlertTriangle, CheckCircle, Info, X} from "lucide-react";

export type ToastType = "info" | "success" | "warning" | "error";

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: (id: string) => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type = "info",
  duration = 5000,
  onClose,
  // position is not used in this component, but kept for API consistency

  // position = "top-right",
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 300);

    const closeTimer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  const iconMap: Record<ToastType, React.ReactNode> = {
    info: <Info className="h-5 w-5 text-blue-400" />,
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
    error: <AlertCircle className="h-5 w-5 text-red-400" />,
  };

  const colorMap: Record<ToastType, string> = {
    info: "border-blue-400 bg-blue-50",
    success: "border-green-400 bg-green-50",
    warning: "border-yellow-400 bg-yellow-50",
    error: "border-red-400 bg-red-50",
  };

  return (
    <div
      className={cn(
        "max-w-sm w-full rounded-lg shadow-lg border-l-4 bg-white overflow-hidden transition-all duration-300 ease-in-out",
        colorMap[type],
        isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0",
      )}
      role="alert"
    >
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0 mr-3">{iconMap[type]}</div>
        <div className="flex-1">
          {title && <h4 className="text-sm font-medium">{title}</h4>}
          <div className="text-sm text-slate-500 mt-1">{message}</div>
        </div>
        <button
          type="button"
          className="ml-3 flex-shrink-0 text-slate-400 hover:text-slate-600 focus:outline-none"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="relative h-1 w-full bg-slate-200">
        <div
          className={cn(
            "absolute inset-0 transition-transform duration-300",
            {
              info: "bg-blue-400",
              success: "bg-green-400",
              warning: "bg-yellow-400",
              error: "bg-red-400",
            }[type],
          )}
          style={{
            animation: `shrink ${duration}ms linear forwards`,
            transformOrigin: "left",
          }}
        />
      </div>
    </div>
  );
};

export default Toast;

// CSS Animation defined in global styles
// @keyframes shrink {
//   from { transform: scaleX(1); }
//   to { transform: scaleX(0); }
// }
