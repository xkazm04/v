'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { NAVIGATION_CONFIG } from '@/app/config/navItems';
import { ThemeToggle } from '../../components/theme/theme-toggle';
import NavDLink from './NavDLink';

interface DesktopNavbarMainProps {
  navbarColors: {
    foreground: string;
    background: string;
    border: string;
  };
  onNavigation: () => void;
}

export default function DesktopNavbarMain({ 
  navbarColors, 
  onNavigation 
}: DesktopNavbarMainProps) {
  const pathname = usePathname();

  const isActivePath = React.useCallback((href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  }, [pathname]);


  const renderNavLink = (item: (typeof NAVIGATION_CONFIG.mainNav)[number]) => {
    const isActive = isActivePath(item.href);
    
    return (
      <NavDLink
        key={item.href}
        item={item}
        isActive={isActive}
        onNavigation={onNavigation}
        navbarColors={navbarColors}
      />
    );
  };

  return (
    <div className="flex-1 hidden lg:flex items-center justify-between">
      {/* Navigation Links with stagger animation */}
      <motion.nav 
        className="flex items-center space-x-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.2,
          staggerChildren: 0.1
        }}
      >
        {NAVIGATION_CONFIG.mainNav.map(renderNavLink)}
      </motion.nav>

      {/* Search Bar Placeholder */}
      <motion.div 
        className="flex-1 max-w-md mx-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Search component will be added here */}
        <div 
          className="h-10 rounded-lg border flex items-center px-3 text-sm transition-all duration-200"
          style={{
            backgroundColor: `${navbarColors.background}80`,
            borderColor: navbarColors.border,
            color: `${navbarColors.foreground}60`
          }}
        >
          Search news and videos...
        </div>
      </motion.div>

      {/* Action Buttons with stagger animation */}
      <motion.div 
        className="flex items-center space-x-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.4,
          staggerChildren: 0.05
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ThemeToggle variant="enhanced" size="md" />
        </motion.div>
      
      </motion.div>
    </div>
  );
}