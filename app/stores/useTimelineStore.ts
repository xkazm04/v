import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Timeline } from '@/app/types/timeline';

// Import timeline datasets
import indiaTimeline from '@/app/components/timeline/TimelineSelector/en/timeline_milestones_india.json';
import sudanTimeline from '@/app/components/timeline/TimelineSelector/en/timeline_milestones_sudan.json';
import syriaTimeline from '@/app/components/timeline/TimelineSelector/en/timeline_milestones_syria.json';
import ukraineTimeline from '@/app/components/timeline/TimelineSelector/en/timeline_milestones_ukraine.json';
import israelTimeline from '@/app/components/timeline/TimelineSelector/en/timeline_milestones_israel.json';

export interface TimelineDataset {
  id: string;
  title: string;
  data: Timeline;
  description?: string;
  topic_id?: string; // Added to map with research topic_id
}

// Timeline datasets available throughout the app
export const TIMELINE_DATASETS: TimelineDataset[] = [
  {
    id: 'india-pakistan',
    title: 'India x Pakistan 2025',
    data: indiaTimeline as Timeline,
    description: 'Escalation leading to conflict',
    topic_id: 'india-pakistan-conflict'
  },
  {
    id: 'iraq-war',
    title: 'Iraq War 2003-2011',
    data: sudanTimeline as Timeline,
    description: 'Coalition invasion and aftermath',
    topic_id: 'iraq-war'
  },
  {
    id: 'syria-civil-war',
    title: 'Syria Civil War 2011-2025',
    data: syriaTimeline as Timeline,
    description: 'Ongoing conflict and interventions',
    topic_id: 'syria-civil-war'
  },
  {
    id: 'russia-ukraine',
    title: 'Russia x Ukraine 2013-2022',
    data: ukraineTimeline as Timeline,
    description: 'From annexation to full invasion',
    topic_id: 'russia-ukraine-conflict'
  },
  {
    id: 'israel-iran',
    title: 'Israel x Iran 2017-2025',
    data: israelTimeline as Timeline,
    description: 'Shadow war escalation',
    topic_id: 'israel-iran-tensions'
  }
];

interface TimelineStoreState {
  // Current selected timeline
  currentTimeline: Timeline;
  
  // Loading state for timeline switching
  isLoadingTimeline: boolean;
  
  // Selected topic from research (used to navigate to timeline)
  selectedTopicId: string | null;
  
  // Actions
  setCurrentTimeline: (timeline: Timeline) => void;
  setIsLoadingTimeline: (loading: boolean) => void;
  setSelectedTopicId: (topicId: string | null) => void;
  selectTimelineByTopicId: (topicId: string) => void;
  selectTimelineByDatasetId: (datasetId: string) => void;
  
  // Getters
  getTimelineByTopicId: (topicId: string) => TimelineDataset | undefined;
  getTimelineByDatasetId: (datasetId: string) => TimelineDataset | undefined;
}

export const useTimelineStore = create<TimelineStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state - default to first timeline
        currentTimeline: TIMELINE_DATASETS[0].data,
        isLoadingTimeline: false,
        selectedTopicId: null,

        // Actions
        setCurrentTimeline: (timeline: Timeline) => {
          set({ currentTimeline: timeline }, false, 'setCurrentTimeline');
        },

        setIsLoadingTimeline: (loading: boolean) => {
          set({ isLoadingTimeline: loading }, false, 'setIsLoadingTimeline');
        },

        setSelectedTopicId: (topicId: string | null) => {
          set({ selectedTopicId: topicId }, false, 'setSelectedTopicId');
        },

        selectTimelineByTopicId: (topicId: string) => {
          const dataset = get().getTimelineByTopicId(topicId);
          if (dataset) {
            set({ 
              currentTimeline: dataset.data,
              selectedTopicId: topicId 
            }, false, 'selectTimelineByTopicId');
          }
        },

        selectTimelineByDatasetId: (datasetId: string) => {
          const dataset = get().getTimelineByDatasetId(datasetId);
          if (dataset) {
            set({ 
              currentTimeline: dataset.data,
              selectedTopicId: dataset.topic_id || null 
            }, false, 'selectTimelineByDatasetId');
          }
        },

        // Getters
        getTimelineByTopicId: (topicId: string) => {
          return TIMELINE_DATASETS.find(dataset => dataset.topic_id === topicId);
        },

        getTimelineByDatasetId: (datasetId: string) => {
          return TIMELINE_DATASETS.find(dataset => dataset.id === datasetId);
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
        // Only persist these keys
        partialize: (state) => ({ 
          currentTimeline: state.currentTimeline,
          selectedTopicId: state.selectedTopicId 
        }),
      }
    ),
    {
      name: 'timeline-store',
    }
  )
);