import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import {Beer, ChevronDown, ChevronRight, Home, Package, Settings, ShoppingCart, Users,} from "lucide-react";
import {cn} from "../../utils/cn";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  children?: { to: string; label: string }[];
}

interface MainNavigationProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "subtle";
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = children && children.length > 0;

  const toggleDropdown = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative">
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-slate-100 text-slate-900"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
            hasChildren && "pr-8",
          )
        }
        onClick={toggleDropdown}
      >
        {icon}
        <span>{label}</span>
        {hasChildren && (
          <span className="absolute right-2 top-2.5">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
      </NavLink>

      {hasChildren && isOpen && (
        <div className="ml-6 mt-1 space-y-1">
          {children.map((child, index) => (
            <NavLink
              key={index}
              to={child.to}
              className={({ isActive }) =>
                cn(
                  "block rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                )
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const MainNavigation: React.FC<MainNavigationProps> = ({
  className,
  orientation = "vertical",
  variant = "default",
}) => {
  const navItems: NavItemProps[] = [
    {
      to: "/",
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      to: "/beers",
      icon: <Beer className="h-5 w-5" />,
      label: "Beers",
      children: [
        { to: "/beers", label: "All Beers" },
        { to: "/beers/new", label: "Add New Beer" },
      ],
    },
    {
      to: "/customers",
      icon: <Users className="h-5 w-5" />,
      label: "Customers",
      children: [
        { to: "/customers", label: "All Customers" },
        { to: "/customers/new", label: "Add New Customer" },
      ],
    },
    {
      to: "/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Orders",
      children: [
        { to: "/orders", label: "All Orders" },
        { to: "/orders/new", label: "Create Order" },
      ],
    },
    {
      to: "/inventory",
      icon: <Package className="h-5 w-5" />,
      label: "Inventory",
    },
    {
      to: "/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
    },
  ];

  return (
    <nav
      className={cn(
        orientation === "horizontal"
          ? "flex items-center space-x-4 lg:space-x-6"
          : "flex flex-col space-y-1",
        variant === "subtle" && "text-slate-500",
        className,
      )}
    >
      {navItems.map((item, index) => (
        <NavItem
          key={index}
          to={item.to}
          icon={item.icon}
          label={item.label}
          children={item.children}
        />
      ))}
    </nav>
  );
};

export default MainNavigation;
