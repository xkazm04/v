'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon | React.ElementType;
  href: string;
  isSpecial?: boolean;
  isCustomIcon?: boolean;
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
    scale: 1,
    rotate: 0
  },
  pressed: {
    scale: 0.9,
    rotate: -2
  },
  active: {
    scale: 1.15,
    rotate: 0
  },
  activeCompact: {
    scale: 1.05,
    rotate: 0
  }
};

const labelVariants = {
  idle: {
    opacity: 0.7,
    y: 0,
    scale: 1
  },
  pressed: {
    opacity: 0.9,
    y: 1,
    scale: 0.95
  },
  active: {
    opacity: 1,
    y: 0,
    scale: 1.05
  },
  activeCompact: {
    opacity: 1,
    y: 0,
    scale: 1
  }
};

const MobileNavbarItem = React.memo(function MobileNavbarItem({
  item,
  isActive,
  isPressed,
  navColors,
  onTabPress,
  isCompact = false
}: MobileNavbarItemProps) {
  const Icon = item.icon;
  
  // Enhanced styling for better visual hierarchy
  const getActiveGlow = () => {
    if (!isActive) return 'none';
    
    return `0 0 20px ${navColors.glow}, 0 0 40px ${navColors.glow}15, 0 4px 8px ${navColors.active}40`;
  };

  const getIconSize = () => {
    if (isCompact) return item.isCustomIcon ? 18 : 18;
    return item.isCustomIcon ? 32 : 20;
  };

  const getItemVariant = () => {
    if (isPressed) return 'pressed';
    if (isActive) return isCompact ? 'activeCompact' : 'active';
    return 'idle';
  };

  const getIconColor = () => {
    return isActive ? navColors.active : navColors.inactive;
  };

  return (
    <motion.button
      variants={itemVariants}
      animate={getItemVariant()}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
        mass: 0.8
      }}
      onClick={() => onTabPress(item.id, item.href)}
      className={cn(
        "relative flex flex-col items-center justify-center",
        "transition-all duration-200 ease-out rounded-xl",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        isCompact ? "px-3 py-1" : "px-4 py-2 gap-1",
        isActive && !isCompact && "bg-white/5"
      )}
      style={{
        minHeight: isCompact ? '32px' : '56px',
        minWidth: isCompact ? '40px' : '64px'
      }}
      aria-label={`Navigate to ${item.label}`}
      role="tab"
      aria-selected={isActive}
    >
      {/* Enhanced Active Background */}
      <AnimatePresence>
        {isActive && !isCompact && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: `radial-gradient(circle at center, ${navColors.glow} 0%, transparent 70%)`,
              filter: 'blur(8px)'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Icon Container */}
      <motion.div
        variants={iconVariants}
        animate={getItemVariant()}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 25
        }}
        className="relative z-10 flex items-center justify-center"
        style={{
          filter: isActive ? `drop-shadow(${getActiveGlow()})` : 'none'
        }}
      >
        {/* Render Custom Icon vs Lucide Icon */}
        {item.isCustomIcon ? (
          <Icon 
            width={getIconSize()} 
            height={getIconSize()} 
            color={getIconColor()}
          />
        ) : (
          <Icon 
            size={getIconSize()} 
            color={getIconColor()}
            strokeWidth={isActive ? 2.5 : 2}
          />
        )}
      </motion.div>

      {/* Enhanced Label */}
      <AnimatePresence mode="wait">
        {!isCompact && (
          <motion.span
            variants={labelVariants}
            animate={getItemVariant()}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              delay: 0.05
            }}
            className={cn(
              "text-xs font-medium tracking-wide relative z-10",
              "select-none pointer-events-none"
            )}
            style={{ 
              color: getIconColor(),
              textShadow: isActive ? `0 0 8px ${navColors.active}60` : 'none',
              fontWeight: isActive ? 600 : 500
            }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Special Item Indicator */}
      <AnimatePresence>
        {item.isSpecial && isActive && (
          <motion.div
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full z-20"
            style={{ backgroundColor: navColors.active }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1], 
              opacity: 1,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 0.6,
              times: [0, 0.6, 1],
              ease: "easeOut"
            }}
          />
        )}
      </AnimatePresence>

      {/* Active State Ripple Effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: `radial-gradient(circle at center, ${navColors.active}30 0%, transparent 60%)`
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: [0, 1, 0] }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
});

export default MobileNavbarItem;