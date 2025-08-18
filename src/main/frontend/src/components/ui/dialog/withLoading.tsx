import React from "react";
import LoadingOverlay from "./LoadingOverlay";

// Higher-order component for wrapping components with loading state
const withLoading = <P extends object>(
  Component: React.ComponentType<P>,
  loadingProp: keyof P = "isLoading" as keyof P,
): React.FC<
  P & { loadingMessage?: string; spinnerSize?: "sm" | "md" | "lg" }
> => {
  return ({ loadingMessage, spinnerSize, ...props }) => {
    const isLoading = props[loadingProp] as boolean;

    return (
      <div className="relative">
        <Component {...(props as P)} />
        {isLoading && (
          <LoadingOverlay
            isLoading={true}
            message={loadingMessage}
            spinnerSize={spinnerSize}
          />
        )}
      </div>
    );
  };
};

export default withLoading;
