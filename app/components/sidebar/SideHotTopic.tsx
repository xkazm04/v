'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ExternalLink, SwordsIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useFilterStore } from '@/app/stores/filterStore';
import { useTimelineStore } from '@/app/stores/useTimelineStore';

interface SideHotTopicProps {
  topic: {
    id: string;
    title: string;
    description: string;
    timelineId: string;
  };
  isCollapsed: boolean;
  index: number;
}

const SideHotTopic: React.FC<SideHotTopicProps> = ({
  topic,
  isCollapsed,
  index,
}) => {
  const { colors, isDark, vintage } = useLayoutTheme();
  const router = useRouter();
  const { selectedTopicId, setSelectedTopicId } = useFilterStore();
  const { selectTimelineByTopicId } = useTimelineStore();

  const isActive = selectedTopicId === topic.id;

  const handleTopicClick = () => {
    setSelectedTopicId(selectedTopicId === topic.id ? null : topic.id);
    selectTimelineByTopicId(topic.id);
 };

  const handleTimelineView = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectTimelineByTopicId(topic.id);
    router.push('/timeline');
  };

  const vintageColors = vintage || {
    paper: '#f8f6f0',
    ink: '#2c1810',
    faded: '#7a6f47',
    aged: '#e8dcc0',
    sepia: '#d4c4a8',
    highlight: '#fff8e7',
    shadow: 'rgba(139, 69, 19, 0.15)',
  };

  const topicColors = isDark ? {
    background: colors.primary + '10',
    activeBackground: colors.primary + '30',
    text: colors.foreground,
    activeText: 'white',
    border: colors.border,
    activeBorder: colors.primary,
    shadow: 'rgba(0, 0, 0, 0.3)',
    hover: colors.muted,
    icon: colors.primary,
    activeIcon: colors.primary,
  } : {
    background: vintageColors.highlight,
    activeBackground: vintageColors.aged,
    text: vintageColors.ink,
    activeText: vintageColors.ink,
    border: vintageColors.sepia,
    activeBorder: colors.primary,
    shadow: vintageColors.shadow,
    hover: vintageColors.paper,
    icon: vintageColors.faded,
    activeIcon: colors.primary,
  };

  return (
    <motion.div
      key={topic.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }}
      className="relative group"
    >
      <motion.div
        onClick={handleTopicClick}
        className={`
          w-full p-3 rounded-lg text-left transition-all duration-200
          border shadow-sm
          ${isCollapsed ? 'px-2' : 'px-3'}
        `}
        style={{
          backgroundColor: isActive ? topicColors.activeBackground : topicColors.background,
          borderColor: isActive ? topicColors.activeBorder : topicColors.border,
          color: isActive ? topicColors.activeText : topicColors.text,
          boxShadow: `0 1px 3px ${topicColors.shadow}`,
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          {/* Hot topic icon */}
          <div className="flex-shrink-0">
            <SwordsIcon 
              size={isCollapsed ? 18 : 16} 
              style={{ 
                color: isActive ? topicColors.activeIcon : topicColors.icon 
              }}
              className={`${isActive ? 'animate-pulse' : ''}`}
            />
          </div>

          {/* Topic content */}
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 
                  className="text-sm font-medium truncate"
                  style={{ color: isActive ? topicColors.activeText : topicColors.text }}
                >
                  {topic.title}
                </h4>
                
                {/* Timeline view button */}
                <button
                  onClick={handleTimelineView}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-black/10"
                  title="View Timeline"
                >
                  <ExternalLink 
                    size={12} 
                    style={{ color: isActive ? topicColors.activeIcon : topicColors.icon }}
                  />
                </button>
              </div>
              
              {topic.description && (
                <p 
                  className="text-xs mt-1 truncate opacity-75"
                  style={{ color: isActive ? topicColors.activeText : topicColors.text }}
                >
                  {topic.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute left-0 top-1/2 w-1 h-6 rounded-r-full"
            style={{ backgroundColor: colors.primary }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div
            className="px-3 py-2 rounded-lg shadow-lg text-xs font-medium whitespace-nowrap"
            style={{
              backgroundColor: topicColors.background,
              color: topicColors.text,
              border: `1px solid ${topicColors.border}`,
              boxShadow: `0 4px 12px ${topicColors.shadow}`,
            }}
          >
            {topic.title}
            
            <div
              className="absolute left-0 top-1/2 w-2 h-2 transform -translate-x-1 -translate-y-1/2 rotate-45"
              style={{
                backgroundColor: topicColors.background,
                borderLeft: `1px solid ${topicColors.border}`,
                borderBottom: `1px solid ${topicColors.border}`,
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SideHotTopic;