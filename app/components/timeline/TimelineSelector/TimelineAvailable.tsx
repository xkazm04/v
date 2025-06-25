'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Timeline } from '@/app/types/timeline';

export interface TimelineDataset {
  id: string;
  title: string;
  data: Timeline;
  description?: string;
  topic_id?: string;
  loadedLanguage?: string;
  fallbackUsed?: boolean;
}

interface TimelineAvailableProps {
  dataset: TimelineDataset;
  index: number;
  isActive: boolean;
  onClick: (datasetId: string) => void;
}

export default function TimelineAvailable({
  dataset,
  index,
  isActive,
  onClick
}: TimelineAvailableProps) {
  const { colors, isDark } = useLayoutTheme();

  const vintageColors = colors.vintage || {
    paper: '#f8f6f0',
    ink: '#2c1810',
    faded: '#7a6f47',
    aged: '#e8dcc0',
    sepia: '#d4c4a8',
    highlight: '#fff8e7',
    shadow: 'rgba(139, 69, 19, 0.15)',
    crease: '#e0d5c0',
  };

  // Use vintage colors for light mode, fallback to theme colors for dark mode
  const noteColors = isDark ? {
    background: colors.muted,
    text: colors.foreground,
    border: colors.border,
    shadow: 'rgba(0, 0, 0, 0.3)',
    hover: colors.muted,
    active: colors.active || colors.primary + '20'
  } : {
    background: vintageColors.paper,
    text: vintageColors.ink,
    border: vintageColors.sepia,
    shadow: vintageColors.shadow,
    hover: vintageColors.highlight,
    active: vintageColors.aged
  };

  return (
    <motion.div
      key={dataset.id}
      initial={{ opacity: 0, scale: 0.9, rotate: Math.random() * 4 - 2 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: Math.random() * 6 - 3 
      }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        zIndex: 10
      }}
      whileTap={{ scale: 0.98 }}
      className="relative cursor-pointer group"
      onClick={() => onClick(dataset.id)}
    >
      {/* Sticky note */}
      <div
        className={`
          relative p-4 min-w-[180px] max-w-[220px] min-h-[100px]
          transition-all duration-200 ease-out
          shadow-md hover:shadow-lg
          ${isActive ? 'ring-2 ring-opacity-50' : ''}
        `}
        style={{
          backgroundColor: noteColors.background,
          color: noteColors.text,
          border: `1px solid ${noteColors.border}`,
          boxShadow: `
            0 2px 8px ${noteColors.shadow},
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
          transform: `rotate(${Math.random() * 4 - 2}deg)`,
        }}
      >
        {/* Paper texture overlay for vintage effect */}
        {!isDark && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.1) 1px, transparent 1px),
                radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        )}

        {/* Corner fold effect */}
        <div
          className="absolute top-0 right-0 w-4 h-4 transform rotate-45 translate-x-2 -translate-y-2"
          style={{
            backgroundColor: noteColors.active,
            borderLeft: `1px solid ${noteColors.border}`,
            borderBottom: `1px solid ${noteColors.border}`,
          }}
        />

        {/* Translation indicator */}
        {dataset.fallbackUsed && (
          <div
            className="absolute top-1 left-1 w-2 h-2 rounded-full opacity-60"
            style={{ backgroundColor: '#f59e0b' }}
            title="Using English fallback"
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          <h3 className="font-semibold text-sm mb-2 leading-tight">
            {dataset.title}
          </h3>
          {dataset.description && (
            <p
              className="text-xs opacity-75 leading-relaxed"
              style={{ color: vintageColors?.faded || noteColors.text }}
            >
              {dataset.description}
            </p>
          )}
        </div>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.primary }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        )}
      </div>

      {/* Hover state background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none -z-10"
        style={{
          backgroundColor: noteColors.hover,
          filter: 'blur(8px)',
          transform: 'scale(1.1)',
        }}
      />
    </motion.div>
  );
}