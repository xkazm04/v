'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

export function useTimelineState() {
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [visibleMilestones, setVisibleMilestones] = useState<Set<string>>(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const { mounted } = useLayoutTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Optimized scroll progress tracking
  const updateScrollProgress = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = container.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
    
    setScrollProgress(progress);
  }, []);

  // Enhanced intersection observer for milestone visibility
  useEffect(() => {
    if (!mounted) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const updates = new Map<string, boolean>();
        
        entries.forEach((entry) => {
          const milestoneId = entry.target.getAttribute('data-milestone-id');
          if (milestoneId) {
            updates.set(milestoneId, entry.isIntersecting);
          }
        });

        if (updates.size > 0) {
          setVisibleMilestones(prev => {
            const newSet = new Set(prev);
            updates.forEach((isVisible, milestoneId) => {
              if (isVisible) {
                newSet.add(milestoneId);
              } else {
                newSet.delete(milestoneId);
              }
            });
            return newSet;
          });
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7],
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    // Observe milestone elements with delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const milestoneElements = document.querySelectorAll('[data-milestone-id]');
      milestoneElements.forEach(el => {
        if (observerRef.current) {
          observerRef.current.observe(el);
        }
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [mounted]);

  // Scroll progress listener with throttling
  useEffect(() => {
    if (!mounted) return;

    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mounted, updateScrollProgress]);

  // Auto-set active milestone based on viewport center
  useEffect(() => {
    if (visibleMilestones.size === 0) return;

    const viewportCenter = window.innerHeight / 2;
    let closestMilestone = null;
    let closestDistance = Infinity;

    visibleMilestones.forEach(milestoneId => {
      const element = document.querySelector(`[data-milestone-id="${milestoneId}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestMilestone = milestoneId;
        }
      }
    });

    if (closestMilestone && closestMilestone !== activeMilestoneId) {
      setActiveMilestoneId(closestMilestone);
    }
  }, [visibleMilestones, activeMilestoneId]);

  return {
    activeMilestoneId,
    activeEventId,
    visibleMilestones,
    scrollProgress,
    containerRef,
    observerRef,
    setActiveMilestoneId,
    setActiveEventId,
    updateScrollProgress
  };
}