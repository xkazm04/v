'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { THEME_VARIABLES } from '@/app/config/theme-variables';

interface EnhancedThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
}

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true
}: EnhancedThemeProviderProps) {
  useEffect(() => {
    // Apply initial theme variables on mount
    const applyThemeVariables = (theme: 'light' | 'dark') => {
      const root = document.documentElement;
      const variables = THEME_VARIABLES[theme];
      
      // Batch DOM updates for better performance
      const updateStyle = () => {
        Object.entries(variables).forEach(([property, value]) => {
          root.style.setProperty(property, value);
        });
      };
      
      // Use requestAnimationFrame for smooth application
      requestAnimationFrame(updateStyle);
    };

    // Listen for theme changes
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains('dark');
      applyThemeVariables(isDark ? 'dark' : 'light');
    };

    // Apply initial theme
    handleThemeChange();

    // Set up observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <NextThemeProvider
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
    >
      {children}
    </NextThemeProvider>
  );
}