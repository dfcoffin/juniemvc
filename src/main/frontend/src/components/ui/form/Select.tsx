import React, {forwardRef, SelectHTMLAttributes} from 'react';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '../../../utils/cn';
import {ChevronDown} from 'lucide-react';

const selectVariants = cva(
  'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-8',
  {
    variants: {
      error: {
        true: 'border-red-500 focus-visible:ring-red-500',
        false: '',
      },
    },
    defaultVariants: {
      error: false,
    },
  }
);

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  error?: boolean;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(selectVariants({ error, className }))}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-slate-500 pointer-events-none" />
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;