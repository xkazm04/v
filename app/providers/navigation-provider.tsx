'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationContextType {
  // Mobile navigation state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // General navigation state
  isNavigating: boolean;
  setIsNavigating: (state: boolean) => void;
  
  // Search state
  isSearchOpen: boolean;
  setIsSearchOpen: (state: boolean) => void;
  
  // Mobile menu state (for desktop navbar)
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (state: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Determine active tab based on current path
  const getActiveTabFromPath = useCallback((path: string) => {
    if (path === '/') return 'home';
    if (path.startsWith('/news')) return 'news';
    if (path.startsWith('/reel')) return 'reel';
    return 'home'; // Default fallback
  }, []);

  const [activeTab, setActiveTab] = useState(() => getActiveTabFromPath(pathname));
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update active tab when pathname changes
  React.useEffect(() => {
    const newActiveTab = getActiveTabFromPath(pathname);
    if (newActiveTab !== activeTab) {
      setActiveTab(newActiveTab);
    }
  }, [pathname, activeTab, getActiveTabFromPath]);

  const value: NavigationContextType = {
    activeTab,
    setActiveTab,
    isNavigating,
    setIsNavigating,
    isSearchOpen,
    setIsSearchOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
}