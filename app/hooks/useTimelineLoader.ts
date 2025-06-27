'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserPreferences } from './use-user-preferences';
import { Timeline } from '@/app/types/timeline';

// English files
import timelineIndiaEn from '@/app/components/timeline/TimelineSelector/en/timeline_milestones_india.json';
import timelineIraqEn from '@/app/components/timeline/TimelineSelector/en/timeline_milestones_iraq.json';
import timelineSyriaEn from '@/app/components/timeline/TimelineSelector/en/timeline_milestones_syria.json';
import timelineUkraineEn from '@/app/components/timeline/TimelineSelector/en/timeline_milestones_ukraine.json';
import timelineIsraelEn from '@/app/components/timeline/TimelineSelector/en/timeline_milestones_israel.json';
import timelineSudanEn from '@/app/components/timeline/TimelineSelector/en/timeline_milestones_sudan.json';

// Czech files (only available ones)
import timelineIndiaCs from '@/app/components/timeline/TimelineSelector/cs/timeline_milestones_india.json';
import timelineIraqCs from '@/app/components/timeline/TimelineSelector/cs/timeline_milestones_iraq.json';
import timelineUkraineCs from '@/app/components/timeline/TimelineSelector/cs/timeline_milestones_ukraine.json';
import timelineIsraelCs from '@/app/components/timeline/TimelineSelector/cs/timeline_milestones_israel.json';

// Supported languages for timeline translations
const SUPPORTED_TIMELINE_LANGUAGES = ['en', 'cs'] as const;
type SupportedTimelineLanguage = typeof SUPPORTED_TIMELINE_LANGUAGES[number];

// Timeline file metadata
interface TimelineFileInfo {
  filename: string;
  id: string;
  title: string;
  description?: string;
  topic_id?: string;
}

