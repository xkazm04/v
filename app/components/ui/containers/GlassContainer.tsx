'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import { cn } from '@/app/lib/utils';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  initial?: string;
  animate?: string;
  exit?: string;
  style?: 'default' | 'frosted' | 'crystal' | 'subtle' | 'intense';
  border?: 'none' | 'subtle' | 'visible' | 'glow' | 'subtone';
  backdrop?: 'light' | 'medium' | 'heavy';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'glow' | 'subtone';
  theme?: 'light' | 'dark' | 'auto';
  overlay?: boolean;
  overlayOpacity?: number;
  subtoneEnhanced?: boolean; // ✅ NEW: Enable subtone enhancements
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
  },
  subtone: 'border' 
};

const shadowStyles = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg shadow-black/5',
  xl: 'shadow-xl shadow-black/10',
  glow: 'shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.05)]',
  subtone: '' 
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
  subtoneEnhanced = false, 
  ...props
}, ref) => {
  const { isDark, subtone } = useLayoutTheme();
  
  // Determine theme
  const currentTheme = theme === 'auto' 
    ? (isDark ? 'dark' : 'light')
    : theme;

  // Build glass effect classes
  const glassClass = glassStyles[style][currentTheme];
  const roundedClass = roundedStyles[rounded as keyof typeof roundedStyles];
  
  // ✅ Enhanced border and shadow with subtone support
  const getBorderStyle = () => {
    if (border === 'subtone' && subtoneEnhanced && subtone.isActive) {
      return {
        borderColor: `${subtone.color}40`,
        borderWidth: '1px',
        borderStyle: 'solid'
      };
    }
    return border === 'none' ? {} : { className: borderStyles[border as keyof typeof borderStyles][currentTheme] };
  };
  
  const getShadowStyle = () => {
    if (shadow === 'subtone' && subtoneEnhanced && subtone.isActive) {
      return {
        boxShadow: subtone.effects.borderGlow.medium
      };
    }
    return shadow === 'none' ? {} : { className: shadowStyles[shadow as keyof typeof shadowStyles] };
  };

  const borderStyleObj = getBorderStyle();
  const shadowStyleObj = getShadowStyle();

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
        borderStyleObj.className,
        shadowStyleObj.className,
        roundedClass,
        'transition-all duration-300 ease-out',
        className
      )}
      style={{
        backdropFilter: 'blur(3px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(5px) saturate(1.5)',
        ...borderStyleObj,
        ...shadowStyleObj,
        ...(subtoneEnhanced && subtone.isActive && {
          background: `${subtone.effects.glassBackground}, ${glassClass.includes('bg-white') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
        }),
        ...props.style
      }}
      {...props}
    >
      {/* Subtone background tint */}
      {subtoneEnhanced && subtone.isActive && subtone.effects.backgroundTint !== 'none' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: subtone.effects.backgroundTint,
            opacity: 0.6
          }}
        />
      )}
      
      {/* Enhanced pattern overlay with subtone */}
      {subtoneEnhanced && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: subtone.effects.dotPattern,
            backgroundSize: '20px 20px'
          }}
        />
      )}

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