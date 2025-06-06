'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  isSpecial?: boolean;
}

interface NavColors {
  background: string;
  border: string;
  inactive: string;
  active: string;
  glow: string;
  shadow: string;
}

interface MobileNavbarItemProps {
  item: TabItem;
  isActive: boolean;
  isPressed: boolean;
  navColors: NavColors;
  onTabPress: (tabId: string, href: string) => void;
  onPressStart: (tabId: string) => void;
  onPressEnd: () => void;
}

// Enhanced animation variants for smoother interactions
const tabVariants = {
  inactive: { 
    scale: 1, 
    y: 0, 
    opacity: 0.75,
    filter: 'blur(0px)'
  },
  active: { 
    scale: 1.05, 
    y: -3, 
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 600,
      damping: 25,
      mass: 0.8
    }
  },
  tap: { 
    scale: 0.92,
    y: 1,
    transition: { duration: 0.1 }
  }
};

const iconVariants = {
  inactive: { 
    scale: 1, 
    rotate: 0,
    filter: 'drop-shadow(0 0 0px transparent)'
  },
  active: { 
    scale: 1.15, 
    rotate: [0, -2, 2, 0],
    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))',
    transition: {
      scale: { duration: 0.3, ease: 'easeOut' },
      rotate: { duration: 0.6, ease: 'easeInOut' },
      filter: { duration: 0.3 }
    }
  }
};

const labelVariants = {
  inactive: { 
    y: 0, 
    opacity: 0.7,
    scale: 0.95,
    fontWeight: 400
  },
  active: { 
    y: -1, 
    opacity: 1,
    scale: 1,
    fontWeight: 600,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

const glowVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    filter: 'blur(8px)'
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      duration: 0.4
    }
  }
};

const pressVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.7 
  },
  visible: { 
    opacity: 0.4, 
    scale: 1.3,
    transition: { duration: 0.15, ease: 'easeOut' }
  }
};

const indicatorVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0,
    rotate: -180
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 20,
      delay: 0.1
    }
  }
};

export const MobileNavbarItem: React.FC<MobileNavbarItemProps> = ({
  item,
  isActive,
  isPressed,
  navColors,
  onTabPress,
  onPressStart,
  onPressEnd
}) => {
  const IconComponent = item.icon;

  return (
    <motion.button
      key={item.id}
      variants={tabVariants}
      initial="inactive"
      animate={isActive ? "active" : "inactive"}
      whileTap="tap"
      onTouchStart={() => onPressStart(item.id)}
      onTouchEnd={onPressEnd}
      onClick={() => onTabPress(item.id, item.href)}
      className={cn(
        "relative flex flex-col items-center justify-center flex-1",
        "py-3 px-2 min-h-[64px] touch-manipulation",
        "focus:outline-none transition-all duration-200",
        // Enhanced focus ring
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        "focus-visible:ring-opacity-50"
      )}
      style={{
        color: isActive ? navColors.active : navColors.inactive,
        //@ts-expect-error Ignore
        focusVisibleRing: `2px solid ${navColors.active}50`
      }}
      // Enhanced accessibility
      aria-label={`Navigate to ${item.label}`}
      aria-pressed={isActive}
      role="tab"
    >
      {/* Enhanced background glow with gradient */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            variants={glowVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(ellipse at center, ${navColors.glow} 0%, ${navColors.glow}40 50%, transparent 100%)`,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Refined press effect with ripple */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            variants={pressVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 rounded-2xl"
            style={{ 
              background: `radial-gradient(circle at center, ${navColors.active}20 0%, transparent 70%)`
            }}
          />
        )}
      </AnimatePresence>

      {/* Enhanced icon with better animations */}
      <motion.div
        className="relative z-10 mb-2"
        variants={iconVariants}
        animate={isActive ? "active" : "inactive"}
      >
        <div 
          className="p-1 rounded-xl transition-all duration-300"
          style={{
            backgroundColor: isActive ? `${navColors.active}15` : 'transparent'
          }}
        >
          <IconComponent 
            className="h-5 w-5" 
            strokeWidth={isActive ? 2.5 : 2}
          />
        </div>
      </motion.div>

      {/* Enhanced label with better typography */}
      <motion.span
        className="relative z-10 text-xs tracking-wide"
        variants={labelVariants}
        animate={isActive ? "active" : "inactive"}
        style={{
          fontFamily: 'var(--font-inter)',
          letterSpacing: isActive ? '0.025em' : '0.015em'
        }}
      >
        {item.label}
      </motion.span>

      {/* Modern active indicator - small pill instead of dot */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            variants={indicatorVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full"
            style={{ 
              backgroundColor: navColors.active,
              boxShadow: `0 0 8px ${navColors.active}60`
            }}
          />
        )}
      </AnimatePresence>

      {/* Subtle border highlight for active state */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl border border-opacity-30"
          style={{ borderColor: navColors.active }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Enhanced haptic feedback indicator */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2"
            style={{ borderColor: `${navColors.active}60` }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default MobileNavbarItem;