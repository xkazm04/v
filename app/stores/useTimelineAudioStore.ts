import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Timeline, Milestone } from '@/app/types/timeline';

export interface AudioTrack {
  id: string;
  type: 'conclusion' | 'milestone_context' | 'milestone_consequence' | 'event';
  text: string;
  title: string;
  milestoneId?: string;
  eventId?: string;
  order: number;
  progressId: string; // ID used for timeline progress tracking
}

export interface TimelineAudioState {
  // Current playback state
  currentTrackId: string | null;
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;
  currentTime: number;
  progress: number; // Audio progress (0-100)
  volume: number;
  isMuted: boolean;
  error: string | null;
  
  // Active component tracking - FIXED: Add missing properties
  activeComponentId: string | null;
  activeComponentType: 'milestone' | 'event' | 'hero' | null;
  
  // Track management
  tracks: AudioTrack[];
  trackStates: Record<string, {
    isLoaded: boolean;
    audioUrl?: string;
    lastPosition?: number;
  }>;
  
  // Auto-play settings
  isAutoPlayMode: boolean;
  
  // Actions
  initializeTracklist: (timeline: Timeline) => void;
  playTrack: (trackId: string) => void;
  pauseTrack: () => void;
  stopTrack: () => void;
  setTrackLoaded: (trackId: string, audioUrl: string) => void;
  setPlaybackState: (state: { isPlaying?: boolean; isLoading?: boolean }) => void;
  setProgress: (currentTime: number, duration: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (isMuted: boolean) => void;
  setError: (error: string | null) => void;
  setAutoPlayMode: (enabled: boolean) => void;
  getTrackByProgressId: (progressId: string) => AudioTrack | null;
  getNextTrack: (currentTrackId: string) => AudioTrack | null;
  nextTrack: () => boolean; // Auto-advance to next track
  // FIXED: Add missing action
  setActiveComponent: (componentId: string | null, componentType: 'milestone' | 'event' | 'hero' | null) => void;
  reset: () => void;
}

// Helper function to compose event text with expert opinions
const composeEventText = (event: any): string => {
  let composedText = event.title;
  
  if (event.left_type && event.left_opinion) {
    composedText += `. ${event.left_type} expert says: ${event.left_opinion}`;
  }
  
  if (event.right_type && event.right_opinion) {
    composedText += `. ${event.right_type} expert says: ${event.right_opinion}`;
  }
  
  return composedText;
};

// Generate tracks from timeline data with better organization
const generateTracklist = (timeline: Timeline): AudioTrack[] => {
  const tracks: AudioTrack[] = [];
  
  // 1. Timeline conclusion (hero section)
  tracks.push({
    id: `${timeline.id}-conclusion`,
    type: 'conclusion',
    text: timeline.conclusion,
    title: 'Timeline Summary',
    order: 0,
    progressId: 'hero' // Maps to hero section in timeline progress
  });
  
  // 2. Milestone contexts (in order)
  timeline.milestones
    .sort((a, b) => a.order - b.order)
    .forEach((milestone, index) => {
      tracks.push({
        id: `${milestone.id}-context`,
        type: 'milestone_context',
        text: milestone.context || '',
        title: milestone.title,
        milestoneId: milestone.id,
        order: index + 1,
        progressId: milestone.id // Maps directly to milestone ID
      });
      
      // Add events as individual tracks with expert opinions
      milestone.events.forEach((event, eventIndex) => {
        const composedText = composeEventText(event);
        tracks.push({
          id: `${event.id}-content`,
          type: 'event',
          text: composedText, // Now includes expert opinions
          title: `Event: ${event.title.substring(0, 50)}...`,
          milestoneId: milestone.id,
          eventId: event.id,
          order: index + 1 + (eventIndex + 1) * 0.1,
          progressId: event.id // Maps to event ID
        });
      });
    });
  
  return tracks;
};

export const useTimelineAudioStore = create<TimelineAudioState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentTrackId: null,
      currentTrack: null,
      isPlaying: false,
      isLoading: false,
      duration: 0,
      currentTime: 0,
      progress: 0,
      volume: 0.7,
      isMuted: false,
      error: null,
      
      // FIXED: Initialize missing active component state
      activeComponentId: null,
      activeComponentType: null,
      
      tracks: [],
      trackStates: {},
      isAutoPlayMode: true,
      
      // Initialize tracklist from timeline data
      initializeTracklist: (timeline: Timeline) => {
        const tracks = generateTracklist(timeline);
        const trackStates: Record<string, any> = {};
        
        tracks.forEach(track => {
          trackStates[track.id] = {
            isLoaded: false,
            lastPosition: 0
          };
        });
        
        set({ 
          tracks,
          trackStates,
          currentTrackId: null,
          currentTrack: null,
          // FIXED: Reset active component state
          activeComponentId: null,
          activeComponentType: null
        });
      },
      
