import React, {useState} from 'react';
import {cn} from '../../../utils/cn';
import {ChevronDown, Filter, Search, X} from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  options?: { value: string; label: string }[];
  type: 'text' | 'select' | 'date' | 'boolean';
}

interface TableFilterProps {
  filters: FilterOption[];
  onFilter: (filters: Record<string, any>) => void;
  className?: string;
  initialFilters?: Record<string, any>;
}

const TableFilter: React.FC<TableFilterProps> = ({
  filters,
  onFilter,
  className,
  initialFilters = {},
}) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(initialFilters);
  const [searchValue, setSearchValue] = useState<string>(initialFilters.search || '');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleFilterChange = (id: string, value: any) => {
    const newFilters = { ...activeFilters };
    
    if (value === '' || value === undefined || value === null) {
      delete newFilters[id];
    } else {
      newFilters[id] = value;
    }
    
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = { ...activeFilters };
    
    if (searchValue) {
      newFilters.search = searchValue;
    } else {
      delete newFilters.search;
    }
    
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchValue('');
    onFilter({});
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <form 
          onSubmit={handleSearchSubmit}
          className="relative flex-1 min-w-[200px]"
        >
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
        
        <button
          type="button"
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 shadow-sm hover:bg-slate-100 h-9 px-4 py-2',
            showFilterPanel && 'bg-slate-100'
          )}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          <ChevronDown className="ml-1 h-4 w-4" />
        </button>
        
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 h-9 px-3"
          >
            <X className="mr-1 h-4 w-4" />
            Clear filters
          </button>
        )}
      </div>
      
      {showFilterPanel && (
        <div className="rounded-md border p-4 shadow-sm bg-white">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-1">
                <label
                  htmlFor={filter.id}
                  className="text-sm font-medium text-slate-700"
                >
                  {filter.label}
                </label>
                
                {filter.type === 'text' && (
                  <input
                    type="text"
                    id={filter.id}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                    value={activeFilters[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  />
                )}
                
                {filter.type === 'select' && (
                  <select
                    id={filter.id}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                    value={activeFilters[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  >
                    <option value="">Select an option</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                
                {filter.type === 'date' && (
                  <input
                    type="date"
                    id={filter.id}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                    value={activeFilters[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  />
                )}
                
                {filter.type === 'boolean' && (
                  <select
                    id={filter.id}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                    value={activeFilters[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  >
                    <option value="">Any</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableFilter;