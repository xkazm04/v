'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { ThemeToggle } from '@/app/components/theme/theme-toggle';
import { SearchBar } from '@/app/components/search/SearchBar';
import { cn } from '@/app/lib/utils';
import { Menu, Upload, Bell, User, LogOut, Settings } from 'lucide-react';
import { useNavigation } from '@/app/hooks/useNavigation';
import { useAuth } from '@/app/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import NavMobileOverlay from './NavMobileOverlay';
import { navAnim } from '@/app/components/animations/variants/navVariants';
import { NAVIGATION_CONFIG } from '@/app/config/navItems';
import { renderActionButton } from './NavActionButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/components/ui/alert-dialog';
import { AuthButtons } from '@/app/components/auth/AuthButtons';
import { Loader2 } from 'lucide-react';

export function Navbar() {
  const { 
    isLoading, 
    isSearchOpen, 
    toggleSearch, 
    isMobileMenuOpen, 
    toggleMobileMenu,
    handleNavigation 
  } = useNavigation();
  
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [logoutLoading, setLogoutLoading] = useState(false);

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

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleSearchResultSelect = (result: any, type: 'news' | 'video') => {
    if (type === 'news') {
      router.push(`/research/${result.id}`);
    } else if (type === 'video') {
      router.push(`/watch?v=${result.id}`);
    }
  };

  // Action button configurations - only show for authenticated users
  const actionButtons = user ? [
    {
      key: 'upload',
      icon: Upload,
      label: 'Upload',
      onClick: () => router.push('/upload'),
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
    }
  ] : [];

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

  // User profile dropdown component
  const UserProfileDropdown = () => {
    if (!user) {
      return <AuthButtons variant="ghost" size="sm" />;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <User className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem 
                onSelect={(e) => e.preventDefault()}
                className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign Out Confirmation</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to sign out? You&apos;ll need to sign in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {logoutLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Signing Out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
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
            <div className="font-bold pl-2 text-xl text-foreground group-hover:text-primary transition-colors">
              Verify
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
            <SearchBar 
              onResultSelect={handleSearchResultSelect}
              placeholder="Search news and videos..."
            />
          </div>

          <div className="flex items-center space-x-2">
            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              {actionButtons.map(config => renderActionButton(config))}
              <ThemeToggle />
              <UserProfileDropdown />
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
          <UserProfileDropdown />
        </div>

        {/* Mobile Menu Search */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={navAnim.search.mobile}
              className="absolute top-full left-0 right-0 bg-background border-b border-border p-4 md:hidden"
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
            actionButtons={actionButtons}
            renderNavLink={renderNavLink}
            //@ts-expect-error Ignore
            renderActionButton={renderActionButton}
          />
        )}
      </AnimatePresence>

      {/* Loading Indicator */}
      <AnimatePresence>
        {(isLoading || authLoading) && (
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