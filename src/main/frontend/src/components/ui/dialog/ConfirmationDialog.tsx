import React from 'react';
import Dialog from './Dialog';
import {AlertCircle, AlertTriangle, Check, HelpCircle, Info} from 'lucide-react';
import {cn} from '../../../utils/cn';

type ConfirmationType = 'info' | 'success' | 'warning' | 'error' | 'question';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: ConfirmationType;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'question',
  size = 'md',
  isLoading = false,
}) => {
  const iconMap: Record<ConfirmationType, React.ReactNode> = {
    info: <Info className="h-6 w-6 text-blue-500" />,
    success: <Check className="h-6 w-6 text-green-500" />,
    warning: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
    error: <AlertCircle className="h-6 w-6 text-red-500" />,
    question: <HelpCircle className="h-6 w-6 text-slate-500" />,
  };

  const buttonColorMap: Record<ConfirmationType, string> = {
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    error: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    question: 'bg-slate-900 hover:bg-slate-800 focus:ring-slate-500',
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      showCloseButton={false}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {iconMap[type]}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-500">
            {message}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className={cn(
            'px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50',
            buttonColorMap[type]
          )}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  );
};

export default ConfirmationDialog;