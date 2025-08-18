import React, {forwardRef, InputHTMLAttributes} from "react";
import {cn} from "../../../utils/cn";

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          id={id}
          ref={ref}
          className={cn(
            "h-4 w-4 rounded-full border border-slate-200 text-slate-900 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

export const RadioGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
}> = ({ children, className, orientation = "vertical" }) => {
  return (
    <div
      className={cn(
        "flex gap-4",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className,
      )}
    >
      {children}
    </div>
  );
};

Radio.displayName = "Radio";

export default Radio;
