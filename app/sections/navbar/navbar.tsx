'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { ThemeToggle } from '@/app/components/theme/theme-toggle';
import { cn } from '@/app/lib/utils';
import { Menu, Upload, Bell, User} from 'lucide-react';
import { useNavigation } from '@/app/hooks/useNavigation';
import NavMobileOverlay from './NavMobileOverlay';
import { navAnim } from '@/app/components/animations/variants/navVariants';
import { NAVIGATION_CONFIG } from '@/app/config/navItems';
import { renderActionButton } from './NavActionButton';


export function Navbar() {
  const {
    isLoading,
    isMobileMenuOpen,
    pathname,
    handleNavigation,
    toggleMobileMenu,
    isActivePath
  } = useNavigation();

  useEffect(() => {
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Action button configurations
  const actionButtons = [
    {
      key: 'upload',
      icon: Upload,
      label: 'Upload',
      onClick: () => console.log('Upload clicked'),
      showOnDesktop: true,
      showOnMobile: false,
      badge: null
    },
    {
      key: 'notifications',
      icon: Bell,
      label: 'Notifications',
      onClick: () => console.log('Notifications clicked'),
      showOnDesktop: true,
      showOnMobile: false,
      badge: 3 // Example notification count
    },
    {
      key: 'user',
      icon: User,
      label: 'User Profile',
      onClick: () => console.log('User clicked'),
      showOnDesktop: true,
      showOnMobile: true,
      badge: null,
      className: 'rounded-full'
    }
  ];

  const renderNavLink = (item: typeof NAVIGATION_CONFIG.mainNav[0], isMobile = false) => {
    const isActive = isActivePath(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={handleNavigation}
        className={cn(
          'relative group transition-all duration-200',
          isMobile
            ? 'flex flex-col px-4 py-3 text-base font-medium hover:bg-accent/50 rounded-lg'
            : 'text-sm font-medium hover:text-primary px-1 py-2',
          isActive && !isMobile ? 'text-primary' : 'text-foreground hover:text-primary'
        )}
      >
        <span className={cn(
          'transition-colors',
          isMobile && 'text-foreground group-hover:text-accent-foreground'
        )}>
          {item.label}
        </span>

        {isMobile && item.description && (
          <span className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {item.description}
          </span>
        )}

        {!isMobile && isActive && (
          <motion.div
            layoutId="navbar-indicator"
            className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}

        {!isMobile && (
          <motion.div
            className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100"
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
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80"
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
            <div className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
              TBD title
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex-1 hidden md:flex items-center justify-between">
          <nav className="flex items-center space-x-8">
            {NAVIGATION_CONFIG.mainNav.map(item => renderNavLink(item))}
          </nav>

          <div className="flex items-center space-x-2">
            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              {actionButtons.map(config => renderActionButton(config))}
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex-1 flex justify-end items-center space-x-2 md:hidden">
          {actionButtons
            .filter(config => config.showOnMobile)
            .slice(0, 2) // Limit mobile buttons
            .map(config => renderActionButton(config, false))}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <NavMobileOverlay 
            toggleMobileMenu={toggleMobileMenu}
            actionButtons={actionButtons}
            renderNavLink={renderNavLink}
            //@ts-expect-error Ignore
            renderActionButton={renderActionButton}
          />
          )}
      </AnimatePresence>

      {/* Loading Indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            variants={navAnim.loading}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-primary via-primary/80 to-primary origin-left"
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}