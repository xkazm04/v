import { ScrollTarget } from './types';

/**
 * Handles smooth scrolling to targets with perfect centering
 */
export function createScrollToTarget(
  scrollTargets: ScrollTarget[],
  isScrollingRef: React.MutableRefObject<boolean>,
  currentIndexRef: React.MutableRefObject<number>,
  setIsScrolling: (value: boolean) => void,
  setCurrentScrollIndex: (value: number) => void,
  setShowScrollHint: (value: boolean) => void,
  setActiveMilestoneId: (value: string | null) => void,
  setActiveEventId: (value: string | null) => void
) {
  return (targetIndex: number, customDuration?: number) => {
    if (targetIndex < 0 || targetIndex >= scrollTargets.length) return;

    const target = scrollTargets[targetIndex];
    
    isScrollingRef.current = true;
    currentIndexRef.current = targetIndex;
    setIsScrolling(true);
    setCurrentScrollIndex(targetIndex);
    setShowScrollHint(false);

    // Set active states
    if (target.type === 'hero') {
      setActiveMilestoneId(null);
      setActiveEventId(null);
    } else if (target.type === 'milestone') {
      setActiveMilestoneId(target.id);
      setActiveEventId(null);
    } else {
      setActiveEventId(target.id);
      setActiveMilestoneId(target.milestoneId || null);
    }

    // Use native scrollIntoView for perfect centering
    target.element.scrollIntoView({
      behavior: 'smooth',
      block: 'center', // This ensures perfect centering!
      inline: 'center' // Also center horizontally if needed
    });

    // Reset scrolling state after animation
    setTimeout(() => {
      isScrollingRef.current = false;
      setIsScrolling(false);
    }, 1000); // Give enough time for smooth scroll to complete
  };
}

/**
 * Scrolls to target by ID with improved targeting
 */
export function createScrollToTargetById(scrollTargets: ScrollTarget[]) {
  return (targetId: string, smooth: boolean = true) => {
    const target = scrollTargets.find(t => t.id === targetId);
    if (!target) {
      console.warn(`Target not found: ${targetId}`);
      return;
    }

    // Use scrollIntoView for perfect centering
    target.element.scrollIntoView({
      behavior: smooth ? 'smooth' : 'instant',
      block: 'center', // Always center vertically
      inline: 'center' // Also center horizontally if needed
    });
  };
}

/**
 * Creates navigation functions for milestone/event scrolling
 */
export function createNavigationFunctions(
  scrollTargets: ScrollTarget[],
  scrollToTarget: (targetIndex: number) => void,
  currentIndexRef: React.MutableRefObject<number>
) {
  const scrollToNextMilestone = () => {
    const nextIndex = Math.min(scrollTargets.length - 1, currentIndexRef.current + 1);
    if (nextIndex !== currentIndexRef.current) {
      scrollToTarget(nextIndex);
    }
  };

  const scrollToPreviousMilestone = () => {
    const prevIndex = Math.max(0, currentIndexRef.current - 1);
    if (prevIndex !== currentIndexRef.current) {
      scrollToTarget(prevIndex);
    }
  };

  const scrollToTop = () => {
    scrollToTarget(0);
  };

  const scrollToMilestone = (milestoneId: string) => {
    const targetIndex = scrollTargets.findIndex(t => t.id === milestoneId && t.type === 'milestone');
    if (targetIndex !== -1) {
      scrollToTarget(targetIndex);
    }
  };

  const scrollToEvent = (eventId: string, milestoneId: string) => {
    const targetIndex = scrollTargets.findIndex(t => t.id === eventId && t.type === 'event');
    if (targetIndex !== -1) {
      scrollToTarget(targetIndex);
    }
  };

  return {
    scrollToNextMilestone,
    scrollToPreviousMilestone,
    scrollToTop,
    scrollToMilestone,
    scrollToEvent
  };
}