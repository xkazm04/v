'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

export function useSmoothNavigation() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const navigate = useCallback(
    async (url: string, options?: { replace?: boolean }) => {
      setIsNavigating(true);
      
      try {
        // Add a small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 150));
        
        if (options?.replace) {
          router.replace(url);
        } else {
          router.push(url);
        }
      } finally {
        // Reset after navigation
        setTimeout(() => setIsNavigating(false), 300);
      }
    },
    [router]
  );

  return { navigate, isNavigating };
}