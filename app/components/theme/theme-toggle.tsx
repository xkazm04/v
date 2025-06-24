'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { playButtonVariants } from '../animations/variants/cardVariants';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const iconVariants: Variants = {
  hidden: { 
    scale: 0, 
    rotate: -180, 
    opacity: 0 
  },
  visible: { 
    scale: 1, 
    rotate: 0, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 20,
      duration: 0.3
    }
  },
  exit: { 
    scale: 0, 
    rotate: 180, 
    opacity: 0,
    transition: {
      duration: 0.15
    }
  }
};

export function ThemeToggle({ 
  className,
  size = 'md'
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { colors, mounted } = useLayoutTheme();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [themeInitialized, setThemeInitialized] = React.useState(false);

  React.useEffect(() => {
    if (!mounted || themeInitialized) return;

    const initializeTheme = () => {
      try {
        // Check if user has a saved theme preference
        const savedTheme = localStorage.getItem('theme');
        const userPreferences = localStorage.getItem('storyteller-user-preferences');
        
        let preferredTheme = 'light'; // Default fallback
        
        // Try to get theme from user preferences first
        if (userPreferences) {
          try {
            const parsed = JSON.parse(userPreferences);
            if (parsed.theme && parsed.theme !== 'system') {
              preferredTheme = parsed.theme;
            }
          } catch (e) {
            console.warn('Failed to parse user preferences:', e);
          }
        }
        
        // Fallback to localStorage theme if no user preference
        if (!userPreferences && savedTheme && savedTheme !== 'system') {
          preferredTheme = savedTheme;
        }

        // ✅ CRITICAL: Override system theme detection completely
        if (theme === 'system' || !theme || savedTheme === 'system') {
          console.log('🎨 Overriding system theme with light default');
          setTheme(preferredTheme);
          
          // Force DOM update immediately to prevent flash
          const root = document.documentElement;
          if (preferredTheme === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
          } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
          }
          
          // Update localStorage to prevent system theme fallback
          localStorage.setItem('theme', preferredTheme);
        }

        setThemeInitialized(true);
      } catch (error) {
        console.error('Theme initialization failed:', error);
        // Fallback: force light theme
        setTheme('light');
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        setThemeInitialized(true);
      }
    };

    // Small delay to ensure all theme providers are ready
    const timer = setTimeout(initializeTheme, 100);
    return () => clearTimeout(timer);
  }, [mounted, theme, setTheme, themeInitialized]);

  const getCurrentTheme = React.useCallback(() => {
    if (!mounted) return 'light';
    
    // Priority: explicit theme > resolved theme > DOM state > light fallback
    let currentTheme = theme || resolvedTheme || 'light';
    
    // ✅ OVERRIDE: Never allow system theme to be returned
    if (currentTheme === 'system') {
      currentTheme = 'light';
    }
    
    // Additional check using document class for reliability
    if (typeof window !== 'undefined') {
      const hasDarkClass = document.documentElement.classList.contains('dark');
      const dataTheme = document.documentElement.getAttribute('data-theme');
      
      // Cross-verify with DOM state, but always prefer explicit themes
      if (dataTheme && dataTheme !== 'system') {
        return dataTheme as 'light' | 'dark';
      }
      
      return hasDarkClass ? 'dark' : 'light';
    }
    
    return currentTheme as 'light' | 'dark';
  }, [mounted, resolvedTheme, theme]);

  const currentTheme = getCurrentTheme();
  const isCurrentlyDark = currentTheme === 'dark';

  // ✅ UPDATED: Enhanced theme switching that prevents system theme
  const handleThemeSwitch = React.useCallback(async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    try {
      // Simple toggle between light and dark only (no system)
      const nextTheme = isCurrentlyDark ? 'light' : 'dark';
      
      console.log(`🎨 Switching theme from ${currentTheme} to ${nextTheme}`);
      
      // Apply theme with immediate DOM update
      setTheme(nextTheme);
      
      // ✅ CRITICAL: Update DOM attributes immediately for better sync
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        
        if (nextTheme === 'dark') {
          root.classList.add('dark');
          root.setAttribute('data-theme', 'dark');
        } else {
          root.classList.remove('dark');
          root.setAttribute('data-theme', 'light');
        }
        
        // Store in localStorage for persistence (never store 'system')
        localStorage.setItem('theme', nextTheme);
        
        // ✅ NEW: Also update user preferences if they exist
        try {
          const userPreferences = localStorage.getItem('storyteller-user-preferences');
          if (userPreferences) {
            const parsed = JSON.parse(userPreferences);
            parsed.theme = nextTheme;
            parsed.lastUpdated = new Date().toISOString();
            localStorage.setItem('storyteller-user-preferences', JSON.stringify(parsed));
          }
        } catch (e) {
          console.warn('Failed to update user preferences:', e);
        }
      }
      
    } catch (error) {
      console.error('Theme switch failed:', error);
      // Fallback to light theme on error
      setTheme('light');
      if (typeof window !== 'undefined') {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    } finally {
      // Reset animation state with proper timing
      setTimeout(() => {
        setIsAnimating(false);
      }, 200);
    }
  }, [isCurrentlyDark, isAnimating, setTheme, currentTheme]);

  // Size configurations
  const sizeConfig = {
    sm: { icon: 'h-4 w-4', button: 'h-8 w-8' },
    md: { icon: 'h-[1.2rem] w-[1.2rem]', button: 'h-10 w-10' },
    lg: { icon: 'h-6 w-6', button: 'h-12 w-12' }
  };

  const { icon: iconSize, button: buttonSize } = sizeConfig[size];

  // Theme-aware colors with better contrast
  const getThemeColors = React.useCallback(() => {
    const baseColors = {
      background: colors.background || 'hsl(var(--background))',
      foreground: colors.foreground || 'hsl(var(--foreground))',
      primary: colors.primary || 'hsl(var(--primary))',
      muted: colors.muted || 'hsl(var(--muted))',
      border: colors.border || 'hsl(var(--border))',
    };

    return {
      ...baseColors,
      // Enhanced glow effects
      glow: isCurrentlyDark 
        ? 'rgba(251, 191, 36, 0.25)' // warm amber glow for sun
        : 'rgba(96, 165, 250, 0.25)', // cool blue glow for moon
      // Better icon colors with proper contrast
      iconColor: isCurrentlyDark 
        ? '#fbbf24' // warm amber for sun
        : '#3b82f6', // cool blue for moon
      // Hover states
      hoverBg: isCurrentlyDark 
        ? 'rgba(71, 85, 105, 0.4)'
        : 'rgba(241, 245, 249, 0.8)',
    };
  }, [colors, isCurrentlyDark]);

  const themeColors = getThemeColors();

  // ✅ LOADING STATE: Show loading indicator during theme initialization
  if (!mounted || !themeInitialized) {
    return (
      <div className={cn("relative", buttonSize, className)}>
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }
  return (
        <motion.div
      className="relative"
      variants={playButtonVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={handleThemeSwitch}
        disabled={isAnimating}
        className={cn(
          "relative overflow-hidden transition-all duration-300 group rounded-xl",
          buttonSize,
          className
        )}
        style={{
          backgroundColor: isHovered ? themeColors.hoverBg : 'transparent',
          color: themeColors.iconColor,
          borderColor: 'transparent'
        }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, ${themeColors.glow} 0%, transparent 70%)`
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1.2 : 0.8
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        {/* Icon with smooth rotation */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`enhanced-${isCurrentlyDark ? 'sun' : 'moon'}`}
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {isCurrentlyDark ? (
                <Sun className={iconSize} />
              ) : (
                <Moon className={iconSize} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Rotating ring effect */}
        <motion.div
          className="absolute inset-1 rounded-full border opacity-0 group-hover:opacity-30"
          style={{ borderColor: themeColors.iconColor }}
          animate={{
            rotate: isAnimating ? 360 : 0,
            opacity: isHovered ? 0.3 : 0
          }}
          transition={{
            rotate: { duration: 0.6, ease: 'easeInOut' },
            opacity: { duration: 0.2 }
          }}
        />

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `linear-gradient(45deg, transparent 20%, ${themeColors.iconColor}20 50%, transparent 80%)`
          }}
          animate={{
            x: isHovered ? ['0%', '100%'] : '0%',
            opacity: isHovered ? [0, 0.8, 0] : 0
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut'
          }}
        />
      </Button>

      {/* Loading indicator */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: `${themeColors.background}95` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              style={{ borderColor: themeColors.iconColor }}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                ease: 'linear' 
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}