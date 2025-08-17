import React, {forwardRef, useRef, useState} from 'react';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '../../../utils/cn';
import {Image as ImageIcon, Upload, X} from 'lucide-react';

const imageUploadVariants = cva(
  'flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md transition-colors',
  {
    variants: {
      error: {
        true: 'border-red-500 bg-red-50',
        false: 'border-slate-300 bg-slate-50 hover:bg-slate-100',
      },
      hasImage: {
        true: 'border-green-500 bg-green-50',
        false: '',
      },
    },
    defaultVariants: {
      error: false,
      hasImage: false,
    },
  }
);

export interface ImageUploadProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>,
    VariantProps<typeof imageUploadVariants> {
  error?: boolean;
  onChange?: (file: File | null) => void;
  defaultPreview?: string;
}

const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ className, error, onChange, defaultPreview, ...props }, ref) => {
    const [preview, setPreview] = useState<string | null>(defaultPreview || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      handleFile(file);
    };

    const handleFile = (file: File | null) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onChange?.(file);
      } else {
        setPreview(null);
        onChange?.(null);
      }
    };

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onChange?.(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0] || null;
      handleFile(file);
    };

    return (
      <div className="w-full">
        <div
          className={cn(
            imageUploadVariants({
              error,
              hasImage: !!preview,
              className: cn(className, dragging ? 'border-blue-500 bg-blue-50' : '')
            })
          )}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="Preview"
                className="object-contain w-full h-full p-2"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 p-4 text-slate-500">
              <div className="p-2 bg-slate-100 rounded-full">
                {dragging ? (
                  <Upload className="h-6 w-6" />
                ) : (
                  <ImageIcon className="h-6 w-6" />
                )}
              </div>
              <div className="text-sm font-medium text-center">
                {dragging ? 'Drop to upload' : 'Click to upload or drag and drop'}
                <p className="text-xs text-slate-400 mt-1">PNG, JPG or WEBP (max. 2MB)</p>
              </div>
            </div>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          ref={(node) => {
            // Handle both the internal ref and the forwarded ref
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            fileInputRef.current = node;
          }}
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          {...props}
        />
      </div>
    );
  }
);

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;