'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useNavigationContext } from '@/app/providers/navigation-provider';
import { useAuth } from '@/app/hooks/useAuth';
import { useState, useCallback } from 'react';
import { containerVariants } from '@/app/components/animations/variants/mobileNavVariants';
import MobileNavbarItem from './MobileNavbarItem';
import { MOBILE_NAV } from '@/app/config/navItems';
import MobileNavActionButton from './MobileNavActionButton';

interface MobileNavbarProps {
  isVideoPlayerMode?: boolean;
  onVideoPlayerModeToggle?: () => void;
  className?: string;
}

const videoModeVariants = {
  compact: {
    height: '48px',
    borderRadius: '12px',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30
    }
  },
  expanded: {
    height: '72px',
    borderRadius: '24px',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30
    }
  }
};

const itemVideoModeVariants = {
  compact: {
    scale: 0.8,
    y: 0,
    transition: { duration: 0.2 }
  },
  expanded: {
    scale: 1,
    y: 0,
    transition: { duration: 0.2 }
  }
};

export function MobileNavbar({ 
  isVideoPlayerMode = false,
  onVideoPlayerModeToggle,
  className
}: MobileNavbarProps) {
  const router = useRouter();
  const { colors, isDark, mounted } = useLayoutTheme();
  const { activeTab, setActiveTab, setIsNavigating } = useNavigationContext();
  const { user } = useAuth();
  const [isPressed, setIsPressed] = useState<string | null>(null);
  
  const [isCollapsed, setIsCollapsed] = useState(isVideoPlayerMode);

  const handleTabPress = useCallback((tabId: string, href: string) => {
    setIsPressed(tabId);
    setIsNavigating(true);
    setActiveTab(tabId);
    
    // Enhanced haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 5, 10]);
    }

    router.push(href);

    // Reset press state
    setTimeout(() => {
      setIsPressed(null);
      setIsNavigating(false);
    }, 150);
  }, [router, setActiveTab, setIsNavigating]);

  const handlePressStart = useCallback((tabId: string) => {
    setIsPressed(tabId);
  }, []);

  const handlePressEnd = useCallback(() => {
    setIsPressed(null);
  }, []);



  const handleNavbarToggle = useCallback(() => {
    setIsCollapsed(!isCollapsed);
    onVideoPlayerModeToggle?.();
  }, [isCollapsed, onVideoPlayerModeToggle]);

  if (!mounted) {
    return null;
  }

  // Enhanced color scheme with video player mode adaptations
  const navColors = {
    background: isVideoPlayerMode 
      ? isDark 
        ? 'rgba(0, 0, 0, 0.85)' 
        : 'rgba(0, 0, 0, 0.75)'
      : isDark 
        ? 'rgba(8, 16, 32, 0.95)' 
        : 'rgba(255, 255, 255, 0.95)',
    border: isVideoPlayerMode
      ? 'rgba(255, 255, 255, 0.1)'
      : isDark 
        ? 'rgba(71, 85, 105, 0.15)' 
        : 'rgba(226, 232, 240, 0.25)',
    inactive: isVideoPlayerMode
      ? 'rgba(255, 255, 255, 0.6)'
      : isDark 
        ? 'rgba(148, 163, 184, 0.65)' 
        : 'rgba(100, 116, 139, 0.65)',
    active: colors.primary,
    glow: `${colors.primary}20`,
    shadow: isVideoPlayerMode
      ? 'rgba(0, 0, 0, 0.8)'
      : isDark 
        ? 'rgba(0, 0, 0, 0.6)' 
        : 'rgba(0, 0, 0, 0.08)',
    fabShadow: `0 8px 32px ${colors.primary}40, 0 4px 16px ${colors.primary}20`
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`fixed left-0 right-0 z-40 md:hidden ${className}`}
      style={{
        bottom: isVideoPlayerMode ? '16px' : '0px',
        paddingBottom: isVideoPlayerMode ? '0px' : 'max(env(safe-area-inset-bottom), 16px)',
      }}
    >
      {isVideoPlayerMode && (
        <motion.div
          className="flex justify-center mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={handleNavbarToggle}
            className="px-4 py-1 rounded-full backdrop-blur-sm border"
            style={{
              backgroundColor: navColors.background,
              borderColor: navColors.border,
              color: navColors.inactive
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="h-4 w-4" />
            </motion.div>
          </motion.button>
        </motion.div>
      )}

      {/* navbar container */}
      <motion.div 
        className="mx-3 rounded-3xl border backdrop-blur-2xl relative overflow-hidden"
        style={{
          backgroundColor: navColors.background,
          borderColor: navColors.border,
          boxShadow: `0 12px 40px ${navColors.shadow}, 0 0 0 0.5px ${navColors.border}`,
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)'
        }}
        variants={videoModeVariants}
        animate={isVideoPlayerMode && isCollapsed ? "compact" : "expanded"}
        layout
      >
        {/* Animated top highlight - dimmed in video mode */}
        {!isVideoPlayerMode && (
          <motion.div
            className="absolute top-0 left-6 right-6 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${navColors.border}, ${colors.primary}40, ${navColors.border}, transparent)`
            }}
            animate={{
              opacity: [0.4, 1, 0.4],
              background: [
                `linear-gradient(90deg, transparent, ${navColors.border}, transparent)`,
                `linear-gradient(90deg, transparent, ${colors.primary}60, ${navColors.border}, transparent)`,
                `linear-gradient(90deg, transparent, ${navColors.border}, transparent)`
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}

        {/* Subtle background pattern - reduced in video mode */}
        <div 
          className="absolute inset-0"
          style={{
            opacity: isVideoPlayerMode ? 0.02 : 0.05,
            backgroundImage: `radial-gradient(circle at 20% 50%, ${colors.primary} 1px, transparent 1px), radial-gradient(circle at 80% 50%, ${colors.primary} 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* tab items container */}
        <motion.div 
          className="flex items-center justify-around relative z-10"
          style={{
            padding: isVideoPlayerMode && isCollapsed ? '8px 4px' : '8px 4px 12px 4px'
          }}
          variants={itemVideoModeVariants}
          animate={isVideoPlayerMode && isCollapsed ? "compact" : "expanded"}
        >
          {MOBILE_NAV.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVideoModeVariants}
              animate={isVideoPlayerMode && isCollapsed ? "compact" : "expanded"}
            >
              <MobileNavbarItem
                //@ts-expect-error Ignore type mismatch
                item={item}
                isActive={activeTab === item.id}
                isPressed={isPressed === item.id}
                navColors={navColors}
                onTabPress={handleTabPress}
                onPressStart={handlePressStart}
                onPressEnd={handlePressEnd}
                isCompact={isVideoPlayerMode && isCollapsed}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced floating action button - hidden in compact video mode */}
        <AnimatePresence>
          {user && !(isVideoPlayerMode && isCollapsed) && (
            <MobileNavActionButton
              navColors={navColors}
              router={router}
              />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced safe area spacer - only when not in video mode */}
      {!isVideoPlayerMode && (
        <div 
          className="relative"
          style={{ height: 'env(safe-area-inset-bottom)' }}
        >
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, ${navColors.background}20, transparent)`
            }}
          />
        </div>
      )}
    </motion.div>
  );
}