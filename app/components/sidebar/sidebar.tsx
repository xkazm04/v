'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';
import SideCat from './SideCat';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarColors, isDark, mounted: themeReady } = useLayoutTheme();

  const isActive = (path: string) => pathname === path;

  return (
    <motion.div
      className={cn(
        'min-h-full border-r transition-all duration-300 hidden md:block relative overflow-hidden',
        'w-[200px]',
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
      {/* ✅ Enhanced vintage newspaper background */}
      <div className="absolute inset-0">
        {isDark ? (
          // Dark mode background (keep existing)
          <>
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, 
                  ${sidebarColors.background} 0%, 
                  rgba(30, 41, 59, 0.95) 30%, 
                  rgba(15, 23, 42, 0.98) 70%,
                  ${sidebarColors.background} 100%
                )`
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.4) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
            />
          </>
        ) : (
          // ✅ NEW: Vintage newspaper light mode
          <>
            {/* Base aged paper background */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, 
                  #f8f6f0 0%, 
                  #f4f1ec 25%, 
                  #f0ebe1 50%,
                  #eae3d2 75%,
                  #e8dcc0 100%
                )`
              }}
            />
            
            {/* Paper texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(139, 69, 19, 0.05) 2px, transparent 0),
                  radial-gradient(circle at 75% 75%, rgba(205, 133, 63, 0.03) 1px, transparent 0),
                  linear-gradient(45deg, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
                  linear-gradient(-45deg, rgba(205, 133, 63, 0.02) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px, 20px 20px, 40px 40px, 40px 40px'
              }}
            />
            
            {/* Coffee stain effects */}
            <div className="absolute top-12 left-4 w-8 h-8 rounded-full opacity-[0.08]" 
                 style={{ background: 'radial-gradient(circle, rgba(139, 69, 19, 0.3) 0%, transparent 70%)' }} />
            <div className="absolute top-32 right-2 w-6 h-6 rounded-full opacity-[0.06]" 
                 style={{ background: 'radial-gradient(circle, rgba(160, 82, 45, 0.4) 0%, transparent 60%)' }} />
            <div className="absolute bottom-20 left-6 w-4 h-4 rounded-full opacity-[0.05]" 
                 style={{ background: 'radial-gradient(circle, rgba(139, 69, 19, 0.5) 0%, transparent 50%)' }} />
            
          </>
        )}

        {/* Enhanced border accent */}
        <div
          className="absolute right-0 top-0 h-full w-px"
          style={{
            background: isDark
              ? `linear-gradient(to bottom, transparent 0%, rgba(59, 130, 246, 0.4) 20%, rgba(147, 51, 234, 0.3) 80%, transparent 100%)`
              : `linear-gradient(to bottom, transparent 0%, rgba(139, 69, 19, 0.3) 10%, rgba(205, 133, 63, 0.4) 30%, rgba(160, 82, 45, 0.3) 70%, rgba(139, 69, 19, 0.2) 90%, transparent 100%)`
          }}
        />
        
      </div>

      <div className="relative z-10 min-h-full">
        <SideCat
          isCollapsed={false}
          isActive={isActive}
        />
      </div>      
    </motion.div>
  );
}