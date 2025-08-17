import React from 'react';
import {Link} from 'react-router-dom';
import {ChevronRight, Home} from 'lucide-react';

interface BreadcrumbsProps {
  items: { label: string; to: string }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link 
            to="/" 
            className="text-slate-500 hover:text-slate-700 flex items-center"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
            {index === items.length - 1 ? (
              <span 
                className="ml-2 font-medium text-slate-800" 
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="ml-2 text-slate-500 hover:text-slate-700"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;