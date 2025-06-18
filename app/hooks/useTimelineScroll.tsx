'use client'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useScroll, useSpring, animate, MotionValue } from 'framer-motion';
import { useViewport } from './useViewport';
import { Milestone } from '../types/timeline';

interface ScrollTarget {
  id: string;
  type: 'milestone' | 'event' | 'hero';
  offsetTop: number;
  milestoneId?: string;
}

interface UseTimelineScrollOptions {
  milestones: Milestone[];
  containerRef: React.RefObject<HTMLDivElement>;
}

interface UseTimelineScrollReturn {
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
  
  // Handlers
  setActiveEventId: (id: string | null) => void;
  setActiveMilestoneId: (id: string | null) => void;
  handleNavigateToMilestone: (milestoneId: string) => void;
  handleNavigateToEvent: (eventId: string, milestoneId: string) => void;
}

export function useTimelineScroll({ 
  milestones, 
  containerRef 
}: UseTimelineScrollOptions): UseTimelineScrollReturn {
  const { isDesktop } = useViewport();
  
  // State management
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const [scrollTargets, setScrollTargets] = useState<ScrollTarget[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // OPTIMIZED: Use refs to avoid stale closures and improve performance
  const isScrollingRef = useRef(false);
  const wheelTimeoutRef = useRef<NodeJS.Timeout>(null);
  const currentIndexRef = useRef(0);

  // Memoize sorted milestones for performance
  const sortedMilestones = useMemo(() => 
    [...milestones].sort((a, b) => a.order - b.order), 
    [milestones]
  );

  // ENHANCED: More responsive scroll setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // OPTIMIZED: Ultra-responsive spring settings for immediate feedback
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,   
    damping: 20,    
    restDelta: 0.0001 
  });

  // Hide scroll hint after user interaction
  useEffect(() => {
    const hideHintTimer = setTimeout(() => setShowScrollHint(false), 5000);
    return () => clearTimeout(hideHintTimer);
  }, []);

  // FIXED: Enhanced scroll targets building including hero section
  const buildScrollTargets = useCallback(() => {
    const targets: ScrollTarget[] = [];
    
    // ADDED: Hero section as first scroll target
    const heroElement = document.querySelector('[data-scroll-target="hero"]');
    if (heroElement) {
      const rect = heroElement.getBoundingClientRect();
      const offsetTop = window.pageYOffset + rect.top;
      
      targets.push({
        id: 'hero',
        type: 'hero',
        offsetTop: Math.max(0, offsetTop - 100) // Slight offset for better positioning
      });
    }
    
    sortedMilestones.forEach(milestone => {
      const milestoneElement = document.querySelector(`[data-milestone-id="${milestone.id}"]`);
      if (milestoneElement) {
        const rect = milestoneElement.getBoundingClientRect();
        const offsetTop = window.pageYOffset + rect.top;
        
        targets.push({
          id: milestone.id,
          type: 'milestone',
          offsetTop
        });

        // Add events as sub-targets
        milestone.events.forEach(event => {
          const eventElement = document.querySelector(`[data-event-id="${event.id}"]`);
          if (eventElement) {
            const eventRect = eventElement.getBoundingClientRect();
            const eventOffsetTop = window.pageYOffset + eventRect.top;
            
            targets.push({
              id: event.id,
              type: 'event',
              offsetTop: eventOffsetTop,
              milestoneId: milestone.id
            });
          }
        });
      }
    });

    return targets.sort((a, b) => a.offsetTop - b.offsetTop);
  }, [sortedMilestones]);

  // IMPROVED: Faster target updates
  useEffect(() => {
    const updateTargets = () => {
      const newTargets = buildScrollTargets();
      setScrollTargets(newTargets);
    };

    // More aggressive timing for better responsiveness
    const timers = [
      setTimeout(updateTargets, 50),
      setTimeout(updateTargets, 300),
      setTimeout(updateTargets, 1000)
    ];
    
    // Faster resize debouncing
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateTargets, 50); // Ultra-fast response
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [buildScrollTargets]);

  // ENHANCED: Ultra-smooth scroll with immediate response
  const scrollToTarget = useCallback((targetIndex: number, customDuration?: number) => {
    if (targetIndex < 0 || targetIndex >= scrollTargets.length) return;

    const target = scrollTargets[targetIndex];
    const offset = target.type === 'hero' ? 0 : window.innerHeight * 0.15; 
    const targetPosition = Math.max(0, target.offsetTop - offset);
    const currentPosition = window.pageYOffset;
    const distance = Math.abs(targetPosition - currentPosition);

    const baseDuration = customDuration || 0.5; 
    const dynamicDuration = Math.min(baseDuration + (distance / 3000), 1.0); 

    isScrollingRef.current = true;
    currentIndexRef.current = targetIndex;
    setIsScrolling(true);
    setCurrentScrollIndex(targetIndex);
    setShowScrollHint(false);

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

    animate(currentPosition, targetPosition, {
      duration: dynamicDuration,
      ease: [0.25, 0.1, 0.25, 1], 
      onUpdate: (value) => {
        window.scrollTo(0, value);
      },
      onComplete: () => {
        setTimeout(() => {
          isScrollingRef.current = false;
          setIsScrolling(false);
        }, 100);
      }
    });
  }, [scrollTargets]);

  useEffect(() => {
    if (!isDesktop || scrollTargets.length === 0) return;

    let wheelAccumulation = 0;
    let lastDirection = 0;
    let wheelVelocity = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrollingRef.current) return;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      wheelVelocity = Math.abs(e.deltaY);
      
      const threshold = wheelVelocity > 30 ? 40 : 60; 
      
      if (direction !== lastDirection) {
        wheelAccumulation = 0;
      }
      
      wheelAccumulation += Math.abs(e.deltaY);
      lastDirection = direction;
      
      if (wheelAccumulation < threshold) return;
      
      wheelAccumulation = 0;
      
      const newIndex = Math.max(0, Math.min(scrollTargets.length - 1, currentIndexRef.current + direction));
      
      if (newIndex !== currentIndexRef.current) {
        const customDuration = wheelVelocity > 80 ? 0.4 : 0.5;
        scrollToTarget(newIndex, customDuration);
      }

      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
      
      wheelTimeoutRef.current = setTimeout(() => {
        if (!isScrollingRef.current) {
          setIsScrolling(false);
        }
      }, 600); 
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel);
        if (wheelTimeoutRef.current) {
          clearTimeout(wheelTimeoutRef.current);
        }
      };
    }
  }, [isDesktop, scrollTargets, scrollToTarget, containerRef]);
  useEffect(() => {
    if (scrollTargets.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', 
      threshold: [0.5] 
    };

    const observer = new IntersectionObserver((entries) => {
      if (isScrollingRef.current) return;

      let bestEntry = null;
      let bestRatio = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
          bestEntry = entry;
          bestRatio = entry.intersectionRatio;
        }
      });

      if (bestEntry && bestRatio > 0.5) {
        const element = bestEntry.target as HTMLElement;
        const milestoneId = element.getAttribute('data-milestone-id');
        const eventId = element.getAttribute('data-event-id');
        const heroTarget = element.getAttribute('data-scroll-target');

        let targetId = milestoneId || eventId || heroTarget;
        if (targetId) {
          const targetIndex = scrollTargets.findIndex(t => t.id === targetId);
          if (targetIndex !== -1 && targetIndex !== currentIndexRef.current) {
            currentIndexRef.current = targetIndex;
            setCurrentScrollIndex(targetIndex);
            
            if (heroTarget === 'hero') {
              setActiveMilestoneId(null);
              setActiveEventId(null);
            } else if (eventId) {
              setActiveEventId(eventId);
              const parentMilestone = sortedMilestones.find(m => 
                m.events.some(e => e.id === eventId)
              );
              if (parentMilestone) {
                setActiveMilestoneId(parentMilestone.id);
              }
            } else if (milestoneId) {
              setActiveMilestoneId(milestoneId);
              setActiveEventId(null);
            }
          }
        }
      }
    }, observerOptions);
    
    const elements = document.querySelectorAll('[data-milestone-id], [data-event-id], [data-scroll-target="hero"]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [sortedMilestones, scrollTargets]);

  // Sync refs with state
  useEffect(() => {
    currentIndexRef.current = currentScrollIndex;
  }, [currentScrollIndex]);

  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);

  // Memoized navigation handlers
  const handleNavigateToMilestone = useCallback((milestoneId: string) => {
    const targetIndex = scrollTargets.findIndex(t => t.id === milestoneId && t.type === 'milestone');
    if (targetIndex !== -1) {
      scrollToTarget(targetIndex);
    }
  }, [scrollTargets, scrollToTarget]);

  const handleNavigateToEvent = useCallback((eventId: string, milestoneId: string) => {
    const targetIndex = scrollTargets.findIndex(t => t.id === eventId && t.type === 'event');
    if (targetIndex !== -1) {
      scrollToTarget(targetIndex);
    }
  }, [scrollTargets, scrollToTarget]);

  return {
    // State
    activeEventId,
    activeMilestoneId,
    currentScrollIndex,
    scrollTargets,
    isScrolling,
    showScrollHint,
    
    // Scroll progress
    scrollYProgress,
    smoothScrollProgress,
    
    // Handlers
    setActiveEventId,
    setActiveMilestoneId,
    handleNavigateToMilestone,
    handleNavigateToEvent,
  };
}