'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../../components/theme/theme-toggle';
import { TranslationProgressIndicator } from '@/app/components/ui/TranslationProgressIndicator';
import Image from 'next/image';
import { useViewport } from '@/app/hooks/useViewport';

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
  const { isHd } = useViewport();
  return (
    <div className="flex-1 lg:flex items-center justify-end gap-4">
      <TranslationProgressIndicator />

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
        <div className={`fixed right-20
          ${isHd ? 'h-32 w-32 top-5' : 'h-16 w-16'}
          `}>
          <a href="https://bolt.new/" target="_blank" rel="noopener noreferrer">
            <Image
              src="/bolt/bolt_light.png"
              alt="bolt-badge"
              fill
              className="object-cover"
            />
          </a>
        </div>
      </motion.div>
    </div>
  );
}