'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';

interface ThemeToggleProps {
  variant?: 'default' | 'minimal' | 'enhanced' | 'mobile';
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const iconVariants = {
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

const buttonVariants: Variants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

export function ThemeToggle({ 
  variant = 'default', 
  showLabel = false,
  className,
  size = 'md'
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const { colors, mounted, isDark } = useLayoutTheme();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Enhanced theme detection with better resolution
  const getCurrentTheme = React.useCallback(() => {
    if (!mounted) return 'light';
    
    // Priority: resolved theme > explicit theme > system theme > fallback
    const currentTheme = resolvedTheme || theme || systemTheme || 'light';
    
    // Additional check using document class for more reliable detection
    if (typeof window !== 'undefined') {
      const hasSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const hasDarkClass = document.documentElement.classList.contains('dark');
      const dataTheme = document.documentElement.getAttribute('data-theme');
      
      // Use multiple sources for the most accurate theme detection
      if (currentTheme === 'system') {
        return hasSystemDark ? 'dark' : 'light';
      }
      
      // Cross-verify with DOM state
      if (dataTheme) {
        return dataTheme;
      }
      
      return hasDarkClass ? 'dark' : 'light';
    }
    
    return currentTheme;
  }, [mounted, resolvedTheme, theme, systemTheme]);

  const currentTheme = getCurrentTheme();
  const isCurrentlyDark = currentTheme === 'dark';

  // Optimized theme switching with proper state management
  const handleThemeSwitch = React.useCallback(async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    try {
      // Determine next theme
      let nextTheme: string;
      if (theme === 'system') {
        nextTheme = isCurrentlyDark ? 'light' : 'dark';
      } else {
        nextTheme = isCurrentlyDark ? 'light' : 'dark';
      }
      
      // Apply theme with immediate DOM update
      setTheme(nextTheme);
      
      // Update DOM attributes immediately for better sync
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        
        if (nextTheme === 'dark') {
          root.classList.add('dark');
          root.setAttribute('data-theme', 'dark');
        } else {
          root.classList.remove('dark');
          root.setAttribute('data-theme', 'light');
        }
        
        // Store in localStorage for persistence
        localStorage.setItem('theme', nextTheme);
      }
      
    } catch (error) {
      console.error('Theme switch failed:', error);
    } finally {
      // Reset animation state with proper timing
      setTimeout(() => {
        setIsAnimating(false);
      }, 200);
    }
  }, [theme, setTheme, isCurrentlyDark, isAnimating]);

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

  // Mobile variant - simplified for touch
  const renderMobile = () => (
    <motion.button
      variants={buttonVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      onClick={handleThemeSwitch}
      disabled={isAnimating}
      className={cn(
        "relative flex items-center justify-center rounded-full transition-all duration-300",
        "active:scale-95 touch-manipulation",
        buttonSize,
        className
      )}
      style={{
        backgroundColor: isHovered ? themeColors.hoverBg : 'transparent',
        color: themeColors.iconColor,
      }}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Touch feedback */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: themeColors.glow }}
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Icon */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`mobile-${isCurrentlyDark ? 'sun' : 'moon'}`}
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
    </motion.button>
  );

  // Enhanced desktop variant
  const renderEnhanced = () => (
    <motion.div
      className="relative"
      variants={buttonVariants}
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
  );

  // Default variant
  const renderDefault = () => (
    <motion.div
      variants={buttonVariants}
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
          "relative transition-all duration-300",
          buttonSize,
          className
        )}
        style={{
          backgroundColor: isHovered ? themeColors.hoverBg : 'transparent',
          color: themeColors.foreground,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`default-${isCurrentlyDark ? 'sun' : 'moon'}`}
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {isCurrentlyDark ? (
              <Sun className={cn(iconSize, "transition-all")} />
            ) : (
              <Moon className={cn(iconSize, "transition-all")} />
            )}
          </motion.div>
        </AnimatePresence>
        
        <span className="sr-only">
          Switch to {isCurrentlyDark ? 'light' : 'dark'} mode
        </span>
      </Button>
    </motion.div>
  );

  // Render based on variant
  switch (variant) {
    case 'mobile':
      return renderMobile();
    case 'enhanced':
      return renderEnhanced();
    case 'minimal':
      return renderDefault(); // Use default for minimal
    default:
      return renderDefault();
  }
}