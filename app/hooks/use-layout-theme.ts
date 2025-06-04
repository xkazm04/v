'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { 
  colors, 
  getThemeColors, 
  getNavbarColors, 
  getSidebarColors, 
  getCardColors, 
  getOverlayColors 
} from '@/app/constants/colors';

export function useLayoutTheme() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = (mounted ? (resolvedTheme as 'light' | 'dark') : 'light') || 'light';
  
  // Type-safe color getters
  const getColors = (component: 'navbar' | 'sidebar' | 'card' | 'overlay') => {
    switch (component) {
      case 'navbar':
        return getNavbarColors(currentTheme);
      case 'sidebar':
        return getSidebarColors(currentTheme);
      case 'card':
        return getCardColors(currentTheme);
      case 'overlay':
        return getOverlayColors(currentTheme);
      default:
        return getNavbarColors(currentTheme);
    }
  };

  const themeColors = getThemeColors(currentTheme);

  return {
    theme: currentTheme,
    mounted,
    colors: themeColors,
    getColors,
    // Specific component color getters
    navbarColors: getNavbarColors(currentTheme),
    sidebarColors: getSidebarColors(currentTheme),
    cardColors: getCardColors(currentTheme),
    overlayColors: getOverlayColors(currentTheme),
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light'
  };
}