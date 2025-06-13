'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useNavigationContext } from '@/app/providers/navigation-provider';
import { useState, useCallback, useMemo } from 'react';
import { cn } from '@/app/lib/utils';
import MobileNavbarItem from './MobileNavbarItem';
import { MOBILE_NAV } from '@/app/config/navItems';
import MobileNavActionButton from './MobileNavActionButton';

interface MobileNavbarProps {
  isVideoPlayerMode?: boolean;
  onVideoPlayerModeToggle?: () => void;
  className?: string;
}

const NAVBAR_HEIGHTS = {
  compact: 48,
  expanded: 72
} as const;

const SAFE_AREA_BOTTOM = 'max(env(safe-area-inset-bottom), 16px)';

export function MobileNavbar({ 
  isVideoPlayerMode = false,
  onVideoPlayerModeToggle,
  className
}: MobileNavbarProps) {
  const router = useRouter();
  const { colors, isDark, mounted } = useLayoutTheme();
  const { activeTab, setActiveTab, setIsNavigating } = useNavigationContext();
  const [pressedTab, setPressedTab] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(isVideoPlayerMode);

  // Memoized styles for better performance
  const navStyles = useMemo(() => ({
    background: isVideoPlayerMode 
      ? isDark 
        ? 'rgba(0, 0, 0, 0.9)' 
        : 'rgba(0, 0, 0, 0.8)'
      : isDark 
        ? 'rgba(15, 23, 42, 0.95)' 
        : 'rgba(255, 255, 255, 0.95)',
    
    border: isVideoPlayerMode
      ? 'rgba(255, 255, 255, 0.15)'
      : isDark 
        ? 'rgba(71, 85, 105, 0.2)' 
        : 'rgba(226, 232, 240, 0.3)',
    
    shadow: isVideoPlayerMode
      ? '0 8px 32px rgba(0, 0, 0, 0.6)'
      : isDark 
        ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
        : '0 8px 32px rgba(0, 0, 0, 0.08)',
    
    colors: {
      inactive: isVideoPlayerMode
        ? 'rgba(255, 255, 255, 0.7)'
        : isDark 
          ? 'rgba(148, 163, 184, 0.8)' 
          : 'rgba(100, 116, 139, 0.8)',
      active: colors.primary,
      glow: `${colors.primary}25`
    }
  }), [isVideoPlayerMode, isDark, colors.primary]);

  const handleTabPress = useCallback((tabId: string, href: string) => {
    setPressedTab(tabId);
    setIsNavigating(true);
    setActiveTab(tabId);
    
    // Simple haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    router.push(href);

    // Clean up states
    const cleanup = () => {
      setPressedTab(null);
      setIsNavigating(false);
    };

    requestAnimationFrame(() => {
      setTimeout(cleanup, 100);
    });
  }, [router, setActiveTab, setIsNavigating]);

  const handleCollapseToggle = useCallback(() => {
    setIsCollapsed(prev => !prev);
    onVideoPlayerModeToggle?.();
  }, [onVideoPlayerModeToggle]);

  if (!mounted) {
    return null;
  }

  const isCompact = isVideoPlayerMode && isCollapsed;

  return (
    <motion.div
      className={cn(
        "fixed left-0 right-0 z-40 md:hidden",
        className
      )}
      style={{
        bottom: isVideoPlayerMode ? '16px' : '0px',
        paddingBottom: isVideoPlayerMode ? '0px' : SAFE_AREA_BOTTOM,
      }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        mass: 0.8 
      }}
    >
      {/* Collapse Toggle Button - Video Mode Only */}
      <AnimatePresence>
        {isVideoPlayerMode && (
          <motion.div
            className="flex justify-center mb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              onClick={handleCollapseToggle}
              className="px-3 py-1.5 rounded-full backdrop-blur-md border"
              style={{
                backgroundColor: navStyles.background,
                borderColor: navStyles.border,
                color: navStyles.colors.inactive
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 0 : 180 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <ChevronUp className="h-4 w-4" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation Container */}
      <motion.nav 
        className="mx-4 rounded-2xl border backdrop-blur-xl relative overflow-hidden"
        style={{
          backgroundColor: navStyles.background,
          borderColor: navStyles.border,
          boxShadow: navStyles.shadow,
        }}
        animate={{
          height: isCompact ? NAVBAR_HEIGHTS.compact : NAVBAR_HEIGHTS.expanded,
          borderRadius: isCompact ? '16px' : '24px'
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 0.8
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Navigation Items */}
        <div 
          className={cn(
            "flex items-center justify-around relative z-10 h-full",
            isCompact ? "px-2" : "px-3 py-2"
          )}
        >
          {MOBILE_NAV.map((item) => (
            <MobileNavbarItem
              key={item.id}
              // @ts-expect-error - Type mismatch on item prop
              item={item}
              isActive={activeTab === item.id}
              isPressed={pressedTab === item.id}
              navColors={navStyles.colors}
              onTabPress={handleTabPress}
              isCompact={isCompact}
            />
          ))}
        </div>
      </motion.nav>

      {/* Safe Area Spacer - Only in normal mode */}
      {!isVideoPlayerMode && (
        <div 
          className="h-4"
          style={{ 
            height: 'env(safe-area-inset-bottom)',
            minHeight: '16px'
          }}
        />
      )}
    </motion.div>
  );
}