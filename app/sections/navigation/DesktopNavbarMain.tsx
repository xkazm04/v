'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../../components/theme/theme-toggle';
import { TranslationProgressIndicator } from '@/app/components/ui/TranslationProgressIndicator';
import { NavbarSearchBar } from '@/app/components/search/NavbarSearchBar';

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
}: DesktopNavbarMainProps) {

  return (
    <div className="flex-1 hidden lg:flex items-center justify-center gap-4">
      <TranslationProgressIndicator />
      
      <NavbarSearchBar 
        navbarColors={navbarColors}
        className="flex-1 max-w-md mx-8"
        placeholder="Search news articles..."
      />

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
          <ThemeToggle size="md" />
        </motion.div>
      
      </motion.div>
    </div>
  );
}