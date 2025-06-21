import { ScrollTarget } from './types';

/**
 * Creates an enhanced intersection observer for precise target detection
 */
export function createIntersectionObserver(
  scrollTargets: ScrollTarget[],
  isScrollingRef: React.MutableRefObject<boolean>,
  currentIndexRef: React.MutableRefObject<number>,
  setActiveEventId: (value: string | null) => void,
  setActiveMilestoneId: (value: string | null) => void,
  setCurrentScrollIndex: (value: number) => void
) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (isScrollingRef.current) return;

      // Find the element closest to the center of the viewport
      const viewportCenter = window.innerHeight / 2;
      let closestElement: { target: Element; distance: number } | null = null;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect;
          const elementCenter = rect.top + rect.height / 2;
          const distance = Math.abs(elementCenter - viewportCenter);

          if (!closestElement || distance < closestElement.distance) {
            closestElement = { target: entry.target, distance };
          }
        }
      });

      if (closestElement) {
        const element = closestElement.target as HTMLElement;
        const milestoneId = element.getAttribute('data-milestone-id');
        const eventId = element.getAttribute('data-event-id');

        if (milestoneId) {
          setActiveMilestoneId(milestoneId);
          const targetIndex = scrollTargets.findIndex(t => t.id === milestoneId && t.type === 'milestone');
          if (targetIndex !== -1) {
            currentIndexRef.current = targetIndex;
            setCurrentScrollIndex(targetIndex);
          }
        } else if (eventId) {
          setActiveEventId(eventId);
          const targetIndex = scrollTargets.findIndex(t => t.id === eventId && t.type === 'event');
          if (targetIndex !== -1) {
            currentIndexRef.current = targetIndex;
            setCurrentScrollIndex(targetIndex);
          }
        }
      }
    },
    {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Only consider elements in center 20% of viewport
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    }
  );

  return observer;
}

/**
 * Sets up intersection observer with automatic cleanup
 */
export function setupIntersectionObserver(
  scrollTargets: ScrollTarget[],
  isScrollingRef: React.MutableRefObject<boolean>,
  currentIndexRef: React.MutableRefObject<number>,
  setActiveEventId: (value: string | null) => void,
  setActiveMilestoneId: (value: string | null) => void,
  setCurrentScrollIndex: (value: number) => void
) {
  if (scrollTargets.length === 0) return;

  const observer = createIntersectionObserver(
    scrollTargets,
    isScrollingRef,
    currentIndexRef,
    setActiveEventId,
    setActiveMilestoneId,
    setCurrentScrollIndex
  );

  // Observe all elements
  scrollTargets.forEach(target => {
    observer.observe(target.element);
  });

  return () => observer.disconnect();
}