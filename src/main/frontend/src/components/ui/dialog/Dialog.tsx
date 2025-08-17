import React, {useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import {cn} from '../../../utils/cn';
import {X} from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showCloseButton?: boolean;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  className,
  showCloseButton = true,
  closeOnEsc = true,
  closeOnOutsideClick = true,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!closeOnOutsideClick) return;
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };
  
  if (!isOpen) return null;
  
  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div 
        ref={dialogRef}
        className={cn(
          'bg-white rounded-lg shadow-lg w-full p-4 md:p-6 animate-in fade-in-0 zoom-in-95',
          sizeClasses[size],
          className
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-4">
            {title && (
              <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                {description && (
                  <p className="text-sm text-slate-500">{description}</p>
                )}
              </div>
            )}
            
            {showCloseButton && (
              <button
                type="button"
                className="rounded-full p-1 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            )}
          </div>
        )}
        
        <div className="max-h-[calc(100vh-7rem)] overflow-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Dialog;