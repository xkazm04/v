'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sampleDiagram } from './sampleData';
import TimelineContainer from './EduTimeline/TimelineContainer';
import TimelineHeader from './EduTimeline/TimelineHeader';
import TimelineBackground from './EduTimeline/TimelineBackground';
import TimelineScrollIndicator from './EduTimeline/TimelineScrollIndicator';
import { useTimelineState } from './EduTimeline/useTimelineState';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

export type MilestoneEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  reference_url?: string;
  text_1?: string;
  text_2?: string;
  text_3?: string;
  text_4?: string;
  order?: number;
}

export type PerspectiveConfig = {
  key: keyof MilestoneEvent;
  label: string;
  icon: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color: string;
  description: string;
}

export const PERSPECTIVE_CONFIGS: PerspectiveConfig[] = [
  {
    key: 'text_1',
    label: 'Critical Analysis',
    icon: '🔍',
    position: 'top-left',
    color: 'blue',
    description: 'In-depth critical examination and analysis'
  },
  {
    key: 'text_2',
    label: 'Economic Impact',
    icon: '💰',
    position: 'top-right',
    color: 'emerald',
    description: 'Economic implications and financial effects'
  },
  {
    key: 'text_3',
    label: 'Simple Explanation',
    icon: '💡',
    position: 'bottom-left',
    color: 'amber',
    description: 'Clear, accessible explanation for everyone'
  },
  {
    key: 'text_4',
    label: 'Psychological View',
    icon: '🧠',
    position: 'bottom-right',
    color: 'purple',
    description: 'Psychological and behavioral insights'
  }
];

export default function TimelineVertical() {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const { colors, isDark } = useLayoutTheme();
  
  const {
    activeMilestoneId,
    activeEventId,
    visibleMilestones,
    scrollProgress,
    containerRef,
    setActiveEventId,
    setActiveMilestoneId
  } = useTimelineState();

  const diagram = sampleDiagram;
  const sortedMilestones = [...diagram.milestones].sort((a, b) => a.order - b.order);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen transition-colors duration-300 relative overflow-x-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(30, 41, 59) 50%, rgb(15, 23, 42) 100%)'
          : 'linear-gradient(135deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 50%, rgb(248, 250, 252) 100%)',
        color: colors.foreground
      }}
    >
      {/* Background Effects & Progress Line */}
      <TimelineBackground 
        scrollProgress={scrollProgress}
        isDark={isDark}
        colors={colors}
      />

      {/* Header Section */}
      <TimelineHeader 
        diagram={diagram}
        colors={colors}
        isDark={isDark}
      />

      {/* Main Timeline Container */}
      <TimelineContainer
        milestones={sortedMilestones}
        activeMilestoneId={activeMilestoneId}
        activeEventId={activeEventId}
        expandedEventId={expandedEventId}
        visibleMilestones={visibleMilestones}
        scrollProgress={scrollProgress}
        onEventHover={setActiveEventId}
        onMilestoneHover={setActiveMilestoneId}
        onEventExpand={setExpandedEventId}
      />
      
      {/* Scroll Progress Indicator */}
      <TimelineScrollIndicator 
        scrollProgress={scrollProgress}
        colors={colors}
      />
    </div>
  );
}