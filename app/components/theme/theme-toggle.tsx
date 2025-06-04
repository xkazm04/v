'use client';

import * as React from 'react';
import { Moon, Sun, Palette, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';

interface ThemeToggleProps {
  variant?: 'default' | 'minimal' | 'enhanced';
  showLabel?: boolean;
  className?: string;
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
      stiffness: 400,
      damping: 15,
      duration: 0.4
    }
  },
  exit: { 
    scale: 0, 
    rotate: 180, 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

const buttonVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

const glowVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 0.6, 
    scale: 1.2,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export function ThemeToggle({ 
  variant = 'default', 
  showLabel = false,
  className 
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { colors, mounted, isDark } = useLayoutTheme();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Optimized theme switching with animation coordination
  const handleThemeSwitch = React.useCallback(async () => {
    if (isAnimating) return; // Prevent rapid switching
    
    setIsAnimating(true);
    
    // Add a slight delay for smooth animation
    setTimeout(() => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      
      // Reset animation state after theme change
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 100);
  }, [theme, setTheme, isAnimating]);

  // Optimized mount check with fallback
  const getPlaceholderButton = React.useCallback(() => (
    <Button 
      variant="ghost" 
      size="icon" 
      disabled 
      className={cn("transition-all duration-200", className)}
      style={{
        backgroundColor: 'transparent',
        color: 'hsl(var(--muted-foreground))'
      }}
    >
      <Sun className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  ), [className]);

  if (!mounted) {
    return getPlaceholderButton();
  }

  // Enhanced theme detection
  const currentTheme = resolvedTheme || theme || 'light';
  const isCurrentlyDark = currentTheme === 'dark';
  
  // Theme-aware colors
  const getThemeColors = () => ({
    background: colors.background,
    foreground: colors.foreground,
    primary: colors.primary,
    muted: colors.muted,
    border: colors.border,
    // Special glow colors for each theme
    glow: isCurrentlyDark 
      ? 'rgba(251, 191, 36, 0.3)' // warm golden glow for sun in dark mode
      : 'rgba(59, 130, 246, 0.3)', // cool blue glow for moon in light mode
    // Icon colors with better contrast
    iconColor: isCurrentlyDark ? '#fbbf24' : '#3b82f6'
  });

  const themeColors = getThemeColors();

  // Render different variants
  const renderMinimal = () => (
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
          "relative transition-all duration-300 rounded-full",
          className
        )}
        style={{
          backgroundColor: isHovered ? themeColors.muted : 'transparent',
          color: themeColors.iconColor,
          borderColor: 'transparent'
        }}
      >
        {/* Glow effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              variants={glowVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute inset-0 rounded-full blur-md"
              style={{ backgroundColor: themeColors.glow }}
            />
          )}
        </AnimatePresence>

        {/* Icon with smooth transition */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={isCurrentlyDark ? 'sun' : 'moon'}
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {isCurrentlyDark ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <span className="sr-only">
          Switch to {isCurrentlyDark ? 'light' : 'dark'} mode
        </span>
      </Button>
    </motion.div>
  );

  const renderEnhanced = () => (
    <motion.div
      variants={buttonVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <Button
        variant="outline"
        size={showLabel ? "default" : "icon"}
        onClick={handleThemeSwitch}
        disabled={isAnimating}
        className={cn(
          "relative overflow-hidden transition-all duration-300 group",
          showLabel && "pl-3 pr-4",
          className
        )}
        style={{
          backgroundColor: isHovered ? themeColors.primary : themeColors.background,
          color: isHovered ? themeColors.background : themeColors.foreground,
          borderColor: themeColors.border
        }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(45deg, ${themeColors.primary}20, ${themeColors.glow})`
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center gap-2">
          {/* Icon container with smooth animation */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={isCurrentlyDark ? 'sun' : 'moon'}
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center"
              >
                {isCurrentlyDark ? (
                  <Sun className="h-[1.1rem] w-[1.1rem]" />
                ) : (
                  <Moon className="h-[1.1rem] w-[1.1rem]" />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Rotating halo effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: `1px solid ${themeColors.iconColor}30`
              }}
              animate={{
                rotate: isAnimating ? 360 : 0,
                scale: isHovered ? 1.2 : 1,
                opacity: isHovered ? 0.6 : 0
              }}
              transition={{
                rotate: { duration: 0.6, ease: 'easeInOut' },
                scale: { duration: 0.2 },
                opacity: { duration: 0.2 }
              }}
            />
          </div>

          {/* Label with animation */}
          {showLabel && (
            <motion.span
              className="text-sm font-medium"
              animate={{
                opacity: isAnimating ? 0.5 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              {isCurrentlyDark ? 'Light' : 'Dark'}
            </motion.span>
          )}
        </div>

        {/* Loading indicator */}
        {isAnimating && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: `${themeColors.background}80` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </Button>

      {/* Hover shine effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          background: `linear-gradient(45deg, transparent 30%, ${themeColors.iconColor}20 50%, transparent 70%)`
        }}
        animate={{
          x: isHovered ? ['0%', '100%'] : '0%',
          opacity: isHovered ? [0, 0.6, 0] : 0
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  );

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
          className
        )}
        style={{
          backgroundColor: isHovered ? themeColors.muted : 'transparent',
          color: themeColors.foreground,
          borderColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = themeColors.muted;
          e.currentTarget.style.color = themeColors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = themeColors.foreground;
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isCurrentlyDark ? 'sun' : 'moon'}
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {isCurrentlyDark ? (
              <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
            )}
          </motion.div>
        </AnimatePresence>
        
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  );

  // Render based on variant
  switch (variant) {
    case 'minimal':
      return renderMinimal();
    case 'enhanced':
      return renderEnhanced();
    default:
      return renderDefault();
  }
}

// Optimized hook for theme switching performance
export function useOptimizedThemeSwitch() {
  const { setTheme, theme } = useTheme();
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const switchTheme = React.useCallback((targetTheme?: string) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Use requestAnimationFrame for smooth transition
    requestAnimationFrame(() => {
      const newTheme = targetTheme || (theme === 'dark' ? 'light' : 'dark');
      setTheme(newTheme);
      
      // Reset transition state after a brief delay
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    });
  }, [theme, setTheme, isTransitioning]);

  return { switchTheme, isTransitioning };
}