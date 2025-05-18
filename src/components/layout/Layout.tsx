import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, setActivePage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          closeSidebar={closeSidebar}
          activePage={activePage}
          setActivePage={setActivePage}
        />
        
        <main className="flex-1 transition-all duration-300 md:ml-64 min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;