'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { iconVariants, labelVariants, tabVariants } from '@/app/components/animations/variants/mobileNavVariants';

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
  isCompact?: boolean; 
}


export const MobileNavbarItem: React.FC<MobileNavbarItemProps> = ({
  item,
  isActive,
  isPressed,
  navColors,
  onTabPress,
  onPressStart,
  onPressEnd,
  isCompact = false
}) => {
  const IconComponent = item.icon;

  return (
    <motion.button
      key={item.id}
      variants={tabVariants}
      initial="inactive"
      animate={isActive ? (isCompact ? "activeCompact" : "active") : "inactive"}
      whileTap="tap"
      onTouchStart={() => onPressStart(item.id)}
      onTouchEnd={onPressEnd}
      onClick={() => onTabPress(item.id, item.href)}
      className={cn(
        "relative flex flex-col items-center justify-center flex-1",
        "touch-manipulation focus:outline-none transition-all duration-200",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        "focus-visible:ring-opacity-50",
        isCompact ? "py-2 px-2 min-h-[40px]" : "py-3 px-2 min-h-[64px]"
      )}
      style={{
        color: isActive ? navColors.active : navColors.inactive,
        focusVisibleRing: `2px solid ${navColors.active}50`
      }}
      aria-label={`Navigate to ${item.label}`}
      aria-pressed={isActive}
      role="tab"
    >
      {/* Enhanced background glow - reduced in compact mode */}
      <AnimatePresence>
        {isActive && !isCompact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(ellipse at center, ${navColors.glow} 0%, ${navColors.glow}40 50%, transparent 100%)`,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Compact mode active indicator */}
      <AnimatePresence>
        {isActive && isCompact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${navColors.active}20, ${navColors.active}10)`,
              backdropFilter: 'blur(8px)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Press effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.4, scale: 1.3 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="absolute inset-0 rounded-2xl"
            style={{ 
              background: `radial-gradient(circle at center, ${navColors.active}20 0%, transparent 70%)`
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Enhanced icon with compact mode adaptation */}
      <motion.div
        className={cn(
          "relative z-10",
          isCompact ? "mb-0" : "mb-2"
        )}
        variants={iconVariants}
        animate={isActive ? (isCompact ? "activeCompact" : "active") : "inactive"}
      >
        <div 
          className={cn(
            "transition-all duration-300",
            isCompact ? "p-0.5 rounded-lg" : "p-1 rounded-xl"
          )}
          style={{
            backgroundColor: isActive ? `${navColors.active}15` : 'transparent'
          }}
        >
          <IconComponent 
            className={cn(
              isCompact ? "h-4 w-4" : "h-5 w-5"
            )}
            strokeWidth={isActive ? 2.5 : 2}
          />
        </div>
      </motion.div>

      {/* Label - hidden in compact mode */}
      <AnimatePresence>
        {!isCompact && (
          <motion.span
            className="relative z-10 text-xs tracking-wide"
            variants={labelVariants}
            animate={isActive ? "active" : "inactive"}
            exit="hidden"
            style={{
              fontFamily: 'var(--font-inter)',
              letterSpacing: isActive ? '0.025em' : '0.015em'
            }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Compact mode active indicator dot */}
      <AnimatePresence>
        {isActive && isCompact && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-1 right-1 h-1 w-1 rounded-full"
            style={{ 
              backgroundColor: navColors.active,
              boxShadow: `0 0 4px ${navColors.active}80`
            }}
          />
        )}
      </AnimatePresence>

      {/* Regular active indicator - hidden in compact mode */}
      <AnimatePresence>
        {isActive && !isCompact && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full"
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