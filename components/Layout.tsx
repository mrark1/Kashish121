import React, { useState } from 'react';
import { AppRoute } from '../types';
import { useAuth } from '../store';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Menu, 
  Bell,
  Search,
  Settings,
  Trash2,
  LogOut,
  Moon,
  Sun,
  Globe
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

const SidebarItem = ({ 
  onClick, 
  icon: Icon, 
  label, 
  active 
}: { 
  onClick: () => void; 
  icon: React.ElementType; 
  label: string; 
  active: boolean 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
      active 
        ? 'bg-amazon-light text-white border-l-4 border-amazon-orange' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, currentRoute, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout, theme, toggleTheme } = useAuth();

  // If public route, render simplified layout
  if (currentRoute === AppRoute.PUBLIC_PRICES || currentRoute === AppRoute.LOGIN || currentRoute === AppRoute.FORGOT_PASSWORD) {
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-900">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-amazon-nav flex-shrink-0 transition-all duration-300 flex flex-col fixed md:relative z-20 h-full`}
      >
        <div className="h-16 flex items-center px-6 bg-gray-900 shadow-md">
          <div className="font-bold text-white text-lg tracking-tight">
            <span className="text-amazon-orange">Kashish</span> Hardware
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          <SidebarItem 
            onClick={() => onNavigate(AppRoute.DASHBOARD)} 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={currentRoute === AppRoute.DASHBOARD} 
          />
          <SidebarItem 
            onClick={() => onNavigate(AppRoute.INVENTORY)} 
            icon={Package} 
            label="Price Management" 
            active={currentRoute === AppRoute.INVENTORY} 
          />
          <SidebarItem 
            onClick={() => onNavigate(AppRoute.POS)} 
            icon={ShoppingCart} 
            label="Point of Sale" 
            active={currentRoute === AppRoute.POS} 
          />
          <SidebarItem 
            onClick={() => onNavigate(AppRoute.REPORTS)} 
            icon={BarChart3} 
            label="Business Reports" 
            active={currentRoute === AppRoute.REPORTS} 
          />
           <div className="pt-4 mt-4 border-t border-gray-700">
             <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">System</div>
            <SidebarItem 
              onClick={() => onNavigate(AppRoute.RECYCLE_BIN)} 
              icon={Trash2} 
              label="Recycle Bin" 
              active={currentRoute === AppRoute.RECYCLE_BIN} 
            />
            <SidebarItem 
              onClick={() => onNavigate(AppRoute.PUBLIC_PRICES)} 
              icon={Globe} 
              label="Public View" 
              active={false} 
            />
           </div>
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <button className="flex items-center gap-3 text-gray-400 hover:text-white text-sm w-full">
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button onClick={logout} className="flex items-center gap-3 text-red-400 hover:text-red-300 text-sm w-full">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 z-10 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-md px-3 py-1.5 w-96 border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-amazon-orange focus-within:border-transparent transition-colors">
              <Search size={16} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-amazon-blue dark:hover:text-sky-400 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-amazon-blue dark:hover:text-sky-400">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-amazon-blue rounded-full flex items-center justify-center text-white font-bold text-xs">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{user?.username}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};
