import React from 'react';
import { Bell, Moon, Sun } from 'lucide-react';

const Header = () => {
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed right-0 top-0 left-64 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex-1" />
        
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600" />
            <span className="font-medium dark:text-white">Username</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;