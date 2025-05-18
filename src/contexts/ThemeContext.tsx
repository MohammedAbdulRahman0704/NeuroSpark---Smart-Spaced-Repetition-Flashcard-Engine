import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeConfig } from '../types';
import { loadTheme, saveTheme } from '../utils/localStorage';

interface ThemeContextType {
  theme: ThemeConfig;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>({ colorMode: 'light' });

  useEffect(() => {
    const savedTheme = loadTheme();
    setTheme(savedTheme);

    // Apply theme class to <html>
    if (savedTheme.colorMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const newColorMode = prev.colorMode === 'light' ? 'dark' : 'light';
      const newTheme = { colorMode: newColorMode };

      saveTheme(newTheme);

      if (newColorMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};