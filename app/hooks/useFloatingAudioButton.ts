import { useEffect, useState, useCallback } from 'react';
import { useViewport } from './useViewport';

interface UseFloatingAudioButtonOptions {
  hasScrolled: boolean;
  timelineProgressVisible: boolean;
}

export function useFloatingAudioButton({
  hasScrolled,
  timelineProgressVisible
}: UseFloatingAudioButtonOptions) {
  const { isMobile, isTablet } = useViewport();
  const [isVisible, setIsVisible] = useState(false);

  // Determine visibility based on device and scroll state
  useEffect(() => {
    const shouldShow = 
      isMobile || // Always show on mobile
      isTablet || // Show on tablet
      (!hasScrolled && !timelineProgressVisible); // Show on desktop if timeline not visible

    setIsVisible(shouldShow);
  }, [isMobile, isTablet, hasScrolled, timelineProgressVisible]);

  // Hide button temporarily when user interacts with content
  const [isTemporarilyHidden, setIsTemporarilyHidden] = useState(false);

  const hideTemporarily = useCallback((duration: number = 3000) => {
    setIsTemporarilyHidden(true);
    const timer = setTimeout(() => {
      setIsTemporarilyHidden(false);
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  const finalVisibility = isVisible && !isTemporarilyHidden;

  return {
    isVisible: finalVisibility,
    hideTemporarily,
    isTemporarilyHidden
  };
}