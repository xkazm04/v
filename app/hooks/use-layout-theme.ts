'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { 
  colors, 
  getThemeColors, 
  getNavbarColors, 
  getSidebarColors, 
  getCardColors, 
  getOverlayColors,
  getVintageColors,
  type VintageColors
} from '@/app/constants/colors';
import { useAppearanceStore, SUBTONE_CONFIGS } from '@/app/stores/appearance';

export function useLayoutTheme() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Get subtone settings
  const { colorSubtone, getSubtoneConfig, getGradientStyle } = useAppearanceStore();

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
  const subtoneConfig = getSubtoneConfig();

  // ✅ Enhanced subtone utilities with vintage support
  const getSubtoneEffects = () => {
    const isDark = currentTheme === 'dark';
    const subtoneColor = subtoneConfig.preview;
    const opacity = isDark ? 0.03 : 0.02;
    const glowOpacity = isDark ? 0.05 : 0.03;
    
    // ✅ Vintage-specific effects for light mode
    const vintageEffects = !isDark ? {
      paperStain: `radial-gradient(ellipse 80% 60% at 30% 40%, rgba(139, 69, 19, 0.02), transparent 70%)`,
      inkBlot: `radial-gradient(circle at 70% 20%, rgba(139, 69, 19, 0.03) 10px, transparent 20px)`,
      paperFold: `linear-gradient(135deg, transparent 48%, rgba(139, 69, 19, 0.04) 50%, transparent 52%)`,
      vintageSepia: `sepia(0.1) contrast(1.1) brightness(0.98)`,
    } : {};
    
    return {
      // Subtle background tinting
      backgroundTint: colorSubtone !== 'neutral' 
        ? `radial-gradient(ellipse 100% 50% at 50% 0%, ${subtoneColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}, transparent 50%)`
        : 'none',
      
      // Border glow effects
      borderGlow: {
        subtle: `0 0 10px ${subtoneColor}${Math.floor(glowOpacity * 255).toString(16).padStart(2, '0')}`,
        medium: `0 0 20px ${subtoneColor}${Math.floor(glowOpacity * 2 * 255).toString(16).padStart(2, '0')}`,
        strong: `0 0 30px ${subtoneColor}${Math.floor(glowOpacity * 3 * 255).toString(16).padStart(2, '0')}`
      },
      
      // Pattern overlays
      dotPattern: colorSubtone !== 'neutral' 
        ? `radial-gradient(circle at 2px 2px, ${subtoneColor}${Math.floor(opacity * 128).toString(16).padStart(2, '0')} 1px, transparent 0)`
        : isDark
          ? `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.02) 1px, transparent 0)`
          : `radial-gradient(circle at 2px 2px, rgba(139, 69, 19, 0.015) 1px, transparent 0)`,
      
      // Gradient overlays for containers
      containerGlow: getGradientStyle(currentTheme),
      
      // Accent colors for interactive elements
      accentColor: subtoneColor,
      accentOpacity: opacity,
      
      // Glass effects with subtone
      glassBackground: colorSubtone !== 'neutral'
        ? isDark
          ? `rgba(${hexToRgb(subtoneColor)?.join(', ')}, 0.08)`
          : `rgba(${hexToRgb(subtoneColor)?.join(', ')}, 0.05)`
        : isDark
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(255, 255, 255, 0.20)',
          
      // Text accent for highlights
      textAccent: colorSubtone !== 'neutral' ? subtoneColor : themeColors.primary,
      
      // ✅ NEW: Vintage effects
      ...vintageEffects
    };
  };

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  };

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
    isLight: currentTheme === 'light',
    
    // ✅ NEW: Vintage color integration
    vintage: getVintageColors(currentTheme),
    isVintage: currentTheme === 'light',
    
    // Subtone integration
    subtone: {
      config: subtoneConfig,
      color: subtoneConfig.preview,
      isActive: colorSubtone !== 'neutral',
      effects: getSubtoneEffects(),
      name: colorSubtone
    }
  };
}