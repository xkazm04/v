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
  inactive: string;
  active: string;
  glow: string;
}

interface MobileNavbarItemProps {
  item: TabItem;
  isActive: boolean;
  isPressed: boolean;
  navColors: NavColors;
  onTabPress: (tabId: string, href: string) => void;
  isCompact?: boolean; 
}

const itemVariants = {
  idle: {
    scale: 1,
    y: 0
  },
  pressed: {
    scale: 0.95,
    y: 1
  },
  active: {
    scale: 1.05,
    y: -2
  },
  activeCompact: {
    scale: 1,
    y: 0
  }
};

const iconVariants = {
  idle: {
    rotate: 0,
    scale: 1
  },
  active: {
    rotate: [0, -10, 10, 0],
    scale: 1.1,
    transition: {
      rotate: {
        duration: 0.4,
        ease: "easeInOut"
      },
      scale: {
        duration: 0.2
      }
    }
  }
};

export const MobileNavbarItem: React.FC<MobileNavbarItemProps> = ({
  item,
  isActive,
  isPressed,
  navColors,
  onTabPress,
  isCompact = false
}) => {
  const IconComponent = item.icon;

  const getAnimationState = () => {
    if (isPressed) return 'pressed';
    if (isActive) return isCompact ? 'activeCompact' : 'active';
    return 'idle';
  };

  return (
    <motion.button
      variants={itemVariants}
      animate={getAnimationState()}
      onTouchStart={() => {}} // Simplified touch handling
      onClick={() => onTabPress(item.id, item.href)}
      className={cn(
        "relative flex flex-col items-center justify-center flex-1",
        "touch-manipulation focus:outline-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        "transition-colors duration-200",
        isCompact ? "py-2 px-1 min-h-[40px]" : "py-3 px-2 min-h-[56px]"
      )}
      style={{
        color: isActive ? navColors.active : navColors.inactive
      }}
      aria-label={`Navigate to ${item.label}`}
      aria-pressed={isActive}
      role="tab"
    >
      {/* Active Background Glow */}
      <AnimatePresence>
        {isActive && !isCompact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 rounded-xl"
            style={{
              background: `radial-gradient(ellipse at center, ${navColors.glow} 0%, transparent 70%)`,
            }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      {/* Icon */}
      <motion.div
        className={cn(
          "relative z-10 flex items-center justify-center",
          isCompact ? "mb-0" : "mb-1"
        )}
        variants={iconVariants}
        animate={isActive ? 'active' : 'idle'}
      >
        <div 
          className={cn(
            "rounded-lg transition-all duration-200",
            isActive && !isCompact && "bg-white/10",
            isCompact ? "p-1" : "p-1.5"
          )}
        >
          <IconComponent 
            className={cn(
              isCompact ? "h-4 w-4" : "h-5 w-5"
            )}
            strokeWidth={isActive ? 2.5 : 2}
          />
        </div>
      </motion.div>

      {/* Label - Hidden in compact mode */}
      <AnimatePresence>
        {!isCompact && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 text-xs font-medium tracking-wide"
            style={{
              fontWeight: isActive ? 600 : 500
            }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Active Indicator Dot */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className={cn(
              "absolute rounded-full",
              isCompact 
                ? "top-1 right-1 h-1.5 w-1.5" 
                : "top-2 right-2 h-2 w-2"
            )}
            style={{ 
              backgroundColor: navColors.active,
              boxShadow: `0 0 8px ${navColors.active}60`
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default MobileNavbarItem;