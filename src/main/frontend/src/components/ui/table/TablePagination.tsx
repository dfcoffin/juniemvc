import React from 'react';
import {cn} from '../../../utils/cn';
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  showPageSizeSelector?: boolean;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
  showPageSizeSelector = true,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value, 10);
    onPageSizeChange?.(newPageSize);
  };
  
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={cn(
            'h-8 min-w-8 px-3 rounded-md text-sm font-medium',
            currentPage === i
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          )}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    return pages;
  };
  
  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between py-4 space-y-3 sm:space-y-0', className)}>
      <div className="text-sm text-slate-500">
        {totalItems > 0 ? (
          <>
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </>
        ) : (
          'No results found'
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center space-x-2 mr-4">
            <span className="text-sm text-slate-500">Rows per page</span>
            <select
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          <button
            className="h-8 w-8 rounded-md flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            className="h-8 w-8 rounded-md flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center space-x-1">
            {renderPageNumbers()}
          </div>
          
          <button
            className="h-8 w-8 rounded-md flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            className="h-8 w-8 rounded-md flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;