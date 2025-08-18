import React from "react";
import {cn} from "../../../utils/cn";
import {Loader2} from "lucide-react";

interface FormSubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "submit" | "button" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  children,
  isLoading = false,
  loadingText = "Loading...",
  disabled = false,
  variant = "primary",
  size = "md",
  className,
  type = "submit",
  onClick,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantStyles = {
    primary: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    outline:
      "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        isLoading && "opacity-70",
        className,
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default FormSubmitButton;
