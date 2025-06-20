'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { ThemeToggle } from '@/app/components/theme/theme-toggle';
import { SearchBar } from '@/app/components/search/SearchBar';
import { cn } from '@/app/lib/utils';
import { Menu } from 'lucide-react';
import { useNavigation } from '@/app/hooks/useNavigation';
import { usePathname, useRouter } from 'next/navigation';
import NavMobileOverlay from './NavMobileOverlay';
import { navAnim } from '@/app/components/animations/variants/navVariants';
import { NAVIGATION_CONFIG } from '@/app/config/navItems';
import { renderActionButton } from './NavActionButton';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import Image from 'next/image';

export function Navbar() {
  const {
    isLoading,
    isSearchOpen,
    toggleSearch,
    isMobileMenuOpen,
    toggleMobileMenu,
    handleNavigation
  } = useNavigation();

  const router = useRouter();
  const pathname = usePathname();
  const { colors, getColors, mounted } = useLayoutTheme();

  useEffect(() => {
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isActivePath = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };


  const handleSearchResultSelect = (result: any, type: 'news' | 'video') => {
    if (type === 'news') {
      router.push(`/research/${result.id}`);
    } else if (type === 'video') {
      router.push(`/watch?v=${result.id}`);
    }
  };


  const navbarColors = getColors('navbar');

  const renderNavLink = (item: typeof NAVIGATION_CONFIG.mainNav[number], isMobile = false) => {
    const isActive = isActivePath(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={handleNavigation}
        className={cn(
          'relative group transition-all duration-200',
          isMobile
            ? 'flex flex-col px-4 py-3 text-base font-medium rounded-lg'
            : 'text-sm font-medium px-1 py-2'
        )}
        style={{
          color: isActive && !isMobile 
            ? colors.primary 
            : navbarColors.foreground
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = navbarColors.muted || '';
          e.currentTarget.style.color = colors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = navbarColors.foreground || '';
        }}
      >
        <span className="transition-colors">
          {item.label}
        </span>

        {isMobile && item.description && (
          <span 
            className="text-xs mt-1 line-clamp-1"
            style={{ color: navbarColors.muted }}
          >
            {item.description}
          </span>
        )}

        {!isMobile && isActive && (
          <motion.div
            layoutId="navbar-indicator"
            className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full"
            style={{ backgroundColor: colors.primary }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}

        {!isMobile && (
          <motion.div
            className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full opacity-0 group-hover:opacity-100"
            style={{ backgroundColor: `${colors.primary}50` }}
            transition={{ duration: 0.2 }}
          />
        )}
      </Link>
    );
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full border-b backdrop-blur-xl"
      style={{
        backgroundColor: `${navbarColors.background}f0`,
        borderColor: navbarColors.border,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Mobile Menu Button */}
        <div className="mr-4 flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className={cn(
              'transition-transform duration-200',
              isMobileMenuOpen && 'rotate-90'
            )}
            style={{
              color: navbarColors.foreground
            }}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Branding */}
        <div className="mr-8 hidden md:flex">
          <Link
            href="/"
            onClick={handleNavigation}
            className="flex items-center space-x-2 group"
          >
            <div 
              className="font-bold pl-2 text-xl transition-colors"
              style={{
                color: navbarColors.foreground
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.primary;
              }}
              onMouseLeave={(e) => {
                 //@ts-expect-error Ignore
                e.currentTarget.style.color = navbarColors.foreground;
              }}
            >
              <Image
                src="/logos/logo_brush_black.png"
                alt="Logo"
                width={32}
                height={32}
                className="inline-block h-8 w-8 rounded-full"
                />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex-1 hidden md:flex items-center justify-between">
          <nav className="flex items-center space-x-8">
            {NAVIGATION_CONFIG.mainNav.map(item => renderNavLink(item))}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            {/* <SearchBar
              onResultSelect={handleSearchResultSelect}
              placeholder="Search news and videos..."
            /> */}
          </div>

          <div className="flex items-center space-x-2">
            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex-1 flex justify-end items-center space-x-2 md:hidden">
          <ThemeToggle />
        </div>

        {/* Mobile Menu Search */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={navAnim.search.mobile}
              className="absolute top-full left-0 right-0 border-b p-4 md:hidden"
              style={{
                backgroundColor: navbarColors.background,
                borderColor: navbarColors.border
              }}
            >
              <SearchBar
                onResultSelect={handleSearchResultSelect}
                placeholder="Search news and videos..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <NavMobileOverlay
            toggleMobileMenu={toggleMobileMenu}
            actionButtons={[]}
             //@ts-expect-error Ignore
            renderNavLink={renderNavLink} renderActionButton={renderActionButton}
          />
        )}
      </AnimatePresence>

      {/* Loading Indicator */}
      <AnimatePresence>
        {(isLoading) && (
          <motion.div
            variants={navAnim.loading}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute bottom-0 left-0 h-0.5 w-full origin-left"
            style={{
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.primary}cc, ${colors.primary})`
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}