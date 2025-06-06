'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/app/lib/utils';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface NavigationItem {
  href: string;
  label: string;
  description?: string;
}

interface NavDLinkProps {
  item: NavigationItem;
  isActive: boolean;
  onNavigation: () => void;
  navbarColors: {
    foreground: string | undefined;
    background: string | undefined;
    border: string | undefined;
  };
}

const navLinkVariants = {
  idle: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -1,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  tap: { scale: 0.98, y: 0 }
};

export const NavDLink: React.FC<NavDLinkProps> = ({ 
  item, 
  isActive, 
  onNavigation, 
  navbarColors 
}) => {
  const { colors } = useLayoutTheme();

  return (
    <motion.div
      key={item.href}
      variants={navLinkVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
    >
      <Link
        href={item.href}
        onClick={onNavigation}
        className={cn(
          'relative group px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
          'hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2',
          'focus:ring-primary',
          isActive ? 'text-primary' : 'text-foreground'
        )}
        style={{
          color: isActive ? colors.primary : navbarColors.foreground || 'inherit',
          backgroundColor: isActive ? `${colors.primary}10` : 'transparent'
        }}
      >
        <span className="relative z-10">{item.label}</span>
        
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="desktop-nav-indicator"
            className="absolute inset-0 rounded-lg border"
            style={{ 
              borderColor: `${colors.primary}30`,
              backgroundColor: `${colors.primary}08`
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 30 
            }}
          />
        )}

        {/* Hover effect */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
          style={{ backgroundColor: `${colors.primary}08` }}
          transition={{ duration: 0.2 }}
        />

        {/* Enhanced tooltip */}
        {item.description && (
          <motion.div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg backdrop-blur-sm"
            style={{ 
              backgroundColor: `${navbarColors.background}f8`,
              color: navbarColors.foreground || 'inherit',
              border: `1px solid ${navbarColors.border}`,
              backdropFilter: 'blur(8px)'
            }}
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            whileHover={{ opacity: 1, y: 0, scale: 1 }}
          >
            {item.description}
            {/* Tooltip arrow */}
            <div 
              className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45"
              style={{ 
                backgroundColor: navbarColors.background || 'transparent',
                border: `1px solid ${navbarColors.border}`,
                borderBottom: 'none',
                borderRight: 'none'
              }}
            />
          </motion.div>
        )}
      </Link>
    </motion.div>
  );
};

export default NavDLink;