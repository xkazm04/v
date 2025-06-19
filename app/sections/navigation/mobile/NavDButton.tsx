'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { LucideIcon } from 'lucide-react';
import { badgeVariants } from '@/app/components/animations/variants/cardVariants';

interface ActionButtonConfig {
  key: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  badge?: number | null;
  variant: 'ghost' | 'outline' | 'default' | 'destructive' | 'secondary';
}

interface NavDButtonProps {
  config: ActionButtonConfig;
  navbarColors: {
    foreground: string | undefined;
    background: string | undefined;
    border: string | undefined;
  };
}

const buttonVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};


export const NavDButton: React.FC<NavDButtonProps> = ({ config, navbarColors }) => {
  const { colors } = useLayoutTheme();
  const IconComponent = config.icon;

  return (
    <motion.div
      key={config.key}
      variants={buttonVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      className="relative"
    >
      <Button
        variant={config.variant}
        size="icon"
        onClick={config.onClick}
        className="relative transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2"
        style={{
          color: navbarColors.foreground,
          backgroundColor: 'transparent'
        }}
        aria-label={config.label}
      >
        {/* Icon with subtle animation */}
        <motion.div
          whileHover={{ rotate: config.key === 'settings' ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <IconComponent className="h-4 w-4" />
        </motion.div>
        
        {/* Enhanced Badge */}
        {config.badge && config.badge > 0 && (
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            whileHover="pulse"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-semibold shadow-lg"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              boxShadow: `0 2px 8px ${colors.primary}40`
            }}
          >
            {config.badge > 99 ? '99+' : config.badge}
          </motion.div>
        )}
        
        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 rounded-md opacity-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      </Button>

      {/* Tooltip */}
      <motion.div
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs rounded-md opacity-0 pointer-events-none z-50 whitespace-nowrap shadow-lg backdrop-blur-sm"
        style={{ 
          backgroundColor: `${navbarColors.background}f8`,
          color: navbarColors.foreground,
          border: `1px solid ${navbarColors.border}`,
          backdropFilter: 'blur(8px)'
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {config.label}
        {/* Tooltip arrow */}
        <div 
          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45"
          style={{ 
            backgroundColor: navbarColors.background,
            border: `1px solid ${navbarColors.border}`,
            borderBottom: 'none',
            borderRight: 'none'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default NavDButton;