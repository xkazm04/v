'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationContextType {
  // Navigation state
  activeTab: string;
  isNavigating: boolean;
  
  // Navigation actions
  setActiveTab: (tab: string) => void;
  setIsNavigating: (navigating: boolean) => void;
  navigateTo: (href: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationProvider');
  }
  return context;
}

// Critical routes to prefetch
const CRITICAL_ROUTES = ['/reel', '/upload'];

interface NavigationProviderProps {
  children: ReactNode;
}

// Helper function to find closest link element
function findClosestLink(element: Element | null): HTMLAnchorElement | null {
  let current = element;
  while (current && current !== document.body) {
    if (current.tagName === 'A' && current.hasAttribute('href')) {
      return current as HTMLAnchorElement;
    }
    current = current.parentElement;
  }
  return null;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Navigation state
  const [activeTab, setActiveTab] = useState('home');
  const [isNavigating, setIsNavigating] = useState(false);

  // Update active tab based on pathname
  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const currentTab = pathSegments[0] || 'home';
    setActiveTab(currentTab);
  }, [pathname]);

  // Simple navigation with brief loading state
  const navigateTo = useCallback((href: string) => {
    setIsNavigating(true);
    router.push(href);
    
    // Quick reset
    setTimeout(() => setIsNavigating(false), 200);
  }, [router]);

  // Fixed hover prefetching with better element handling
  useEffect(() => {
    const handleMouseEnter = (event: Event) => {
      const target = event.target;
      
      // Check if target is an Element
      if (!target || !(target instanceof Element)) return;
      
      // Find closest link using our helper function
      const link = findClosestLink(target);
      
      if (link?.href && link.href.startsWith(window.location.origin)) {
        try {
          const href = new URL(link.href).pathname;
          if (href !== pathname) {
            router.prefetch(href);
          }
        } catch (error) {
          // Ignore invalid URLs
        }
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter, { 
      capture: true, 
      passive: true 
    });
    
    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
    };
  }, [pathname, router]);

  // Prefetch critical routes on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      CRITICAL_ROUTES.forEach(route => {
        if (route !== pathname) {
          router.prefetch(route);
        }
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [pathname, router]);

  // Context value
  const value: NavigationContextType = {
    // State
    activeTab,
    isNavigating,
    
    // Actions
    setActiveTab,
    setIsNavigating,
    navigateTo,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}