import React, {forwardRef, InputHTMLAttributes} from 'react';
import {cn} from '../../../utils/cn';
import {Check} from 'lucide-react';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            ref={ref}
            className={cn(
              'peer h-4 w-4 shrink-0 appearance-none rounded-sm border border-slate-200 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            {...props}
          />
          <Check className="absolute left-0 top-0 h-4 w-4 opacity-0 text-slate-950 peer-checked:opacity-100" />
        </div>
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
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;