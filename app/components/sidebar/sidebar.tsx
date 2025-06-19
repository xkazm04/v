'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';
import SideCat from './SideCat';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { colors, sidebarColors, isDark, mounted: themeReady } = useLayoutTheme();

  useEffect(() => {
    setMounted(true);
  }, []);


  const isActive = (path: string) => pathname === path;

  if (!mounted || !themeReady) {
    return (
      <div
        className={cn(
          'h-[calc(100vh-3.5rem)] border-r transition-all duration-300 hidden md:block w-[100px]',
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
        'h-[calc(100vh-3.5rem)] border-r transition-all duration-300 hidden md:block relative overflow-hidden w-[180px]',
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
          className="absolute right-0 top-0 h-full"
          style={{
            background: isDark
              ? `linear-gradient(to bottom, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)`
              : `linear-gradient(to bottom, transparent 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)`
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col justify-start">
        <div className="overflow-hidden">
          <SideCat
            isActive={isActive}
          />
        </div>
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
                //@ts-expect-error Ignore
                e.currentTarget.style.color = sidebarColors.muted;
              }}
              asChild
            >
              <Link href="/settings">
                <Settings className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
            </Button>
          </motion.div>
      </div>
    </motion.div>
  );
}