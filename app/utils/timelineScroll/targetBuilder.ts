import { Milestone } from '../../types/timeline';
import { ScrollTarget } from './types';

/**
 * Builds scroll targets from DOM elements
 */
export function buildScrollTargets(sortedMilestones: Milestone[]): ScrollTarget[] {
  const targets: ScrollTarget[] = [];
  
  // Add hero section
  const heroElement = document.querySelector('[data-scroll-target="hero"]') as HTMLElement;
  if (heroElement) {
    targets.push({
      id: 'hero',
      type: 'hero',
      element: heroElement
    });
  }
  
  sortedMilestones.forEach(milestone => {
    const milestoneElement = document.querySelector(`[data-milestone-id="${milestone.id}"]`) as HTMLElement;
    if (milestoneElement) {
      targets.push({
        id: milestone.id,
        type: 'milestone',
        element: milestoneElement
      });

      // Add events for this milestone
      milestone.events.forEach(event => {
        const eventElement = document.querySelector(`[data-event-id="${event.id}"]`) as HTMLElement;
        if (eventElement) {
          targets.push({
            id: event.id,
            type: 'event',
            element: eventElement,
            milestoneId: milestone.id
          });
        }
      });
    }
  });

  return targets;
}

/**
 * Updates scroll targets with retry mechanism
 */
export function createTargetUpdater(
  buildTargets: () => ScrollTarget[],
  setScrollTargets: (targets: ScrollTarget[]) => void
) {
  return () => {
    const newTargets = buildTargets();
    setScrollTargets(newTargets);
  };
}

/**
 * Sets up target update timers and resize handler
 */
export function setupTargetUpdates(updateTargets: () => void) {
  const timers = [
    setTimeout(updateTargets, 100),
    setTimeout(updateTargets, 500),
    setTimeout(updateTargets, 1500)
  ];
  
  let resizeTimeout: NodeJS.Timeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateTargets, 100);
  };
  
  window.addEventListener('resize', handleResize, { passive: true });
  
  return () => {
    timers.forEach(clearTimeout);
    clearTimeout(resizeTimeout);
    window.removeEventListener('resize', handleResize);
  };
}