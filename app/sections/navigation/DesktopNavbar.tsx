'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useNavigationContext } from '@/app/providers/navigation-provider';
import { UserProfileDropdown } from './UserProfileDropdown';
import { ThemeToggle } from '../../components/theme/theme-toggle';
import DesktopNavbarMain from './DesktopNavbarMain';

const navbarVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      mass: 0.8
    }
  }
};

const logoVariants = {
  idle: { scale: 1, rotateY: 0 },
  hover: { 
    scale: 1.05, 
    rotateY: 5,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

export function DesktopNavbar() {
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { colors, mounted, getColors } = useLayoutTheme();
  const {
    isNavigating,
    setIsNavigating,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useNavigationContext();

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname, setIsMobileMenuOpen]);

  const handleNavigation = useCallback(() => {
    setIsNavigating(true);
    // Reset after a short delay
    setTimeout(() => setIsNavigating(false), 300);
  }, [setIsNavigating]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [signOut, router]);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const navbarColors = getColors('navbar');

  return (
    <>
      <motion.nav
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
        className="sticky top-0 z-50 w-full border-b backdrop-blur-xl"
        style={{
          backgroundColor: `${navbarColors.background}f8`,
          borderColor: navbarColors.border,
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)'
        }}
      >
        {/* Gradient overlay for depth */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, ${navbarColors.background}00, ${navbarColors.background}20)`
          }}
        />

        <div className="container relative flex h-16 max-w-screen-2xl items-center px-6">
          {/* Enhanced Branding */}
          <motion.div 
            className="mr-8 flex"
            variants={logoVariants}
            initial="idle"
            whileHover="hover"
          >
            <Link
              href="/"
              onClick={handleNavigation}
              className="flex items-center space-x-3 group"
            >
              <motion.div 
                className="font-bold text-xl transition-colors duration-200"
                style={{ color: navbarColors.foreground }}
                whileHover={{ scale: 1.02 }}
              >
                Verify
              </motion.div>
            </Link>
          </motion.div>

          {/* Main Navigation - Remove router prop and let component use its own useRouter */}
          <DesktopNavbarMain
            //@ts-expect-error Ignore
            navbarColors={navbarColors}
            onNavigation={handleNavigation}
          />

          {/* Mobile Actions (for tablet breakpoint) */}
          <motion.div 
            className="flex-1 flex justify-end items-center space-x-2 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ThemeToggle variant="default" size="sm" />
            <UserProfileDropdown
              user={user}
              onLogout={handleLogout}
              variant="mobile"
            />
          </motion.div>
        </div>

        {/* Enhanced Loading Indicator */}
        <AnimatePresence>
          {(isNavigating || authLoading) && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              className="absolute bottom-0 left-0 h-0.5 w-full origin-left"
              style={{
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.primary}cc, ${colors.primary})`
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        {/* Subtle bottom glow */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.primary}40, transparent)`
          }}
        />
      </motion.nav>
    </>
  );
}