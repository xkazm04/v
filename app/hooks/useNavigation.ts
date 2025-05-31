import { useState, useCallback, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export const useNavigation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = useCallback(() => {
    setIsLoading(true);
    setIsMobileMenuOpen(false);
    // Reset loading state after navigation
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
  }, [isSearchOpen]);

  const isActivePath = useCallback((href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  }, [pathname]);

  const closeAllMenus = useCallback(() => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  }, []);

  // Close menus on route change
  useEffect(() => {
    closeAllMenus();
  }, [pathname, closeAllMenus]);

  // Close menus on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllMenus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeAllMenus]);

  return {
    isLoading,
    isSearchOpen,
    isMobileMenuOpen,
    pathname,
    handleNavigation,
    toggleSearch,
    toggleMobileMenu,
    isActivePath,
    closeAllMenus
  };
};