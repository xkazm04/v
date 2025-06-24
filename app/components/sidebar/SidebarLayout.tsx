'use client';

import { useState, useEffect, useRef } from 'react';

export enum LoadingStage {
  NAVIGATION = 0,
  COUNTRIES = 1,
  HOT_TOPICS = 2,
  SETTINGS = 3,
  COMPLETE = 4
}

export const useSidebarState = () => {
  const [mounted, setMounted] = useState(false);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>(LoadingStage.NAVIGATION);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['main', 'countries', 'hot-topics'])
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const stages = [
      { stage: LoadingStage.COUNTRIES, delay: 400 },
      { stage: LoadingStage.HOT_TOPICS, delay: 1200 },
      { stage: LoadingStage.SETTINGS, delay: 1600 },
      { stage: LoadingStage.COMPLETE, delay: 2000 }
    ];

    stages.forEach(({ stage, delay }) => {
      setTimeout(() => {
        setLoadingStage(prevStage => Math.max(prevStage, stage));
      }, delay);
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoadingStage(LoadingStage.COMPLETE);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  return {
    mounted,
    loadingStage,
    expandedSections,
    containerRef,
    toggleSection
  };
};