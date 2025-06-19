'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useRef } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

// ✅ Helper to normalize pathname by removing locale prefix
const normalizePathname = (pathname: string): string => {
  // Remove locale prefix if present (/en, /es, /cs)
  const localePattern = /^\/(en|es|cs)(?=\/|$)/;
  return pathname.replace(localePattern, '') || '/';
};

const getTransitionVariants = (pathname: string, previousPath?: string): Variants => {
  const getDirection = () => {
    if (!previousPath) return 'neutral';
    
    // ✅ Normalize both paths to compare routes without locale
    const normalizedCurrent = normalizePathname(pathname);
    const normalizedPrevious = normalizePathname(previousPath);
    
    const routeOrder = ['/', '/reel', '/upload', '/timeline', '/dashboard'];
    const currentIndex = routeOrder.findIndex(route => normalizedCurrent.startsWith(route));
    const previousIndex = routeOrder.findIndex(route => normalizedPrevious.startsWith(route));
    
    if (currentIndex === -1 || previousIndex === -1) return 'neutral';
    return currentIndex > previousIndex ? 'left' : 'right';
  };

  const direction = getDirection();
  
  return {
    initial: { 
      opacity: 0,
      x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
      y: direction === 'neutral' ? 10 : 0
    },
    animate: { 
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    exit: { 
      opacity: 0,
      x: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
      transition: {
        duration: 0.15,
        ease: 'easeIn'
      }
    }
  };
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const previousPathRef = useRef<string>(pathname);

  // Update previous path after transition
  const handleExitComplete = () => {
    previousPathRef.current = pathname;
  };

  const variants = getTransitionVariants(pathname, previousPathRef.current);

  return (
    <AnimatePresence 
      mode="wait" 
      initial={false}
      onExitComplete={handleExitComplete}
    >
      <motion.div
        key={normalizePathname(pathname)} // ✅ Use normalized pathname as key
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}