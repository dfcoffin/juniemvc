import React from "react";
import {cn} from "../../../utils/cn";

// TableBody component
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, children, ...props }, ref) => (
  <tbody ref={ref} className={cn(className)} {...props}>
    {children}
  </tbody>
));

TableBody.displayName = "TableBody";

// TableRow component
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  isSelected?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, isSelected, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-slate-200 transition-colors hover:bg-slate-50",
        isSelected && "bg-slate-50",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  ),
);

TableRow.displayName = "TableRow";

// TableCell component
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => (
    <td ref={ref} className={cn("p-4 align-middle", className)} {...props}>
      {children}
    </td>
  ),
);

TableCell.displayName = "TableCell";

export default {
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
};
