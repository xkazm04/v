'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useTimelineStore } from '@/app/stores/useTimelineStore';
import { useTimelineLoader } from '@/app/hooks/useTimelineLoader';
import TimelineAvailable from './TimelineAvailable'; 

interface TimelineSelectorProps {
  className?: string;
}

export default function TimelineSelector({
  className = ''
}: TimelineSelectorProps) {
  const { colors, isDark } = useLayoutTheme();
  
  const { 
    currentTimeline, 
    isLoadingTimeline, 
    setIsLoadingTimeline, 
    selectTimelineByDatasetId
  } = useTimelineStore();

  const {
    timelines: availableTimelines,
    loading: timelinesLoading,
    error: timelinesError,
    getLoadingStats,
    targetLanguage
  } = useTimelineLoader();

  const handleNoteClick = (datasetId: string) => {
    handleTimelineSelect(datasetId);
  };

  const handleTimelineSelect = async (datasetId: string) => {
    const dataset = availableTimelines.find(d => d.id === datasetId);
    if (!dataset || dataset.data.id === currentTimeline?.id) return;

    setIsLoadingTimeline(true);
    try {
      selectTimelineByDatasetId(datasetId, availableTimelines);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to load timeline:', error);
    } finally {
      setIsLoadingTimeline(false);
    }
  };

  // ✅ Show loading state while timelines are being loaded
  if (timelinesLoading) {
    return (
      <div className={`w-full ${className}`}>
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="inline-block w-8 h-8 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ borderColor: colors.primary }}
          />
          <p className="mt-4 text-lg opacity-80">Loading timelines...</p>
          <p className="mt-1 text-sm opacity-60">
            Preparing {targetLanguage === 'en' ? 'English' : targetLanguage.toUpperCase()} content
          </p>
        </motion.div>
      </div>
    );
  }

  // ✅ Show error state if timelines failed to load
  if (timelinesError) {
    return (
      <div className={`w-full ${className}`}>
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-red-500 mb-4">⚠️ Failed to load timelines</div>
          <p className="text-sm opacity-60">{timelinesError}</p>
        </motion.div>
      </div>
    );
  }

  const loadingStats = getLoadingStats();

  return (
    <div className={`w-full ${className}`}>
      {/* Translation status indicator (only show if not English) */}
      {targetLanguage !== 'en' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs"
               style={{ 
                 backgroundColor: colors.muted,
                 color: colors.mutedForeground
               }}>
            <span>🌐</span>
            <span>
              {loadingStats.nativeCount > 0 
                ? `${targetLanguage.toUpperCase()} content loaded`
                : `English fallback (${targetLanguage.toUpperCase()} not available)`}
            </span>
            {loadingStats.fallbackCount > 0 && (
              <span className="opacity-70">
                ({loadingStats.nativeCount}/{loadingStats.totalLoaded} translated)
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* ✅ SIMPLIFIED: Timeline grid using the new component */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-wrap justify-center gap-3 mb-8 px-4"
      >
        {availableTimelines.map((dataset, index) => {
          const isActive = currentTimeline?.id === dataset.data.id;

          return (
            <TimelineAvailable
              key={dataset.id}
              dataset={dataset}
              index={index}
              isActive={isActive}
              onClick={handleNoteClick}
            />
          );
        })}
      </motion.div>

      {/* Loading indicator */}
      {isLoadingTimeline && (
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ borderColor: colors.primary }}
          />
          <p className="mt-2 text-sm opacity-60">Loading timeline...</p>
        </motion.div>
      )}

      {/* Helper text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="text-center text-sm opacity-60 mb-6"
        style={{ color: colors.mutedForeground }}
      >
        Click a note to explore different historical timelines
      </motion.p>
    </div>
  );
}