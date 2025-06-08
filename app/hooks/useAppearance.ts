'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useAppearanceStore, ColorSubtone } from '@/app/stores/appearance';

export interface AppearanceSettings {
  colorSubtone: ColorSubtone;
  theme: string | undefined;
  isDark: boolean;
  setColorSubtone: (subtone: ColorSubtone) => void;
  setTheme: (theme: string) => void;
  getGradientStyle: () => string;
  isLoaded: boolean;
}

export function useAppearance(): AppearanceSettings {
  const { theme, setTheme, systemTheme } = useTheme();
  const { colorSubtone, setColorSubtone, getGradientStyle } = useAppearanceStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const getCurrentGradientStyle = () => {
    if (!isLoaded) return '';
    return getGradientStyle(currentTheme as 'light' | 'dark');
  };

  return {
    colorSubtone,
    theme,
    isDark,
    setColorSubtone,
    setTheme,
    getGradientStyle: getCurrentGradientStyle,
    isLoaded
  };
}