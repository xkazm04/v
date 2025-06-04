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
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { width } = useViewport();
  const { colors, sidebarColors, isDark, mounted: themeReady } = useLayoutTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => pathname === path;

  if (!mounted || !themeReady) {
    return null; // Prevent hydration mismatch
  }

  return (
    <motion.div 
      className={cn(
        'h-[calc(100vh-3.5rem)] border-r backdrop-blur-sm transition-all duration-300 hidden md:block relative overflow-hidden sidebar-scroll',
        isCollapsed ? 'w-[80px]' : 'w-[280px]',
        className
      )}
      style={{
        backgroundColor: `${sidebarColors.background}f5`, // Add slight transparency
        borderColor: sidebarColors.border
      }}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Enhanced background with subtle patterns */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: isDark 
              ? `linear-gradient(135deg, ${sidebarColors.background} 0%, ${colors.muted} 50%, ${sidebarColors.background} 100%)`
              : `linear-gradient(135deg, ${sidebarColors.background} 0%, ${colors.background} 50%, ${sidebarColors.background} 100%)`
          }}
        />
        
        {/* Subtle dot pattern overlay */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${sidebarColors.muted} 1px, transparent 0)`,
            backgroundSize: '20px 20px',
            opacity: isDark ? 0.05 : 0.02
          }}
        />
        
        {/* Subtle vertical accent line */}
        <div 
          className="absolute right-0 top-0 w-px h-full"
          style={{
            background: `linear-gradient(to bottom, transparent, ${colors.primary}33, transparent)`
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Main navigation content */}
        {width > 1000 && (
          <div className="flex-1 overflow-hidden">
            <SideCat 
              isCollapsed={isCollapsed}
              isActive={isActive}
            />
          </div>
        )}

        {/* Bottom controls */}
        <div 
          className="border-t p-3"
          style={{ borderColor: `${sidebarColors.border}80` }}
        >
          <div className="flex items-center justify-between">
            {/* Settings button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full transition-all duration-200 hover:bg-opacity-80"
                style={{
                  color: sidebarColors.muted,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = sidebarColors.hover || '';
                  e.currentTarget.style.color = sidebarColors.foreground;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = sidebarColors.muted;
                }}
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
                className="rounded-full transition-all duration-200"
                style={{
                  color: sidebarColors.muted,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.primary}15`;
                  e.currentTarget.style.color = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = sidebarColors.muted;
                }}
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
                <span 
                  className="text-xs"
                  style={{ color: sidebarColors.muted }}
                >
                  Click to collapse
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, ${colors.primary}08, ${colors.accent}05)`,
          opacity: 0
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}