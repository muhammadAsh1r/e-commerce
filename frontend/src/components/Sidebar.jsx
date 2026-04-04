import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";
import { 
  Menu, 
  ShoppingBag, 
  ShoppingCart, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Package, 
  Tag, 
  Users as UsersIcon, 
  Settings,
  Home as HomeIcon,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  
  const user = useSelector((state) => state.user.user);
  const cartItems = useSelector((state) => state.cart.items) || [];
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

  const handleLogout = () => dispatch(logout());
  const isActive = (path) => location.pathname === path;

  // Navigation Links Definition
  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/categories", label: "Categories", icon: Tag },
    { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { to: "/admin/users", label: "Users", icon: UsersIcon },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const customerLinks = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/products", label: "Shop", icon: Package },
    { to: "/cart", label: "Cart", icon: ShoppingCart, badge: cartCount },
  ];

  const links = user?.role === "admin" ? adminLinks : customerLinks;

  const SidebarItem = ({ to, label, icon: Icon, badge, onClick }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        onClick={onClick}
        title={isCollapsed ? label : ""}
        className={`flex items-center gap-4 px-3 py-3 rounded-2xl transition-all duration-300 group relative cursor-pointer ${
          active 
            ? "bg-brand text-white shadow-lg shadow-brand/20" 
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
        }`}
      >
        <div className="shrink-0 flex items-center justify-center relative">
          <Icon size={24} />
          {badge > 0 && (
            <span className={`absolute -top-1 -right-1 text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ${
              active ? "bg-white text-brand ring-brand" : "bg-brand text-white ring-white"
            }`}>
              {badge}
            </span>
          )}
        </div>
        
        <span className={`font-bold whitespace-nowrap overflow-hidden transition-all duration-300 ${
          isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
        }`}>
          {label}
        </span>

        {isCollapsed && (
          <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
            {label}
          </div>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen bg-white dark:bg-gray-900/95 dark:backdrop-blur-2xl border-r border-gray-200 dark:border-white/5 shadow-sm z-50 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isCollapsed ? "w-[80px]" : "w-[280px]"
        } select-none`}
      >
        {/* Header / Logo */}
        <div className="h-20 flex items-center px-4 shrink-0 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3 w-full justify-center">
            <Link to="/" className="flex items-center gap-3 overflow-hidden shrink-0">
              <div className="shrink-0 bg-brand text-white p-2.5 rounded-[14px] shadow-lg shadow-brand/20">
                <ShoppingBag size={24} />
              </div>
              <span className={`text-2xl font-black tracking-tight text-gray-900 dark:text-white transition-all duration-300 ${
                isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
              }`}>
                Tech<span className="text-brand">Store</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Floating Toggle Button - Visible on Desktop Desktop */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-4 top-24 h-8 w-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-full items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-sm z-50 transition-all hover:scale-110"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-8 px-4 flex flex-col gap-2 custom-scrollbar">
          {user?.role === "admin" && !isCollapsed && (
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-3">
              Admin Portal
            </p>
          )}
          
          {links.map((link) => (
            <SidebarItem key={link.to} {...link} />
          ))}
        </div>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-gray-100 dark:border-white/5 shrink-0 flex flex-col gap-2">
          {user ? (
            <div className="flex flex-col gap-2">
              <SidebarItem to="/profile" label={user.name.split(' ')[0]} icon={User} />
              <button 
                onClick={handleLogout}
                title={isCollapsed ? "Logout" : ""}
                className={`flex items-center gap-4 px-3 py-3 rounded-2xl text-gray-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-all group relative overflow-hidden cursor-pointer`}
              >
                <div className="shrink-0 flex items-center justify-center"><LogOut size={24} /></div>
                <span className={`font-bold whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}>
                  Logout
                </span>
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    Logout
                  </div>
                )}
              </button>
            </div>
          ) : (
            <SidebarItem to="/login" label="Login" icon={User} />
          )}
        </div>
      </aside>

      {/* Mobile Toggle Trigger (Always visible on mobile bottom right or top left) */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="md:hidden fixed bottom-6 right-6 p-4 bg-brand text-white rounded-full shadow-2xl shadow-brand/30 z-[60] cursor-pointer"
      >
        {isCollapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
      </button>
    </>
  );
};

export default Sidebar;
