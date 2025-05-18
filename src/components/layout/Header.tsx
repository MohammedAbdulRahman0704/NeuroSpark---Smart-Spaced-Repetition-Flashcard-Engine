import React from 'react';
import { Sparkles, Menu } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="md:hidden" 
            onClick={toggleSidebar}
            aria-label="Menu"
            icon={<Menu size={20} />}
          />
          
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              NeuroSpark
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;