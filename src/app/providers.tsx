'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldBeDark = saved === 'dark' || (!saved && prefersDark);
      
      setIsDark(shouldBeDark);
      document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', newValue ? 'dark' : 'light');
    }
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
