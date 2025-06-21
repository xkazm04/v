import { MotionValue } from 'framer-motion';
import { Milestone, Timeline } from '../../types/timeline';

export interface ScrollTarget {
  id: string;
  type: 'milestone' | 'event' | 'hero';
  element: HTMLElement;
  milestoneId?: string;
}

export interface ScrollState {
  activeEventId: string | null;
  activeMilestoneId: string | null;
  currentScrollIndex: number;
  isScrolling: boolean;
  showScrollHint: boolean;
}

export interface UseTimelineScrollReturn {
  // State
  activeEventId: string | null;
  activeMilestoneId: string | null;
  currentScrollIndex: number;
  scrollTargets: ScrollTarget[];
  isScrolling: boolean;
  showScrollHint: boolean;
  
  // Scroll progress
  scrollYProgress: MotionValue<number>;
  smoothScrollProgress: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  
  // Navigation methods
  scrollToNextMilestone: () => void;
  scrollToPreviousMilestone: () => void;
  scrollToMilestone: (id: string) => void;
  scrollToEvent: (eventId: string, milestoneId: string) => void;
  scrollToTop: () => void;
  
  // Handlers
  setActiveEventId: (id: string | null) => void;
  setActiveMilestoneId: (id: string | null) => void;
  handleNavigateToMilestone: (milestoneId: string) => void;
  handleNavigateToEvent: (eventId: string, milestoneId: string) => void;
  
  // Utility
  scrollToElement: (elementId: string) => void;
}

export interface ScrollTargetBuilder {
  buildScrollTargets: (milestones: Milestone[]) => ScrollTarget[];
}

export interface ScrollNavigation {
  scrollToTarget: (targetIndex: number, customDuration?: number) => void;
  scrollToTargetById: (targetId: string, smooth?: boolean) => void;
}