import React, {FormEvent, ReactNode, useState} from 'react';

interface FormHandlerProps<T> {
  initialData?: T;
  onSubmit: (data: T) => Promise<void>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  children: (props: {
    data: T;
    setData: React.Dispatch<React.SetStateAction<T>>;
    isSubmitting: boolean;
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    handleSubmit: (e: FormEvent) => Promise<void>;
    updateField: (field: keyof T, value: any) => void;
  }) => ReactNode;
}

const FormHandler = <T extends Record<string, any>>({
  initialData = {} as T,
  onSubmit,
  onSuccess,
  onError,
  children,
}: FormHandlerProps<T>) => {
  const [data, setData] = useState<T>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof T, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error for this field when it's updated
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(data);
      onSuccess?.(data);
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Handle API validation errors if they're in a standard format
      if (error instanceof Error) {
        try {
          // Try to parse error message as JSON
          const errorResponse = JSON.parse(error.message);
          if (errorResponse.fieldErrors) {
            const fieldErrors: Record<string, string> = {};
            for (const [field, messages] of Object.entries(errorResponse.fieldErrors)) {
              fieldErrors[field] = Array.isArray(messages) ? messages[0] : messages as string;
            }
            setErrors(fieldErrors);
          } else {
            onError?.(error);
          }
        } catch (parseError) {
          // If error message isn't JSON, just pass the error to the handler
          onError?.(error);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {children({
        data,
        setData,
        isSubmitting,
        errors,
        setErrors,
        handleSubmit,
        updateField,
      })}
    </>
  );
};

export default FormHandler;