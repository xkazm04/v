import { ScrollTarget } from './types';

/**
 * Creates an enhanced wheel event handler for desktop navigation
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

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    
    if (isScrollingRef.current) return;
    
    const direction = e.deltaY > 0 ? 1 : -1;
    const wheelVelocity = Math.abs(e.deltaY);
    
    if (direction !== lastDirection) {
      wheelAccumulation = 0;
    }
    
    wheelAccumulation += wheelVelocity;
    lastDirection = direction;
    
    const threshold = 50;
    
    if (wheelAccumulation < threshold) return;
    
    wheelAccumulation = 0;
    
    const newIndex = Math.max(0, Math.min(scrollTargets.length - 1, currentIndexRef.current + direction));
    
    if (newIndex !== currentIndexRef.current) {
      scrollToTarget(newIndex);
    }
  };

  const container = containerRef.current;
  if (container) {
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }
}