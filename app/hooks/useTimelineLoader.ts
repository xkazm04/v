'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserPreferences } from './use-user-preferences';
import { Timeline } from '@/app/types/timeline';

// Supported languages for timeline translations
const SUPPORTED_TIMELINE_LANGUAGES = ['en', 'cs', 'ru'] as const;
type SupportedTimelineLanguage = typeof SUPPORTED_TIMELINE_LANGUAGES[number];

// Timeline file metadata
interface TimelineFileInfo {
  filename: string;
  id: string;
  title: string;
  description?: string;
  topic_id?: string;
}

// Available timeline files (these should match your current files)
const TIMELINE_FILES: TimelineFileInfo[] = [
  {
    filename: 'timeline_milestones_india',
    id: 'india-pakistan',
    title: 'India x Pakistan 2025',
    description: 'Escalation leading to conflict',
    topic_id: 'india-pakistan-conflict'
  },
  {
    filename: 'timeline_milestones_sudan', // Note: Currently used for Iraq War
    id: 'iraq-war',
    title: 'Iraq War 2003-2011', 
    description: 'Coalition invasion and aftermath',
    topic_id: 'iraq-war'
  },
  {
    filename: 'timeline_milestones_syria',
    id: 'syria-civil-war',
    title: 'Syria Civil War 2011-2025',
    description: 'Ongoing conflict and interventions',
    topic_id: 'syria-civil-war'
  },
  {
    filename: 'timeline_milestones_ukraine',
    id: 'russia-ukraine',
    title: 'Russia x Ukraine 2013-2022',
    description: 'From annexation to full invasion',
    topic_id: 'russia-ukraine-conflict'
  },
  {
    filename: 'timeline_milestones_israel',
    id: 'israel-iran',
    title: 'Israel x Iran 2017-2025',
    description: 'Shadow war escalation',
    topic_id: 'israel-iran-tensions'
  }
];

interface LoadedTimeline extends TimelineFileInfo {
  data: Timeline;
  loadedLanguage: SupportedTimelineLanguage;
  fallbackUsed: boolean;
}

export function useTimelineLoader() {
  const { preferences } = useUserPreferences();
  const [loadedTimelines, setLoadedTimelines] = useState<LoadedTimeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get target language for timeline loading
  const getTargetLanguage = useCallback((): SupportedTimelineLanguage => {
    const userLang = preferences.language;
    
    if (SUPPORTED_TIMELINE_LANGUAGES.includes(userLang as SupportedTimelineLanguage)) {
      return userLang as SupportedTimelineLanguage;
    }
    
    return 'en'; // Default fallback
  }, [preferences.language]);

  // Load a single timeline file with fallback logic
  const loadTimelineFile = useCallback(async (
    fileInfo: TimelineFileInfo, 
    targetLanguage: SupportedTimelineLanguage
  ): Promise<LoadedTimeline> => {
    const filename = `${fileInfo.filename}.json`;
    
    // Try to load in target language first
    if (targetLanguage !== 'en') {
      try {
        console.log(`📖 Loading timeline file: ${targetLanguage}/${filename}`);
        const module = await import(
          `@/app/components/timeline/TimelineSelector/${targetLanguage}/${filename}`
        );
        
        return {
          ...fileInfo,
          data: module.default as Timeline,
          loadedLanguage: targetLanguage,
          fallbackUsed: false
        };
      } catch (error) {
        console.warn(`⚠️ Timeline file not found in ${targetLanguage}, falling back to English: ${filename}`);
        // Fall through to English fallback
      }
    }
    
    // Fallback to English
    try {
      console.log(`📖 Loading English timeline file: en/${filename}`);
      const module = await import(
        `@/app/components/timeline/TimelineSelector/en/${filename}`
      );
      
      return {
        ...fileInfo,
        data: module.default as Timeline,
        loadedLanguage: 'en',
        fallbackUsed: targetLanguage !== 'en'
      };
    } catch (error) {
      console.error(`❌ Failed to load timeline file: ${filename}`, error);
      throw new Error(`Failed to load timeline: ${fileInfo.title}`);
    }
  }, []);

  // Load all timeline files
  const loadAllTimelines = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const targetLanguage = getTargetLanguage();
      console.log(`🌐 Loading timelines for language: ${targetLanguage}`);
      
      const promises = TIMELINE_FILES.map(fileInfo => 
        loadTimelineFile(fileInfo, targetLanguage)
      );
      
      const results = await Promise.all(promises);
      
      // Log loading summary
      const fallbackCount = results.filter(r => r.fallbackUsed).length;
      const nativeCount = results.length - fallbackCount;
      
      console.log(`✅ Loaded ${results.length} timelines: ${nativeCount} in ${targetLanguage}, ${fallbackCount} fallback to English`);
      
      setLoadedTimelines(results);
      
    } catch (err) {
      console.error('❌ Failed to load timelines:', err);
      setError(err instanceof Error ? err.message : 'Failed to load timelines');
      setLoadedTimelines([]);
    } finally {
      setLoading(false);
    }
  }, [getTargetLanguage, loadTimelineFile]);

  // Load timelines when language changes
  useEffect(() => {
    loadAllTimelines();
  }, [loadAllTimelines]);

  // Reload timelines manually
  const reloadTimelines = useCallback(() => {
    loadAllTimelines();
  }, [loadAllTimelines]);

  // Get timeline by dataset ID
  const getTimelineByDatasetId = useCallback((datasetId: string): LoadedTimeline | undefined => {
    return loadedTimelines.find(timeline => timeline.id === datasetId);
  }, [loadedTimelines]);

  // Get timeline by topic ID
  const getTimelineByTopicId = useCallback((topicId: string): LoadedTimeline | undefined => {
    return loadedTimelines.find(timeline => timeline.topic_id === topicId);
  }, [loadedTimelines]);

  // Get loading stats
  const getLoadingStats = useCallback(() => {
    const targetLanguage = getTargetLanguage();
    const nativeCount = loadedTimelines.filter(t => !t.fallbackUsed).length;
    const fallbackCount = loadedTimelines.filter(t => t.fallbackUsed).length;
    
    return {
      targetLanguage,
      totalLoaded: loadedTimelines.length,
      nativeCount,
      fallbackCount,
      translationCoverage: loadedTimelines.length > 0 ? (nativeCount / loadedTimelines.length) * 100 : 0
    };
  }, [loadedTimelines, getTargetLanguage]);

  return {
    timelines: loadedTimelines,
    loading,
    error,
    reloadTimelines,
    getTimelineByDatasetId,
    getTimelineByTopicId,
    getLoadingStats,
    
    // Computed values
    targetLanguage: getTargetLanguage(),
    hasTimelines: loadedTimelines.length > 0,
  };
}