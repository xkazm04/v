'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import SideCat from './SideCat';
import { useViewport } from '@/app/hooks/useViewport';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { width } = useViewport();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <motion.div 
      className={cn(
        'h-[calc(100vh-3.5rem)] border-r border-border/40 bg-background/95 backdrop-blur-sm transition-all duration-300 hidden md:block relative overflow-hidden',
        isCollapsed ? 'w-[80px]' : 'w-[280px]',
        className
      )}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Enhanced background with subtle patterns */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900" />
        
        {/* Subtle dot pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Subtle vertical accent line */}
        <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Main navigation content */}
        {width > 1000 && <div className="flex-1 overflow-hidden">
          <SideCat 
            isCollapsed={isCollapsed}
            isActive={isActive}
          />
        </div>}

        {/* Bottom controls */}
        <div className="border-t border-border/30 p-3">
          <div className="flex items-center justify-between">
            {/* Settings button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-200"
                asChild
              >
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Toggle button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="rounded-full hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-200"
              >
                <motion.div
                  animate={{ rotate: isCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
          </div>

          {/* Collapse indicator */}
          <AnimatePresence>
            {mounted && !isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 text-center"
              >
                <span className="text-xs text-muted-foreground">
                  Click to collapse
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}