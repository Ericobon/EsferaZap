import { useState, useEffect } from 'react';
import { generateCSSVariables } from '@/lib/theme';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from localStorage or default to system
    const stored = localStorage.getItem('esferazap-theme');
    return (stored as Theme) || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const applyTheme = (mode: 'light' | 'dark') => {
      // Remove existing theme classes
      document.documentElement.classList.remove('light', 'dark');
      // Add new theme class
      document.documentElement.classList.add(mode);
      
      // Apply CSS variables
      const style = document.createElement('style');
      style.innerHTML = generateCSSVariables(mode);
      style.id = 'theme-variables';
      
      // Remove existing theme variables
      const existing = document.getElementById('theme-variables');
      if (existing) {
        existing.remove();
      }
      
      document.head.appendChild(style);
      setResolvedTheme(mode);
    };

    if (theme === 'system') {
      // Use system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');
      
      // Listen for system theme changes
      const handler = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Use manual theme
      applyTheme(theme as 'light' | 'dark');
    }
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('esferazap-theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    changeTheme(newTheme);
  };

  return {
    theme,
    resolvedTheme,
    setTheme: changeTheme,
    toggleTheme,
  };
}