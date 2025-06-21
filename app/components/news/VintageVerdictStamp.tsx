'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/app/lib/utils';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface VintageVerdictStampProps {
  status: 'TRUE' | 'FALSE' | 'MISLEADING' | 'PARTIALLY_TRUE' | 'UNVERIFIABLE';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const VERDICT_CONFIG = {
  TRUE: {
    label: 'VERIFIED',
    shortLabel: '✓',
    color: '#22c55e',
    darkColor: '#16a34a',
    rotation: -12,
    borderStyle: 'solid'
  },
  FALSE: {
    label: 'FALSE',
    shortLabel: '✗',
    color: '#ef4444',
    darkColor: '#dc2626',
    rotation: 8,
    borderStyle: 'dashed'
  },
  MISLEADING: {
    label: 'MISLEADING',
    shortLabel: '⚠',
    color: '#f59e0b',
    darkColor: '#d97706',
    rotation: -5,
    borderStyle: 'dotted'
  },
  PARTIALLY_TRUE: {
    label: 'PARTIAL',
    shortLabel: '◐',
    color: '#3b82f6',
    darkColor: '#2563eb',
    rotation: 10,
    borderStyle: 'solid'
  },
  UNVERIFIABLE: {
    label: 'UNCLEAR',
    shortLabel: '?',
    color: '#8b5cf6',
    darkColor: '#7c3aed',
    rotation: -8,
    borderStyle: 'double'
  }
};

export const VintageVerdictStamp = memo(function VintageVerdictStamp({
  status,
  className,
  size = 'md',
  animated = true
}: VintageVerdictStampProps) {
  const { isDark, vintage } = useLayoutTheme();
  const config = VERDICT_CONFIG[status];
  
  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-20 h-20 text-sm',
    lg: 'w-24 h-24 text-base'
  };

  const stampColor = isDark ? config.darkColor : config.color || '#000000';
  
  return (
    <motion.div
      className={cn(
        'relative flex items-center justify-center',
        'transform-gpu select-none pointer-events-none',
        sizeClasses[size],
        className
      )}
      initial={animated ? { 
        scale: 0.8, 
        opacity: 0, 
        rotate: config.rotation + 20 
      } : undefined}
      animate={animated ? { 
        scale: 1, 
        opacity: 1, 
        rotate: config.rotation 
      } : { rotate: config.rotation }}
      transition={animated ? { 
        type: "spring", 
        stiffness: 300, 
        damping: 20, 
        delay: 0.4 
      } : undefined}
    >
      <div className="absolute inset-0 rounded-full">
        {/* Main stamp circle */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: isDark 
              ? `radial-gradient(circle at 30% 30%, ${stampColor}40 0%, ${stampColor}20 50%, ${stampColor}10 100%)`
              : `radial-gradient(circle at 30% 30%, ${stampColor}30 0%, ${stampColor}15 50%, ${stampColor}08 100%)`,
            border: `3px ${config.borderStyle} ${stampColor}80`,
            boxShadow: isDark
              ? `inset 0 2px 4px ${stampColor}60, 0 4px 12px ${stampColor}40`
              : `inset 0 2px 4px ${stampColor}40, 0 4px 12px ${stampColor}30`
          }}
        />
        
        {/* Inner circle */}
        <div
          className="absolute inset-2 rounded-full"
          style={{
            border: `2px solid ${stampColor}60`,
            background: `conic-gradient(from 0deg, ${stampColor}20, transparent, ${stampColor}20)`
          }}
        />
        
        {/* Vintage wear effects */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {/* Ink smudges */}
          <div 
            className="absolute top-1 right-2 w-2 h-1 rounded-full opacity-40"
            style={{ background: stampColor }}
          />
          <div 
            className="absolute bottom-2 left-1 w-1 h-2 rounded-full opacity-30"
            style={{ background: stampColor }}
          />
          
          {/* Wear patterns */}
          <div 
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              background: `radial-gradient(ellipse 60% 40% at 70% 30%, ${stampColor}50 0%, transparent 50%)`
            }}
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          className="font-bold tracking-wider"
          style={{ 
            color: stampColor,
            fontFamily: "'Courier New', monospace",
            textShadow: `1px 1px 2px ${stampColor}60`,
            filter: 'contrast(1.2)'
          }}
          initial={animated ? { scale: 0.5, opacity: 0 } : undefined}
          animate={animated ? { scale: 1, opacity: 1 } : undefined}
          transition={animated ? { delay: 0.6, duration: 0.3 } : undefined}
        >
          {size === 'sm' ? config.shortLabel : config.label}
        </motion.div>
        
        {size !== 'sm' && (
          <motion.div 
            className="flex gap-1 mt-1"
            initial={animated ? { opacity: 0 } : undefined}
            animate={animated ? { opacity: 1 } : undefined}
            transition={animated ? { delay: 0.8, duration: 0.2 } : undefined}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 h-0.5 rounded-full"
                style={{ background: stampColor }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {(status === 'FALSE' || status === 'MISLEADING') && animated && (
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.6 }}
          transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
        >
          <div
            className="w-1 h-3 rounded-b-full"
            style={{ 
              background: `linear-gradient(to bottom, ${stampColor}80, ${stampColor}20)` 
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
});