import React, {ThHTMLAttributes} from 'react';
import {cn} from '../../../utils/cn';

// TableHeader component
interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <thead ref={ref} className={cn('bg-slate-50', className)} {...props}>
      {children}
    </thead>
  )
);

TableHeader.displayName = 'TableHeader';

// TableHeaderRow component
interface TableHeaderRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

export const TableHeaderRow = React.forwardRef<HTMLTableRowElement, TableHeaderRowProps>(
  ({ className, children, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('border-b border-slate-200 transition-colors', className)}
      {...props}
    >
      {children}
    </tr>
  )
);

TableHeaderRow.displayName = 'TableHeaderRow';

// TableHead component for header cells
interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, sortable, sorted, onSort, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-slate-700',
        sortable && 'cursor-pointer select-none',
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && (
          <div className="ml-1">
            {sorted === 'asc' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            )}
            {sorted === 'desc' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            )}
            {sorted === null && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 opacity-0 group-hover:opacity-50"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            )}
          </div>
        )}
      </div>
    </th>
  )
);

TableHead.displayName = 'TableHead';

export default {
  Header: TableHeader,
  Row: TableHeaderRow,
  Cell: TableHead,
};