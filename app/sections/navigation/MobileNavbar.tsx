'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Home, Newspaper, Film, Plus, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useNavigationContext } from '@/app/providers/navigation-provider';
import { useAuth } from '@/app/hooks/useAuth';
import { useState, useCallback } from 'react';
import { containerVariants, fabVariants } from '@/app/components/animations/variants/mobileNavVariants';
import MobileNavbarItem from './MobileNavbarItem';

interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  isSpecial?: boolean;
}

const TAB_ITEMS: TabItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    href: '/'
  },
  {
    id: 'news',
    label: 'News',
    icon: Newspaper,
    href: '/news'
  },
  {
    id: 'reel',
    label: 'Reel',
    icon: Film,
    href: '/reel'
  }
];



export function MobileNavbar() {
  const router = useRouter();
  const { colors, isDark, mounted } = useLayoutTheme();
  const { activeTab, setActiveTab, setIsNavigating } = useNavigationContext();
  const { user } = useAuth();
  const [isPressed, setIsPressed] = useState<string | null>(null);
  const [fabPressed, setFabPressed] = useState(false);

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

  const handleFabPress = useCallback(() => {
    setFabPressed(true);
    
    if ('vibrate' in navigator) {
      navigator.vibrate(15);
    }
    
    router.push('/upload');
    
    setTimeout(() => setFabPressed(false), 200);
  }, [router]);

  if (!mounted) {
    return null;
  }

  // Enhanced color scheme with better contrast and modern feel
  const navColors = {
    background: isDark 
      ? 'rgba(8, 16, 32, 0.95)' 
      : 'rgba(255, 255, 255, 0.95)',
    border: isDark 
      ? 'rgba(71, 85, 105, 0.15)' 
      : 'rgba(226, 232, 240, 0.25)',
    inactive: isDark 
      ? 'rgba(148, 163, 184, 0.65)' 
      : 'rgba(100, 116, 139, 0.65)',
    active: colors.primary,
    glow: `${colors.primary}20`,
    shadow: isDark 
      ? 'rgba(0, 0, 0, 0.6)' 
      : 'rgba(0, 0, 0, 0.08)',
    fabShadow: `0 8px 32px ${colors.primary}40, 0 4px 16px ${colors.primary}20`
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
      }}
    >
      {/* Enhanced main navbar container */}
      <motion.div 
        className="mx-3 mb-3 rounded-3xl border backdrop-blur-2xl relative overflow-hidden"
        style={{
          backgroundColor: navColors.background,
          borderColor: navColors.border,
          boxShadow: `0 12px 40px ${navColors.shadow}, 0 0 0 0.5px ${navColors.border}`,
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)'
        }}
      >
        {/* Animated top highlight with shimmer effect */}
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

        {/* Subtle background pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${colors.primary} 1px, transparent 1px), radial-gradient(circle at 80% 50%, ${colors.primary} 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Enhanced tab items container */}
        <div className="flex items-center justify-around px-1 py-2 relative z-10">
          {TAB_ITEMS.map((item) => (
            <MobileNavbarItem
              key={item.id}
              //@ts-expect-error Ignore
              item={item}
              isActive={activeTab === item.id}
              isPressed={isPressed === item.id}
              navColors={navColors}
              onTabPress={handleTabPress}
              onPressStart={handlePressStart}
              onPressEnd={handlePressEnd}
            />
          ))}
        </div>

        {/* Enhanced floating action button */}
        {user && (
          <motion.button
            variants={fabVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            onTouchStart={() => setFabPressed(true)}
            onTouchEnd={() => setFabPressed(false)}
            onClick={handleFabPress}
            className="absolute -top-8 right-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              boxShadow: navColors.fabShadow
            }}
            aria-label="Create new content"
          >
            {/* FAB background gradient */}
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`
              }}
            />
            
            {/* FAB press effect */}
            <AnimatePresence>
              {fabPressed && (
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                />
              )}
            </AnimatePresence>

            {/* FAB icon with sparkle effect */}
            <motion.div
              className="relative z-10 flex items-center justify-center"
              animate={{
                rotate: fabPressed ? 45 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="h-6 w-6" strokeWidth={2.5} />
              
              {/* Sparkle indicator for new content */}
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Sparkles className="h-3 w-3" />
              </motion.div>
            </motion.div>

            {/* FAB ripple effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-white"
              animate={{
                scale: fabPressed ? [1, 1.5] : 1,
                opacity: fabPressed ? [0.5, 0] : 0
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        )}
      </motion.div>

      {/* Enhanced safe area spacer with gradient fade */}
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
    </motion.div>
  );
}