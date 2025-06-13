'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

interface EnhancedThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = true, // Disable transitions to prevent flashing
  storageKey = 'theme'
}: EnhancedThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      storageKey={storageKey}
      forcedTheme={undefined}
    >
      {children}
    </NextThemeProvider>
  );
}