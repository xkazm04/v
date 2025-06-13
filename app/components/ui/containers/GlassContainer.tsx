'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import { cn } from '@/app/lib/utils';

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  initial?: string;
  animate?: string;
  exit?: string;
  style?: 'default' | 'frosted' | 'crystal' | 'subtle' | 'intense';
  border?: 'none' | 'subtle' | 'visible' | 'glow';
  backdrop?: 'light' | 'medium' | 'heavy';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'glow';
  theme?: 'light' | 'dark' | 'auto';
  overlay?: boolean;
  overlayOpacity?: number;
  [key: string]: any;
}

const glassStyles = {
  default: {
    light: 'bg-white/20 backdrop-blur-md',
    dark: 'bg-white/5 backdrop-blur-md'
  },
  frosted: {
    light: 'bg-white/30 backdrop-blur-lg',
    dark: 'bg-white/8 backdrop-blur-lg'
  },
  crystal: {
    light: 'bg-white/40 backdrop-blur-xl',
    dark: 'bg-white/10 backdrop-blur-xl'
  },
  subtle: {
    light: 'bg-white/10 backdrop-blur-sm',
    dark: 'bg-white/3 backdrop-blur-sm'
  },
  intense: {
    light: 'bg-white/50 backdrop-blur-2xl',
    dark: 'bg-white/15 backdrop-blur-2xl'
  }
};

const borderStyles = {
  none: '',
  subtle: {
    light: 'border border-white/20',
    dark: 'border border-white/10'
  },
  visible: {
    light: 'border border-white/30',
    dark: 'border border-white/20'
  },
  glow: {
    light: 'border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)]',
    dark: 'border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
  }
};

const shadowStyles = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg shadow-black/5',
  xl: 'shadow-xl shadow-black/10',
  glow: 'shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.05)]'
};

const roundedStyles = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full'
};

export const GlassContainer = forwardRef<HTMLDivElement, GlassContainerProps>(({
  children,
  className = '',
  variants,
  initial = 'hidden',
  animate = 'visible',
  exit,
  style = 'default',
  border = 'subtle',
  backdrop = 'medium',
  rounded = 'xl',
  shadow = 'glow',
  theme = 'auto',
  overlay = false,
  overlayOpacity = 0.1,
  ...props
}, ref) => {
  // Determine theme
  const currentTheme = theme === 'auto' 
    ? (typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    : theme;

  // Build glass effect classes
  const glassClass = glassStyles[style][currentTheme];
  const borderClass = border === 'none' ? '' : borderStyles[border][currentTheme];
  const shadowClass = shadowStyles[shadow as keyof typeof shadowStyles];
  const roundedClass = roundedStyles[rounded as keyof typeof roundedStyles];

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
      className={cn(
        'relative overflow-hidden',
        glassClass,
        borderClass,
        shadowClass,
        roundedClass,
        'transition-all duration-300 ease-out',
        className
      )}
      style={{
        backdropFilter: 'blur(3px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(5px) saturate(1.5)',
        ...props.style
      }}
      {...props}
    >
      {/* Optional overlay for enhanced glass effect */}
      {overlay && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: currentTheme === 'light' 
              ? `linear-gradient(135deg, rgba(255,255,255,${overlayOpacity}), rgba(255,255,255,0))`
              : `linear-gradient(135deg, rgba(255,255,255,${overlayOpacity}), rgba(255,255,255,0))`
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
});

GlassContainer.displayName = 'GlassContainer';