import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
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

export const TIMELINE_DATASETS: TimelineDataset[] = [];

interface TimelineStoreState {
  // Current selected timeline
  currentTimeline: Timeline | null; 
  
  isLoadingTimeline: boolean;
  
  selectedTopicId: string | null;
  
  
  // Actions
  setCurrentTimeline: (timeline: Timeline | null) => void;
  setIsLoadingTimeline: (loading: boolean) => void;
  setSelectedTopicId: (topicId: string | null) => void;
  selectTimelineByTopicId: (topicId: string, availableTimelines?: TimelineDataset[]) => void;
  selectTimelineByDatasetId: (datasetId: string, availableTimelines?: TimelineDataset[]) => void; 
  
  getTimelineByTopicId: (topicId: string, availableTimelines: TimelineDataset[]) => TimelineDataset | undefined;
  getTimelineByDatasetId: (datasetId: string, availableTimelines: TimelineDataset[]) => TimelineDataset | undefined;
}

export const useTimelineStore = create<TimelineStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        currentTimeline: null,
        isLoadingTimeline: false,
        selectedTopicId: null,

        // Actions
        setCurrentTimeline: (timeline: Timeline | null) => {
          set({ currentTimeline: timeline }, false, 'setCurrentTimeline');
        },

        setIsLoadingTimeline: (loading: boolean) => {
          set({ isLoadingTimeline: loading }, false, 'setIsLoadingTimeline');
        },

        setSelectedTopicId: (topicId: string | null) => {
          set({ selectedTopicId: topicId }, false, 'setSelectedTopicId');
        },

        selectTimelineByTopicId: (topicId: string, availableTimelines: TimelineDataset[] = []) => {
          const dataset = get().getTimelineByTopicId(topicId, availableTimelines);
          if (dataset) {
            set({ 
              currentTimeline: dataset.data,
              selectedTopicId: topicId 
            }, false, 'selectTimelineByTopicId');
            
            console.log(`📊 Selected timeline by topic: ${topicId} (${dataset.title})`);
          } else {
            console.warn(`⚠️ Timeline not found for topic: ${topicId}`);
          }
        },

        selectTimelineByDatasetId: (datasetId: string, availableTimelines: TimelineDataset[] = []) => {
          const dataset = get().getTimelineByDatasetId(datasetId, availableTimelines);
          if (dataset) {
            set({ 
              currentTimeline: dataset.data,
              selectedTopicId: dataset.topic_id || null 
            }, false, 'selectTimelineByDatasetId');
            
            console.log(`📊 Selected timeline by dataset: ${datasetId} (${dataset.title})`);
          } else {
            console.warn(`⚠️ Timeline not found for dataset: ${datasetId}`);
          }
        },

        getTimelineByTopicId: (topicId: string, availableTimelines: TimelineDataset[]) => {
          return availableTimelines.find(dataset => dataset.topic_id === topicId);
        },

        getTimelineByDatasetId: (datasetId: string, availableTimelines: TimelineDataset[]) => {
          return availableTimelines.find(dataset => dataset.id === datasetId);
        },
      }),
      {
        name: 'timeline-store',
        storage: typeof window !== 'undefined' ? {
          getItem: (name) => {
            const value = localStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          },
        } : undefined,
        // Removed partialize because it must return a full TimelineStoreState object, not a partial.
      }
    ),
    {
      name: 'timeline-store',
    }
  )
);