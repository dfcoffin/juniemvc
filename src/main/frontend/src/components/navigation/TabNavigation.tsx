import React, {useState} from 'react';
import {cn} from '../../utils/cn';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
  orientation?: 'horizontal' | 'vertical';
  children?: (tabId: string) => React.ReactNode;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  defaultTabId,
  onChange,
  className,
  variant = 'default',
  orientation = 'horizontal',
  children,
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTabId || tabs[0]?.id || '');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  // Style variants for tabs
  const getTabStyles = (isActive: boolean, isDisabled: boolean) => {
    const baseStyles = 'flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2';

    if (isDisabled) {
      return cn(baseStyles, 'cursor-not-allowed opacity-50');
    }

    switch (variant) {
      case 'pills':
        return cn(
          baseStyles,
          'rounded-md px-3 py-1.5 text-sm font-medium',
          isActive
            ? 'bg-slate-900 text-white'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        );
      case 'underline':
        return cn(
          baseStyles,
          'border-b-2 px-1 py-2.5 text-sm font-medium',
          isActive
            ? 'border-slate-900 text-slate-900'
            : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
        );
      default: // default variant
        return cn(
          baseStyles,
          'rounded-t-md border-b-2 px-4 py-2 text-sm font-medium',
          isActive
            ? 'border-slate-900 bg-white text-slate-900'
            : 'border-transparent bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700'
        );
    }
  };

  const wrapperStyles = cn(
    orientation === 'horizontal'
      ? 'flex flex-col'
      : 'flex flex-row gap-4',
    className
  );

  const tabListStyles = cn(
    'flex',
    orientation === 'horizontal'
      ? 'border-b border-slate-200 overflow-x-auto'
      : 'flex-col border-r border-slate-200',
    variant === 'pills' && orientation === 'horizontal' && 'gap-1 border-none',
    variant === 'pills' && orientation === 'vertical' && 'gap-1 border-none'
  );

  const tabContentStyles = cn(
    'mt-4',
    orientation === 'vertical' && 'flex-1'
  );

  return (
    <div className={wrapperStyles}>
      <div className={tabListStyles} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={getTabStyles(activeTab === tab.id, !!tab.disabled)}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            disabled={tab.disabled}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className={tabContentStyles}>
        <div
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          id={`tabpanel-${activeTab}`}
        >
          {children?.(activeTab)}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;