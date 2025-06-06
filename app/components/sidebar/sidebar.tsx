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
    return (
      <div 
        className={cn(
          'h-[calc(100vh-3.5rem)] border-r transition-all duration-300 hidden md:block',
          isCollapsed ? 'w-[80px]' : 'w-[280px]',
          className
        )}
        style={{
          backgroundColor: '#1e293b',
          borderColor: '#334155'
        }}
      />
    );
  }

  return (
    <motion.div 
      className={cn(
        'h-[calc(100vh-3.5rem)] border-r transition-all duration-300 hidden md:block relative overflow-hidden',
        isCollapsed ? 'w-[80px]' : 'w-[280px]',
        className
      )}
      style={{
        backgroundColor: sidebarColors.background,
        borderColor: sidebarColors.border
      }}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Enhanced background */}
      <div className="absolute inset-0">
        {/* Base gradient background */}
        <div 
          className="absolute inset-0"
          style={{
            background: isDark 
              ? `linear-gradient(180deg, 
                  ${sidebarColors.background} 0%, 
                  rgba(30, 41, 59, 0.98) 50%, 
                  ${sidebarColors.background} 100%
                )`
              : `linear-gradient(180deg, 
                  ${sidebarColors.background} 0%, 
                  rgba(248, 250, 252, 0.98) 50%, 
                  ${sidebarColors.background} 100%
                )`
          }}
        />
        
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: isDark
              ? `radial-gradient(circle at 2px 2px, rgba(148, 163, 184, 0.4) 1px, transparent 0)`
              : `radial-gradient(circle at 2px 2px, rgba(71, 85, 105, 0.3) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
        
        {/* Right border accent */}
        <div 
          className="absolute right-0 top-0 w-px h-full"
          style={{
            background: isDark
              ? `linear-gradient(to bottom, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)`
              : `linear-gradient(to bottom, transparent 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)`
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Navigation content */}
        <div className="flex-1 overflow-hidden">
          <SideCat 
            isCollapsed={isCollapsed}
            isActive={isActive}
          />
        </div>

        {/* Bottom controls */}
        <div 
          className="border-t p-4"
          style={{ 
            borderColor: sidebarColors.border,
            background: isDark 
              ? 'rgba(15, 23, 42, 0.5)' 
              : 'rgba(248, 250, 252, 0.8)'
          }}
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
                className="rounded-xl transition-all duration-200 group"
                style={{
                  color: sidebarColors.muted,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark 
                    ? 'rgba(59, 130, 246, 0.1)' 
                    : 'rgba(59, 130, 246, 0.05)';
                  e.currentTarget.style.color = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = sidebarColors.muted;
                }}
                asChild
              >
                <Link href="/settings">
                  <Settings className="h-4 w-4 transition-transform group-hover:rotate-45" />
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
                className="rounded-xl transition-all duration-200 group"
                style={{
                  color: sidebarColors.muted,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark 
                    ? 'rgba(34, 197, 94, 0.1)' 
                    : 'rgba(34, 197, 94, 0.05)';
                  e.currentTarget.style.color = isDark ? '#4ade80' : '#16a34a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = sidebarColors.muted;
                }}
              >
                <motion.div
                  animate={{ rotate: isCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="group-hover:scale-110 transition-transform"
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
                className="mt-3 text-center"
              >
                <span 
                  className="text-xs font-medium"
                  style={{ color: sidebarColors.muted }}
                >
                  Click arrow to collapse
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}