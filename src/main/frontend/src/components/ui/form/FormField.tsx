import React, {ReactNode} from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  description?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  description,
  error,
  children,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      {children}
      {description && (
        <p className="text-sm text-slate-500">{description}</p>
      )}
      {error && (
        <p className="text-sm font-medium text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FormField;