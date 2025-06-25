import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface CompactThemeSwitcherProps {
  value: 'light' | 'dark' | 'system';
  onChange: (theme: 'light' | 'dark' | 'system') => void;
  className?: string;
  showSystemOption?: boolean;
}

const CompactThemeSwitcher: React.FC<CompactThemeSwitcherProps> = ({
  value,
  onChange,
  className = '',
  showSystemOption = true
}) => {
  const { colors } = useLayoutTheme();
  const { resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Auto-detect system theme preference on mount if not explicitly set
    if (mounted && value === 'system') {
      // If user hasn't made a choice yet, detect system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const detectedTheme = systemPrefersDark ? 'dark' : 'light';
      
      // Only auto-set if the current resolved theme doesn't match the system
      if (resolvedTheme !== detectedTheme && systemTheme) {
        onChange('system');
      }
    }
  }, [mounted, value, resolvedTheme, systemTheme, onChange]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (value === 'system') {
        // If user is using system theme, trigger a re-evaluation
        onChange('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [mounted, value, onChange]);

  // Get the actual visual theme (what the user sees)
  const getVisualTheme = (themeValue: 'light' | 'dark' | 'system') => {
    if (themeValue === 'system') {
      return mounted ? (systemTheme as 'light' | 'dark') || 'light' : 'light';
    }
    return themeValue;
  };

  const visualTheme = getVisualTheme(value);

  if (!mounted) {
    // Prevent hydration mismatch
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-1 rounded-lg border" style={{ borderColor: colors.border }}>
          <div className="h-10 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md" />
        </div>
      </div>
    );
  }

  const themes = showSystemOption 
    ? [
        { key: 'light' as const, icon: Sun, label: 'Light', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
        { key: 'dark' as const, icon: Moon, label: 'Dark', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
      ]
    : [
        { key: 'light' as const, icon: Sun, label: 'Light', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
        { key: 'dark' as const, icon: Moon, label: 'Dark', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }
      ];

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-1 rounded-lg border" style={{ borderColor: colors.border }}>
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isSelected = value === theme.key;
          
          return (
            <motion.button
              key={theme.key}
              onClick={() => onChange(theme.key)}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-xs ${
                showSystemOption ? 'min-w-[130px]' : 'min-w-[200px]'
              } font-medium transition-all duration-200 ${
                isSelected ? 'text-white' : 'hover:scale-105'
              }`}
              style={{
                background: isSelected ? theme.gradient : 'transparent',
                color: isSelected ? 'white' : colors.foreground
              }}
              whileHover={{ scale: isSelected ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={theme.label}
            >
              <Icon className="w-3 h-3" />
              <span>{theme.label}</span>
                <span className="text-xs opacity-75">
                  ({visualTheme === 'dark' ? '🌙' : '☀️'})
                </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CompactThemeSwitcher;