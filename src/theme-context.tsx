'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

type ThemePreference = 'system' | 'dark' | 'light';

interface ThemeContextType {
  darkMode: boolean;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference>('light');

  // Function to get system preference (no longer used since we force light mode)
  // const getSystemPreference = () => {
  //   if (typeof window !== 'undefined') {
  //     return window.matchMedia('(prefers-color-scheme: dark)').matches;
  //   }
  //   return false;
  // };

  // Function to determine if dark mode should be active
  const shouldUseDarkMode = useCallback(() => {
    switch (themePreference) {
      case 'dark':
        return true;
      case 'light':
        return false;
      case 'system':
        // Force light mode even for system preference
        return false;
      default:
        return false;
    }
  }, [themePreference]);

  // Initialize theme preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("themePreference");
    if (stored === "dark" || stored === "light" || stored === "system") {
      setThemePreference(stored as ThemePreference);
    } else {
      // Force light mode as default if no preference is stored
      setThemePreference('light');
      localStorage.setItem("themePreference", "light");
    }
  }, []);

  // Update dark mode based on preference
  useEffect(() => {
    const isDark = shouldUseDarkMode();
    setDarkMode(isDark);
    
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [themePreference, shouldUseDarkMode]);

  // Listen for system preference changes (disabled since we force light mode)
  // useEffect(() => {
  //   if (typeof window !== 'undefined' && themePreference === 'system') {
  //     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  //     const handleChange = () => {
  //       setDarkMode(shouldUseDarkMode());
  //     };
  //     
  //     mediaQuery.addEventListener('change', handleChange);
  //     return () => mediaQuery.removeEventListener('change', handleChange);
  //   }
  // }, [themePreference, shouldUseDarkMode]);

  const setThemePreferenceHandler = (preference: ThemePreference) => {
    setThemePreference(preference);
    localStorage.setItem("themePreference", preference);
  };

  // Backward compatibility function
  const toggleDarkMode = () => {
    const newPreference = darkMode ? 'light' : 'dark';
    setThemePreferenceHandler(newPreference);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, themePreference, setThemePreference: setThemePreferenceHandler, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
} 