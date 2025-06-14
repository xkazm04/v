'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';

interface DividerProps {
  variant?: 'default' | 'gradient' | 'dashed' | 'dotted' | 'glow';
  orientation?: 'horizontal' | 'vertical';
  thickness?: 'thin' | 'medium' | 'thick';
  spacing?: 'tight' | 'normal' | 'loose';
  animated?: boolean;
  className?: string;
  label?: string;
  labelPosition?: 'left' | 'center' | 'right';
}

const dividerVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { 
    scaleX: 1, 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

const shimmerVariants = {
  animate: {
    x: ['-100%', '100%'],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatDelay: 3,
      ease: 'easeInOut'
    }
  }
};

export const Divider: React.FC<DividerProps> = ({
  variant = 'default',
  orientation = 'horizontal',
  thickness = 'thin',
  spacing = 'normal',
  animated = false,
  className,
  label,
  labelPosition = 'center'
}) => {
  const { colors, isDark, mounted } = useLayoutTheme();

  // Theme-aware color configurations
  const getDividerColors = () => {
    const baseColors = {
      light: isDark ? 'rgba(248, 250, 252, 0.1)' : 'rgba(5, 13, 11, 0.08)',
      medium: isDark ? 'rgba(248, 250, 252, 0.2)' : 'rgba(5, 13, 11, 0.15)',
      strong: isDark ? 'rgba(248, 250, 252, 0.3)' : 'rgba(5, 13, 11, 0.25)',
      accent: colors.primary,
      border: colors.border
    };

    switch (variant) {
      case 'gradient':
        return {
          primary: baseColors.medium,
          secondary: 'transparent',
          accent: baseColors.strong
        };
      case 'glow':
        return {
          primary: `${colors.secondary}40`,
          secondary: 'transparent',
          accent: colors.primary
        };
      case 'dashed':
      case 'dotted':
        return {
          primary: baseColors.medium,
          secondary: baseColors.light,
          accent: baseColors.strong
        };
      default:
        return {
          primary: baseColors.light,
          secondary: 'transparent',
          accent: baseColors.medium
        };
    }
  };

  const dividerColors = getDividerColors();

  // Thickness configurations
  const getThickness = () => {
    const base = orientation === 'horizontal' ? 'h-px' : 'w-px';
    switch (thickness) {
      case 'medium':
        return orientation === 'horizontal' ? 'h-0.5' : 'w-0.5';
      case 'thick':
        return orientation === 'horizontal' ? 'h-1' : 'w-1';
      default:
        return base;
    }
  };

  // Spacing configurations
  const getSpacing = () => {
    if (orientation === 'vertical') {
      switch (spacing) {
        case 'tight': return 'mx-1';
        case 'loose': return 'mx-4';
        default: return 'mx-2';
      }
    } else {
      switch (spacing) {
        case 'tight': return 'my-1';
        case 'loose': return 'my-4';
        default: return 'my-2';
      }
    }
  };

  // Render different variants
  const renderDividerContent = () => {
    const baseClasses = cn(
      orientation === 'horizontal' ? 'w-full' : 'h-full',
      getThickness(),
      'relative overflow-hidden'
    );

    switch (variant) {
      case 'gradient':
        return (
          <motion.div
            className={baseClasses}
            variants={animated ? dividerVariants : undefined}
            initial={animated ? "hidden" : undefined}
            animate={animated ? "visible" : undefined}
            style={{
              background: orientation === 'horizontal'
                ? `linear-gradient(to right, ${dividerColors.secondary}, ${dividerColors.primary}, ${dividerColors.secondary})`
                : `linear-gradient(to bottom, ${dividerColors.secondary}, ${dividerColors.primary}, ${dividerColors.secondary})`
            }}
          >
            {/* Enhanced shimmer effect */}
            {animated && (
              <motion.div
                className="absolute inset-0"
                style={{
                  background: orientation === 'horizontal'
                    ? `linear-gradient(90deg, transparent, ${dividerColors.accent}, transparent)`
                    : `linear-gradient(180deg, transparent, ${dividerColors.accent}, transparent)`
                }}
                variants={shimmerVariants}
                animate="animate"
              />
            )}
          </motion.div>
        );

      case 'glow':
        return (
          <motion.div
            className={baseClasses}
            variants={animated ? dividerVariants : undefined}
            initial={animated ? "hidden" : undefined}
            animate={animated ? "visible" : undefined}
            style={{
              background: orientation === 'horizontal'
                ? `linear-gradient(to right, transparent, ${dividerColors.primary}, transparent)`
                : `linear-gradient(to bottom, transparent, ${dividerColors.primary}, transparent)`,
              boxShadow: `0 0 8px ${dividerColors.accent}40`
            }}
          >
            {/* Glow pulse effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: orientation === 'horizontal'
                  ? `linear-gradient(to right, transparent, ${dividerColors.accent}, transparent)`
                  : `linear-gradient(to bottom, transparent, ${dividerColors.accent}, transparent)`
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </motion.div>
        );

      case 'dashed':
        return (
          <motion.div
            className={cn(baseClasses, 'border-dashed')}
            variants={animated ? dividerVariants : undefined}
            initial={animated ? "hidden" : undefined}
            animate={animated ? "visible" : undefined}
            style={{
              borderColor: dividerColors.primary,
              borderWidth: orientation === 'horizontal' ? '0 0 1px 0' : '0 0 0 1px'
            }}
          />
        );

      case 'dotted':
        return (
          <motion.div
            className={cn(baseClasses, 'border-dotted')}
            variants={animated ? dividerVariants : undefined}
            initial={animated ? "hidden" : undefined}
            animate={animated ? "visible" : undefined}
            style={{
              borderColor: dividerColors.primary,
              borderWidth: orientation === 'horizontal' ? '0 0 1px 0' : '0 0 0 1px'
            }}
          />
        );

      default:
        return (
          <motion.div
            className={baseClasses}
            variants={animated ? dividerVariants : undefined}
            initial={animated ? "hidden" : undefined}
            animate={animated ? "visible" : undefined}
            style={{
              background: orientation === 'horizontal'
                ? `linear-gradient(to right, transparent, ${dividerColors.primary}, transparent)`
                : `linear-gradient(to bottom, transparent, ${dividerColors.primary}, transparent)`
            }}
          />
        );
    }
  };

  // Render with label if provided
  if (label) {
    return (
      <div className={cn(
        "relative flex items-center",
        getSpacing(),
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        className
      )}>
        {/* Left/Top divider segment */}
        {labelPosition !== 'left' && (
          <div className={cn(
            "flex-1",
            orientation === 'horizontal' ? 'mr-4' : 'mb-2'
          )}>
            {renderDividerContent()}
          </div>
        )}

        {/* Label */}
        <motion.div
          className={cn(
            "relative px-3 py-1 text-sm font-medium whitespace-nowrap",
            "bg-background/80 backdrop-blur-sm rounded-md border"
          )}
          style={{
            color: colors.mutedForeground,
            backgroundColor: `${colors.background}cc`,
            borderColor: colors.border
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {label}
        </motion.div>

        {/* Right/Bottom divider segment */}
        {labelPosition !== 'right' && (
          <div className={cn(
            "flex-1",
            orientation === 'horizontal' ? 'ml-4' : 'mt-2'
          )}>
            {renderDividerContent()}
          </div>
        )}
      </div>
    );
  }

  // Simple divider without label
  return (
    <div className={cn(
      "relative",
      orientation === 'horizontal' ? 'w-full' : 'h-full',
      getSpacing(),
      className
    )}>
      {renderDividerContent()}
    </div>
  );
};

// Convenient preset components
export const GradientDivider: React.FC<Omit<DividerProps, 'variant'>> = (props) => (
  <Divider {...props} variant="gradient" />
);

export const GlowDivider: React.FC<Omit<DividerProps, 'variant'>> = (props) => (
  <Divider {...props} variant="glow" />
);

export const DashedDivider: React.FC<Omit<DividerProps, 'variant'>> = (props) => (
  <Divider {...props} variant="dashed" />
);

export const AnimatedDivider: React.FC<Omit<DividerProps, 'animated'>> = (props) => (
  <Divider {...props} animated />
);

export default Divider;