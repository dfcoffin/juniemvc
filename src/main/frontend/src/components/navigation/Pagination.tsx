import React from 'react';
import {cn} from '../../utils/cn';
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'minimal';
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = true,
  maxVisiblePages = 5,
  size = 'md',
  variant = 'default',
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  // Calculate visible page range
  const getVisiblePages = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const visiblePages = getVisiblePages();

  // Size variants
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  // Style variants
  const getButtonStyles = (isActive: boolean) => {
    const baseStyles = 'flex items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    switch (variant) {
      case 'outline':
        return cn(
          baseStyles,
          sizeClasses[size],
          'border',
          isActive
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        );
      case 'minimal':
        return cn(
          baseStyles,
          sizeClasses[size],
          isActive
            ? 'bg-slate-100 text-slate-900 font-medium'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        );
      default: // default variant
        return cn(
          baseStyles,
          sizeClasses[size],
          isActive
            ? 'bg-slate-900 text-white'
            : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        );
    }
  };

  const navButtonStyles = cn(
    'flex items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    sizeClasses[size],
    variant === 'outline'
      ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
      : variant === 'minimal'
      ? 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
      : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
  );

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      {showFirstLast && (
        <button
          className={navButtonStyles}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          aria-label="Go to first page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      )}

      <button
        className={navButtonStyles}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          className={getButtonStyles(page === currentPage)}
          onClick={() => handlePageChange(page)}
          disabled={page === currentPage}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      <button
        className={navButtonStyles}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {showFirstLast && (
        <button
          className={navButtonStyles}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      )}
    </nav>
  );
};

export default Pagination;