import React from 'react';
import {Link} from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="container px-4 py-6 md:px-6 md:py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Beer Service</h3>
            <p className="text-sm text-slate-400">
              Manage your beer inventory, customers, and orders with our comprehensive beer service platform.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/beers" className="text-slate-400 hover:text-white">Beers</Link>
              </li>
              <li>
                <Link to="/customers" className="text-slate-400 hover:text-white">Customers</Link>
              </li>
              <li>
                <Link to="/orders" className="text-slate-400 hover:text-white">Orders</Link>
              </li>
              <li>
                <Link to="/inventory" className="text-slate-400 hover:text-white">Inventory</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-slate-400 hover:text-white">Help Center</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white">Contact Us</Link>
              </li>
              <li>
                <Link to="/documentation" className="text-slate-400 hover:text-white">Documentation</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
          <p>© {currentYear} Beer Service. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;