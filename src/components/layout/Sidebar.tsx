import React from 'react';
import { PlusCircle, BarChart3, ListChecks, Home } from 'lucide-react';
import Button from '../ui/Button';
import { useFlashcards } from '../../contexts/FlashcardContext';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  closeSidebar,
  activePage,
  setActivePage,
}) => {
  const { state } = useFlashcards();
  const { decks } = state;

  const handleNavigate = (page: string) => {
    setActivePage(page);
    closeSidebar();
  };
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <div 
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 z-30
          bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4">
          <Button
            variant="primary"
            fullWidth
            icon={<PlusCircle size={16} />}
            onClick={() => handleNavigate('create-deck')}
          >
            Create Deck
          </Button>
        </div>
        
        <nav className="px-2 py-2">
          <ul className="space-y-1">
            <li>
              <button
                className={`
                  w-full text-left px-3 py-2 flex items-center rounded-md
                  ${activePage === 'home' 
                    ? 'bg-blue-100 text-blue-900 font-medium dark:bg-blue-900/20 dark:text-blue-100' 
                    : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'}
                `}
                onClick={() => handleNavigate('home')}
              >
                <Home size={18} className="mr-2" />
                Home
              </button>
            </li>
            
            <li>
              <button
                className={`
                  w-full text-left px-3 py-2 flex items-center rounded-md
                  ${activePage === 'dashboard' 
                    ? 'bg-blue-100 text-blue-900 font-medium dark:bg-blue-900/20 dark:text-blue-100' 
                    : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'}
                `}
                onClick={() => handleNavigate('dashboard')}
              >
                <BarChart3 size={18} className="mr-2" />
                Dashboard
              </button>
            </li>
            
            <li>
              <button
                className={`
                  w-full text-left px-3 py-2 flex items-center rounded-md
                  ${activePage === 'review' 
                    ? 'bg-blue-100 text-blue-900 font-medium dark:bg-blue-900/20 dark:text-blue-100' 
                    : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'}
                `}
                onClick={() => handleNavigate('review')}
              >
                <ListChecks size={18} className="mr-2" />
                Review
              </button>
            </li>
          </ul>
          
          {decks.length > 0 && (
            <>
              <div className="mt-6 mb-2 px-3">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Your Decks
                </h3>
              </div>
              
              <ul className="space-y-1">
                {decks.map(deck => (
                  <li key={deck.id}>
                    <button
                      className={`
                        w-full text-left px-3 py-2 flex items-center rounded-md truncate
                        ${activePage === `deck-${deck.id}` 
                          ? 'bg-blue-100 text-blue-900 font-medium dark:bg-blue-900/20 dark:text-blue-100' 
                          : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'}
                      `}
                      onClick={() => handleNavigate(`deck-${deck.id}`)}
                    >
                      {deck.name}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;