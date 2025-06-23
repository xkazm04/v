import { ScrollTarget } from './types';

/**
 * Creates an optimized wheel event handler for desktop navigation
 */
export function createWheelHandler(
  isDesktop: boolean,
  scrollTargets: ScrollTarget[],
  isScrollingRef: React.MutableRefObject<boolean>,
  currentIndexRef: React.MutableRefObject<number>,
  scrollToTarget: (targetIndex: number) => void,
  containerRef: React.RefObject<HTMLDivElement>
) {
  if (!isDesktop || scrollTargets.length === 0) return;

  let wheelAccumulation = 0;
  let lastDirection = 0;
  let debounceTimer: NodeJS.Timeout | null = null;

  const handleWheel = (e: WheelEvent) => {
    // Prevent default scrolling
    e.preventDefault();
    e.stopPropagation();
    
    // Don't handle if already scrolling
    if (isScrollingRef.current) return;
    
    const direction = e.deltaY > 0 ? 1 : -1;
    const wheelVelocity = Math.abs(e.deltaY);
    
    // Reset accumulation if direction changed
    if (direction !== lastDirection) {
      wheelAccumulation = 0;
    }
    
    wheelAccumulation += wheelVelocity;
    lastDirection = direction;
    
    const threshold = 50;
    
    if (wheelAccumulation < threshold) return;
    
    // Clear any existing debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Debounce rapid wheel events
    debounceTimer = setTimeout(() => {
      wheelAccumulation = 0;
      
      const newIndex = Math.max(0, Math.min(scrollTargets.length - 1, currentIndexRef.current + direction));
      
      if (newIndex !== currentIndexRef.current) {
        scrollToTarget(newIndex);
      }
      
      debounceTimer = null;
    }, 16); // ~60fps debouncing
  };

  const container = containerRef.current;
  if (container) {
    // Use passive: false to allow preventDefault
    container.addEventListener('wheel', handleWheel, { 
      passive: false,
      capture: true // Capture phase to handle before other listeners
    });
    
    return () => {
      container.removeEventListener('wheel', handleWheel, true);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }
}