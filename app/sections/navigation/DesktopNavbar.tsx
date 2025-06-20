'use client';
import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useNavigationContext } from '@/app/providers/navigation-provider';
import { ThemeToggle } from '../../components/theme/theme-toggle';
import DesktopNavbarMain from './DesktopNavbarMain';
import Image from 'next/image';
import Link from 'next/link';
import TitleLogo from '@/app/components/icons/logo_title';

const navbarVariants: Variants = {
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

export function DesktopNavbar() {
  const pathname = usePathname();
  const { colors, mounted, getColors, isDark } = useLayoutTheme();
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
        <Image
          src={`
            ${isDark ? '/background/header_dark.png' : '/background/header_vintage.png'}
            `}
          alt="vaai header background"
          fill
          objectFit='cover'
          className=""
        />
          <Link href="/">
            <div className='absolute right-0 opacity-80'>
              <TitleLogo 
                height={70} 
                color={`${isDark ? 'white' : colors.vintage.ink}`} 
                />
            </div>
          </Link>
        <div className="container relative flex h-16 max-w-screen-2xl items-center px-6">
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
          </motion.div>
        </div>

        {/* Enhanced Loading Indicator */}
        <AnimatePresence>
          {(isNavigating) && (
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