      // FIXED: Enhanced play track with component tracking
      playTrack: (trackId: string) => {
        const { tracks } = get();
        const track = tracks.find(t => t.id === trackId);
        
        if (track) {
          // Determine active component based on track type and IDs
          let activeComponentId: string | null = null;
          let activeComponentType: 'milestone' | 'event' | 'hero' | null = null;
          
          if (track.type === 'conclusion') {
            activeComponentId = 'hero';
            activeComponentType = 'hero';
          } else if (track.type === 'milestone_context') {
            activeComponentId = track.milestoneId || null;
            activeComponentType = 'milestone';
          } else if (track.type === 'event') {
            activeComponentId = track.eventId || null;
            activeComponentType = 'event';
          }
          
          set({
            currentTrackId: trackId,
            currentTrack: track,
            isPlaying: true,
            error: null,
            // FIXED: Set active component state
            activeComponentId,
            activeComponentType
          });
        }
      },
      
      // Pause current track
      pauseTrack: () => {
        set({ isPlaying: false });
      },
      
      // Stop current track
      stopTrack: () => {
        set({ 
          isPlaying: false,
          currentTime: 0,
          progress: 0,
          // FIXED: Clear active component when stopping
          activeComponentId: null,
          activeComponentType: null
        });
      },
      
      // Mark track as loaded with audio URL
      setTrackLoaded: (trackId: string, audioUrl: string) => {
        const { trackStates } = get();
        set({
          trackStates: {
            ...trackStates,
            [trackId]: {
              ...trackStates[trackId],
              isLoaded: true,
              audioUrl
            }
          }
        });
      },
      
      // Update playback state
      setPlaybackState: (state) => {
        set((prev) => ({ ...prev, ...state }));
      },
      
      // Update progress
      setProgress: (currentTime: number, duration: number) => {
        const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
        set({ currentTime, duration, progress });
      },
      
      // Volume controls
      setVolume: (volume: number) => {
        set({ volume });
      },
      
      setMuted: (isMuted: boolean) => {
        set({ isMuted });
      },
      
      // Error handling
      setError: (error: string | null) => {
        set({ error });
      },
      
      // Auto-play mode
      setAutoPlayMode: (enabled: boolean) => {
        set({ isAutoPlayMode: enabled });
      },
      
      // Get track by progress ID (for timeline navigation)
      getTrackByProgressId: (progressId: string) => {
        const { tracks } = get();
        return tracks.find(track => track.progressId === progressId) || null;
      },
      
      // Get next track in sequence
      getNextTrack: (currentTrackId: string) => {
        const { tracks } = get();
        const currentIndex = tracks.findIndex(t => t.id === currentTrackId);
        if (currentIndex !== -1 && currentIndex < tracks.length - 1) {
          return tracks[currentIndex + 1];
        }
        return null;
      },

      // FIXED: Enhanced auto-advance with proper component tracking
      nextTrack: () => {
        const { currentTrackId, tracks, isAutoPlayMode } = get();
        if (!currentTrackId || !isAutoPlayMode) return false;
        
        const currentIndex = tracks.findIndex(t => t.id === currentTrackId);
        if (currentIndex !== -1 && currentIndex < tracks.length - 1) {
          const nextTrack = tracks[currentIndex + 1];
          
          // Determine next active component
          let activeComponentId: string | null = null;
          let activeComponentType: 'milestone' | 'event' | 'hero' | null = null;
          
          if (nextTrack.type === 'conclusion') {
            activeComponentId = 'hero';
            activeComponentType = 'hero';
          } else if (nextTrack.type === 'milestone_context') {
            activeComponentId = nextTrack.milestoneId || null;
            activeComponentType = 'milestone';
          } else if (nextTrack.type === 'event') {
            activeComponentId = nextTrack.eventId || null;
            activeComponentType = 'event';
          }
          
          set({
            currentTrackId: nextTrack.id,
            currentTrack: nextTrack,
            isPlaying: false, // Will be set to true when audio starts
            activeComponentId,
            activeComponentType
          });
          return true;
        }
        return false;
      },
      
      // FIXED: Add missing setActiveComponent action
      setActiveComponent: (componentId: string | null, componentType: 'milestone' | 'event' | 'hero' | null) => {
        set({
          activeComponentId: componentId,
          activeComponentType: componentType
        });
      },
      
      // Reset state
      reset: () => {
        set({
          currentTrackId: null,
          currentTrack: null,
          isPlaying: false,
          isLoading: false,
          duration: 0,
          currentTime: 0,
          progress: 0,
          error: null,
          // FIXED: Reset active component state
          activeComponentId: null,
          activeComponentType: null,
          tracks: [],
          trackStates: {}
        });
      }
    }),
    { name: 'timeline-audio-store' }
  )
);