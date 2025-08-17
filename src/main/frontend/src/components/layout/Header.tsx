import React from 'react';
import {Menu} from 'lucide-react';
import {Link} from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 hover:text-slate-900 md:hidden h-10 w-10"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo.svg" 
              alt="Beer Service Logo" 
              className="h-8 w-8"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/32';
              }}
            />
            <span className="text-xl font-bold">Beer Service</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link to="/beers" className="text-sm font-medium hover:text-primary">Beers</Link>
          <Link to="/customers" className="text-sm font-medium hover:text-primary">Customers</Link>
          <Link to="/orders" className="text-sm font-medium hover:text-primary">Orders</Link>
        </nav>
        <div className="flex items-center gap-4">
          {/* Additional header elements like user profile, notifications, etc. */}
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-900/90 h-10 px-4 py-2">
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;