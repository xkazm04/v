'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useAppearanceStore } from '@/app/store/appearance';

export function BackgroundOverlay() {
  const { theme, systemTheme } = useTheme();
  const { getGradientStyle } = useAppearanceStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const gradientStyle = getGradientStyle(currentTheme as 'light' | 'dark');

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
      style={{
        background: gradientStyle,
        opacity: 0.6
      }}
    />
  );
}