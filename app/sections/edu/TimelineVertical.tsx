'use client'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring, animate } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import TimelineHeader from './EduTimeline/TimelineHeader';
import TimelineMilestone from '../../components/timeline/TimelineMilestone/TimelineMilestone';
import TimelineProgressIndicator from './EduTimeline/TimelineProgressIndicator';
import TimelineBackground from './EduTimeline/TimelineBackground';
import TimelineVerticalLeft from './EduTimeline/TimelineVerticalLeft';
import TimelineVerticalRight from './EduTimeline/TimelineVerticalRight';
import { FloatingVerdictIcon } from '@/app/components/ui/Decorative/FloatingVerdictIcon';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';
import { Timeline } from './data/timeline';

// Import the Iraq War example data
import exampleData from './data/example.json';

interface ScrollTarget {
  id: string;
  type: 'milestone' | 'event';
  offsetTop: number;
  milestoneId?: string;
}

export default function TimelineVertical() {
  const { colors, isDark } = useLayoutTheme();
  const { isMobile, isTablet, isDesktop } = useViewport();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const [scrollTargets, setScrollTargets] = useState<ScrollTarget[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);

  // Convert example data to Timeline interface
  const timeline: Timeline = exampleData as Timeline;
  const sortedMilestones = useMemo(() => 
    [...timeline.milestones].sort((a, b) => a.order - b.order), 
    [timeline.milestones]
  );

  // Enhanced scroll setup with precise tracking
  const { scrollY, scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth spring-based scroll progress
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Enhanced scroll transforms
  const progressWidth = useTransform(smoothScrollProgress, [0, 1], ['0%', '100%']);
  const headerOpacity = useTransform(smoothScrollProgress, [0, 0.12, 0.18], [1, 0.8, 0]);
  const sideOpacity = useTransform(smoothScrollProgress, [0.08, 0.15, 0.9, 1], [0, 1, 1, 0.8]);

  // Build scroll targets with improved logic
  const buildScrollTargets = useCallback(() => {
    const targets: ScrollTarget[] = [];
    
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

  // Update scroll targets when content loads
  useEffect(() => {
    const updateTargets = () => {
      const newTargets = buildScrollTargets();
      setScrollTargets(newTargets);
    };

    // Wait for content to render
    const timer = setTimeout(updateTargets, 1000);
    
    // Update on resize
    const handleResize = () => {
      setTimeout(updateTargets, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [buildScrollTargets]);

  // Smooth scroll to target function
  const scrollToTarget = useCallback((targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= scrollTargets.length) return;

    const target = scrollTargets[targetIndex];
    const offset = window.innerHeight * 0.25; // 25% from top
    const targetPosition = Math.max(0, target.offsetTop - offset);

    setIsScrolling(true);
    setCurrentScrollIndex(targetIndex);

    // Update active states immediately
    if (target.type === 'milestone') {
      setActiveMilestoneId(target.id);
      setActiveEventId(null);
    } else {
      setActiveEventId(target.id);
      setActiveMilestoneId(target.milestoneId || null);
    }

    // Use framer-motion animate for smooth scrolling
    animate(window.pageYOffset, targetPosition, {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (value) => {
        window.scrollTo(0, value);
      },
      onComplete: () => {
        setTimeout(() => setIsScrolling(false), 200);
      }
    });
  }, [scrollTargets]);

  // Enhanced wheel event handler
  useEffect(() => {
    if (!isDesktop || scrollTargets.length === 0) return;

    let wheelTimeout: NodeJS.Timeout;
    let lastWheelTime = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const now = Date.now();
      const timeDelta = now - lastWheelTime;
      
      // Debounce wheel events
      if (timeDelta < 100 || isScrolling) return;
      
      lastWheelTime = now;
      clearTimeout(wheelTimeout);

      const direction = e.deltaY > 0 ? 1 : -1;
      const newIndex = Math.max(0, Math.min(scrollTargets.length - 1, currentScrollIndex + direction));
      
      if (newIndex !== currentScrollIndex) {
        scrollToTarget(newIndex);
      }

      // Reset scroll lock after delay
      wheelTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel);
        clearTimeout(wheelTimeout);
      };
    }
  }, [isDesktop, scrollTargets, currentScrollIndex, isScrolling, scrollToTarget]);

  // Intersection observer for natural scroll detection
  useEffect(() => {
    if (isScrolling || scrollTargets.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: [0.3, 0.7]
    };

    const observer = new IntersectionObserver((entries) => {
      if (isScrolling) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const element = entry.target as HTMLElement;
          const milestoneId = element.getAttribute('data-milestone-id');
          const eventId = element.getAttribute('data-event-id');

          let targetId = milestoneId || eventId;
          if (targetId) {
            const targetIndex = scrollTargets.findIndex(t => t.id === targetId);
            if (targetIndex !== -1 && targetIndex !== currentScrollIndex) {
              setCurrentScrollIndex(targetIndex);
              
              if (eventId) {
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
      });
    }, observerOptions);

    // Observe all milestone and event elements
    const elements = document.querySelectorAll('[data-milestone-id], [data-event-id]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [sortedMilestones, isScrolling, scrollTargets, currentScrollIndex]);

  // Navigation handlers
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

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative"
      style={{
        background: isDark
          ? 'linear-gradient(180deg, rgb(15, 23, 42) 0%, rgb(30, 41, 59) 100%)'
          : 'linear-gradient(180deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%)',
        color: colors.foreground
      }}
    >
      {/* Enhanced Background */}
      <TimelineBackground 
        scrollProgress={smoothScrollProgress.get()}
        isDark={isDark}
        colors={colors}
      />

      {/* Modular Left Side Panel */}
      {isDesktop && (
        <TimelineVerticalLeft
          sideOpacity={sideOpacity}
          leftSide={timeline.leftSide}
          colors={colors}
        />
      )}

      {/* Modular Right Side Panel */}
      {isDesktop && (
        <TimelineVerticalRight
          sideOpacity={sideOpacity}
          rightSide={timeline.rightSide}
          colors={colors}
        />
      )}

      {/* Enhanced Central Timeline Line */}
      <div className="fixed left-1/2 top-0 w-px h-full -translate-x-1/2 z-10 opacity-50">
        <div 
          className="w-full h-full"
          style={{ 
            background: isDark
              ? 'linear-gradient(180deg, transparent 0%, rgba(148, 163, 184, 0.2) 20%, rgba(148, 163, 184, 0.3) 50%, rgba(148, 163, 184, 0.2) 80%, transparent 100%)'
              : 'linear-gradient(180deg, transparent 0%, rgba(100, 116, 139, 0.15) 20%, rgba(100, 116, 139, 0.25) 50%, rgba(100, 116, 139, 0.15) 80%, transparent 100%)'
          }}
        />
        
        <motion.div
          className="absolute top-0 left-0 w-full origin-top"
          style={{
            height: progressWidth,
            background: `linear-gradient(180deg, ${colors.primary}60, ${colors.primary}80)`,
            boxShadow: `0 0 8px ${colors.primary}30`
          }}
        />
      </div>

      {/* Floating Icon */}
      {isDesktop && (
        <motion.div
          className="fixed top-[50%] left-8 z-20"
          style={{ opacity: headerOpacity }}
        >
          <FloatingVerdictIcon
            size="sm"
            confidence={85}
            showConfidenceRing={false}
            autoAnimate={true}
            delay={0.5}
          />
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        style={{ opacity: headerOpacity }}
        className="relative z-30"
      >
        <TimelineHeader timeline={timeline} />
      </motion.div>

      {/* Main Content */}
      <div className={`relative z-20 mx-auto px-4 pt-8 ${
        isDesktop ? 'max-w-4xl' : isMobile ? 'max-w-full' : 'max-w-3xl'
      }`}>
        {sortedMilestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ 
              delay: index * 0.15, 
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <div
              className="mb-12"
              data-milestone-id={milestone.id}
            >
              <TimelineMilestone
                milestone={milestone}
                index={index}
                activeEventId={activeEventId}
                activeMilestoneId={activeMilestoneId}
                onEventHover={setActiveEventId}
                onMilestoneHover={setActiveMilestoneId}
                scrollProgress={smoothScrollProgress}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Progress Indicator */}
      <TimelineProgressIndicator 
        scrollProgress={smoothScrollProgress}
        milestones={sortedMilestones}
        activeMilestoneId={activeMilestoneId}
        activeEventId={activeEventId}
        currentScrollIndex={currentScrollIndex}
        scrollTargets={scrollTargets}
        onNavigateToMilestone={handleNavigateToMilestone}
        onNavigateToEvent={handleNavigateToEvent}
      />

      {/* Mobile Side Indicators */}
      {(isMobile || isTablet) && (
        <motion.div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40"
          style={{ opacity: sideOpacity }}
        >
          <GlassContainer
            style="subtle"
            border="visible"
            rounded="full"
            className="px-4 py-2"
          >
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                <span className="font-medium">{timeline.leftSide.split(' ')[0]}</span>
              </div>
              <div className="w-px h-4" style={{ backgroundColor: colors.border }} />
              <div className="flex items-center gap-2">
                <span className="font-medium">{timeline.rightSide.split(' ')[0]}</span>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
              </div>
            </div>
          </GlassContainer>
        </motion.div>
      )}

      {/* Enhanced Scroll Hint */}
      {isDesktop && !isScrolling && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <motion.div
            className="px-4 py-2 rounded-full backdrop-blur-md border text-xs font-medium"
            style={{
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)',
              borderColor: colors.border,
              color: colors.foreground
            }}
            animate={{
              opacity: [1, 0.6, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            🎯 Snap Scroll Active • Wheel to navigate sections
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}