const TIMELINE_FILES: TimelineFileInfo[] = [
  {
    filename: 'timeline_milestones_india',
    id: 'india-pakistan',
    title: 'India x Pakistan 2025',
    description: 'Escalation leading to conflict',
    topic_id: 'india-pakistan-conflict'  
  },
  {
    filename: 'timeline_milestones_iraq',
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

// ✅ STATIC TIMELINE MAP: Direct mapping to imported files  
const STATIC_TIMELINES = {
  en: {
    'timeline_milestones_india': timelineIndiaEn,
    'timeline_milestones_iraq': timelineIraqEn,
    'timeline_milestones_syria': timelineSyriaEn,
    'timeline_milestones_ukraine': timelineUkraineEn,
    'timeline_milestones_israel': timelineIsraelEn,
    'timeline_milestones_sudan': timelineSudanEn,
  },
  cs: {
    'timeline_milestones_india': timelineIndiaCs,
    'timeline_milestones_iraq': timelineIraqCs,
    'timeline_milestones_ukraine': timelineUkraineCs,
    'timeline_milestones_israel': timelineIsraelCs,
  }
} as const;

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

  // ✅ IMPROVED: Better language detection with fallback to English
  const getTargetLanguage = useCallback((): SupportedTimelineLanguage => {
    const userLang = preferences?.language;
    
    if (!userLang || userLang === '' || userLang === 'en') {
      return 'en';
    }
    
    if (SUPPORTED_TIMELINE_LANGUAGES.includes(userLang as SupportedTimelineLanguage)) {
      return userLang as SupportedTimelineLanguage;
    }
    
    console.log(`🌐 Language '${userLang}' not supported for timelines, falling back to English`);
    return 'en';
  }, [preferences?.language]);

  // ✅ STATIC LOADING: Load timeline file from static imports
  const loadTimelineFile = useCallback((
    fileInfo: TimelineFileInfo, 
    targetLanguage: SupportedTimelineLanguage
  ): LoadedTimeline => {
    const filename = fileInfo.filename;
    
    // Try to load in target language first (if not English and file exists)
    if (targetLanguage !== 'en') {
      const targetTimelines = STATIC_TIMELINES[targetLanguage];
      if (targetTimelines && filename in targetTimelines) {
        console.log(`📖 Loading timeline file: ${targetLanguage}/${filename}.json`);
        return {
          ...fileInfo,
          data: targetTimelines[filename as keyof typeof targetTimelines] as Timeline,
          loadedLanguage: targetLanguage,
          fallbackUsed: false
        };
      } else {
        console.warn(`⚠️ Timeline file not available in ${targetLanguage}, falling back to English: ${filename}`);
      }
    }
    
    // Fallback to English - try primary filename first
    const englishTimelines = STATIC_TIMELINES.en;
    if (filename in englishTimelines) {
      console.log(`📖 Loading English timeline file: en/${filename}.json`);
      return {
        ...fileInfo,
        data: englishTimelines[filename as keyof typeof englishTimelines] as Timeline,
        loadedLanguage: 'en',
        fallbackUsed: targetLanguage !== 'en'
      };
    }
    
    // Special case: Iraq War fallback to Sudan file
    if (filename === 'timeline_milestones_iraq' && 'timeline_milestones_sudan' in englishTimelines) {
      console.log(`📖 Loading English timeline file with sudan fallback: en/timeline_milestones_sudan.json`);
      return {
        ...fileInfo,
        data: englishTimelines.timeline_milestones_sudan as Timeline,
        loadedLanguage: 'en',
        fallbackUsed: true
      };
    }
    
    throw new Error(`Timeline file not found: ${fileInfo.title}`);
  }, []);

  // ✅ SYNCHRONOUS LOADING: Load all timelines synchronously
  const loadAllTimelines = useCallback(() => {
    setLoading(true);
    setError(null);
    
    try {
      const targetLanguage = getTargetLanguage();
      console.log(`🌐 Loading timelines for language: ${targetLanguage}`);
      
      const results: LoadedTimeline[] = [];
      const errors: string[] = [];
      
      for (const fileInfo of TIMELINE_FILES) {
        try {
          const result = loadTimelineFile(fileInfo, targetLanguage);
          results.push(result);
        } catch (error) {
          const errorMsg = `Failed to load ${fileInfo.title}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          console.error(`❌ ${errorMsg}`);
          errors.push(errorMsg);
        }
      }
      
      if (results.length > 0) {
        const fallbackCount = results.filter(r => r.fallbackUsed).length;
        const nativeCount = results.length - fallbackCount;
        
        console.log(`✅ Loaded ${results.length}/${TIMELINE_FILES.length} timelines: ${nativeCount} in ${targetLanguage}, ${fallbackCount} fallback to English`);
        
        if (errors.length > 0) {
          console.warn(`⚠️ Some timelines failed to load:`, errors);
          setError(`Partially loaded: ${errors.length} files failed`);
        }
        
        setLoadedTimelines(results);
      } else {
        throw new Error('No timeline files could be loaded');
      }
      
    } catch (err) {
      console.error('❌ Failed to load timelines:', err);
      setError(err instanceof Error ? err.message : 'Failed to load timelines');
      setLoadedTimelines([]);
    } finally {
      setLoading(false);
    }
  }, [getTargetLanguage, loadTimelineFile]);

  // Load timelines when language changes or component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      loadAllTimelines();
    }, 100);
    
    return () => clearTimeout(timer);
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
      expectedTotal: TIMELINE_FILES.length,
      nativeCount,
      fallbackCount,
      translationCoverage: loadedTimelines.length > 0 ? (nativeCount / loadedTimelines.length) * 100 : 0,
      loadingSuccess: loadedTimelines.length / TIMELINE_FILES.length * 100
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
    
    // Debug helpers
    availableFiles: Object.keys(STATIC_TIMELINES.en),
    expectedFiles: TIMELINE_FILES.map(f => f.filename),
    isLoading: loading,
    hasError: !!error,
    isEmpty: !loading && loadedTimelines.length === 0,
  };
}