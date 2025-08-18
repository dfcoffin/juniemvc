import type {ReactNode} from "react";
import React from "react";
import Breadcrumbs from "../navigation/Breadcrumbs";

interface PageContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: { label: string; to: string }[];
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  children,
  actions,
  breadcrumbs,
}) => {
  return (
    <div className="space-y-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        )}
      </div>

      <div className="rounded-lg border bg-white p-4 md:p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
