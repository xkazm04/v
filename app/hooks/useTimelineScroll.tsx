'use client'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import { useViewport } from './useViewport';
import { Timeline } from '../types/timeline';
import {
  ScrollTarget,
  UseTimelineScrollReturn,
  buildScrollTargets,
  createTargetUpdater,
  setupTargetUpdates,
  createScrollToTarget,
  createScrollToTargetById,
  createNavigationFunctions,
  setupIntersectionObserver,
  createWheelHandler
} from '../utils/timelineScroll';

export function useTimelineScroll(
  containerRef: React.RefObject<HTMLDivElement>,
  timeline: Timeline
): UseTimelineScrollReturn {
  const { isDesktop } = useViewport();
  
  const milestones = timeline?.milestones || [];
  
  // State management
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const [scrollTargets, setScrollTargets] = useState<ScrollTarget[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const isScrollingRef = useRef(false);
  const currentIndexRef = useRef(0);

  const sortedMilestones = useMemo(() => 
    [...milestones].sort((a, b) => a.order - b.order), 
    [milestones]
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,   
    damping: 25,    
    restDelta: 0.001 
  });

  // Hide scroll hint after delay
  useEffect(() => {
    const hideHintTimer = setTimeout(() => setShowScrollHint(false), 5000);
    return () => clearTimeout(hideHintTimer);
  }, []);

  // Build scroll targets callback
  const buildTargetsCallback = useCallback(() => 
    buildScrollTargets(sortedMilestones), 
    [sortedMilestones]
  );

  // Update targets with retry mechanism
  useEffect(() => {
    const updateTargets = createTargetUpdater(buildTargetsCallback, setScrollTargets);
    return setupTargetUpdates(updateTargets);
  }, [buildTargetsCallback]);

  // Create scroll navigation functions
  const scrollToTarget = useCallback(
    createScrollToTarget(
      scrollTargets,
      isScrollingRef,
      currentIndexRef,
      setIsScrolling,
      setCurrentScrollIndex,
      setShowScrollHint,
      setActiveMilestoneId,
      setActiveEventId
    ),
    [scrollTargets]
  );

  const scrollToTargetById = useCallback(
    createScrollToTargetById(scrollTargets),
    [scrollTargets]
  );

  // Create navigation functions
  const navigationFunctions = useMemo(() => 
    createNavigationFunctions(scrollTargets, scrollToTarget, currentIndexRef),
    [scrollTargets, scrollToTarget]
  );

  // Set up wheel handler for desktop
  useEffect(() => {
    return createWheelHandler(
      isDesktop,
      scrollTargets,
      isScrollingRef,
      currentIndexRef,
      scrollToTarget,
      containerRef
    );
  }, [isDesktop, scrollTargets, scrollToTarget, containerRef]);

  // Set up intersection observer
  useEffect(() => {
    return setupIntersectionObserver(
      scrollTargets,
      isScrollingRef,
      currentIndexRef,
      setActiveEventId,
      setActiveMilestoneId,
      setCurrentScrollIndex
    );
  }, [scrollTargets]);

  // Handler functions
  const handleNavigateToMilestone = useCallback((milestoneId: string) => {
    navigationFunctions.scrollToMilestone(milestoneId);
  }, [navigationFunctions]);

  const handleNavigateToEvent = useCallback((eventId: string, milestoneId: string) => {
    navigationFunctions.scrollToEvent(eventId, milestoneId);
  }, [navigationFunctions]);

  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, []);

  return {
    activeEventId,
    activeMilestoneId,
    currentScrollIndex,
    scrollTargets,
    isScrolling,
    showScrollHint,
    
    scrollYProgress,
    smoothScrollProgress,
    scrollProgress: smoothScrollProgress,
    
    scrollToNextMilestone: navigationFunctions.scrollToNextMilestone,
    scrollToPreviousMilestone: navigationFunctions.scrollToPreviousMilestone,
    scrollToMilestone: navigationFunctions.scrollToMilestone,
    scrollToEvent: navigationFunctions.scrollToEvent,
    scrollToTop: navigationFunctions.scrollToTop,
    
    setActiveEventId,
    setActiveMilestoneId,
    handleNavigateToMilestone,
    handleNavigateToEvent,
    
    scrollToElement
  };
}