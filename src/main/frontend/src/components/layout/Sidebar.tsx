import React from "react";
import {NavLink} from "react-router-dom";
import {Beer, Home, Package, Settings, ShoppingCart, Users, X,} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-slate-100 text-slate-900"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-white p-4 shadow-lg transition-transform duration-200 md:static md:z-0 md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <span className="text-xl font-bold">Menu</span>
          <button
            onClick={toggleSidebar}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem
            to="/"
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
          />
          <NavItem
            to="/beers"
            icon={<Beer className="h-5 w-5" />}
            label="Beers"
          />
          <NavItem
            to="/customers"
            icon={<Users className="h-5 w-5" />}
            label="Customers"
          />
          <NavItem
            to="/orders"
            icon={<ShoppingCart className="h-5 w-5" />}
            label="Orders"
          />
          <NavItem
            to="/inventory"
            icon={<Package className="h-5 w-5" />}
            label="Inventory"
          />
          <NavItem
            to="/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
          />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
