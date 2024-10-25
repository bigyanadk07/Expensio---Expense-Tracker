import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, PiggyBank, PieChart, BarChart3, BarChart2, Paperclip, PieChartIcon, LucidePaperclip, DollarSign } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/expense', label: 'Expense', icon: Wallet },
    { path: '/income', label: 'Income', icon: PiggyBank },
    { path: '/budget', label: 'Budget', icon: DollarSign },
    { path: '/statistics', label: 'Statistics', icon: PieChartIcon },
    { path: '/reports', label: 'Reports', icon: LucidePaperclip},
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:relative sm:bottom-auto bg-gray-50">
      <div className="mx-auto max-w-screen-lg px-4 py-3">
        <nav className="bg-white rounded-2xl shadow-lg backdrop-blur-lg bg-opacity-90 px-4 py-2 border border-gray-100">
          <div className="flex items-center justify-between gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 px-3 
                    transition-all duration-200 ease-in-out rounded-xl
                    ${active 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-500'
                    }`}
                >
                  <Icon 
                    size={20} 
                    className={`transition-all duration-200 ${
                      active ? 'stroke-2' : 'stroke-1.5'
                    }`} 
                  />
                  <span className={`text-xs font-medium ${
                    active ? 'scale-100' : 'scale-95'
                  }`}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="absolute -bottom-[2px] left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-indigo-600" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;