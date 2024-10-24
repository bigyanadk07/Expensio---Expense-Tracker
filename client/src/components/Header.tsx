import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusCircle, 
  Wallet, 
  PiggyBank, 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  User, 
  ChevronDown 
} from 'lucide-react';

interface HeaderProps {
  onAddExpense: () => void;
  onAddIncome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddExpense, onAddIncome }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [showNotification, setShowNotification] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside of dropdown and notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotification(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animation on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`
      w-full p-4 transition-all duration-300 ease-in-out
      ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
      ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
    `}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">Finance Tracker</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  pl-10 w-full max-w-md py-2 px-4 rounded-lg border
                  ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotification(!showNotification)}
                className={`
                  relative p-2 rounded-full transition-colors
                  ${darkMode 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'}
                `}
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              {showNotification && (
                <div className={`
                  absolute right-0 mt-2 w-64 p-4 rounded-lg shadow-lg
                  ${darkMode 
                    ? 'bg-gray-700 border border-gray-600' 
                    : 'bg-white border border-gray-200'}
                `}>
                  <p>You have {notifications} new notifications</p>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`
                p-2 rounded-full transition-colors
                ${darkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'}
              `}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`
                  flex items-center space-x-2 p-2 rounded-lg transition-colors
                  ${darkMode 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'}
                `}
              >
                <User className="h-5 w-5" />
                <ChevronDown className="h-4 w-4" />
              </button>
              {showDropdown && (
                <div className={`
                  absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-lg
                  ${darkMode 
                    ? 'bg-gray-700 border border-gray-600' 
                    : 'bg-white border border-gray-200'}
                `}>
                  <button className={`
                    w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white
                    ${darkMode ? 'text-white' : 'text-gray-900'}
                  `}>
                    Profile
                  </button>
                  <button className={`
                    w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white
                    ${darkMode ? 'text-white' : 'text-gray-900'}
                  `}>
                    Settings
                  </button>
                  <button className={`
                    w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white
                    ${darkMode ? 'text-white' : 'text-gray-900'}
                  `}>
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onAddExpense}
                className="flex items-center space-x-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Expense</span>
              </button>
              <button
                onClick={onAddIncome}
                className="flex items-center space-x-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <PiggyBank className="h-4 w-4" />
                <span>Add Income</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;