'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { VideoMetadata } from '@/app/types/video';

interface VideoState {
  videos: VideoMetadata[];
  currentVideo: VideoMetadata | null;
  recentlyWatched: VideoMetadata[];
  likedVideos: string[];
  savedVideos: string[];
  isHydrated: boolean;
  
  // Actions
  setCurrentVideo: (video: VideoMetadata) => void;
  addToRecentlyWatched: (video: VideoMetadata) => void;
  toggleLikedVideo: (videoId: string) => void;
  toggleSavedVideo: (videoId: string) => void;
  setHydrated: () => void;
}

export const useVideoStore = create<VideoState>()(
  persist(
    (set, get) => ({
      videos: [],
      currentVideo: null,
      recentlyWatched: [],
      likedVideos: [],
      savedVideos: [],
      isHydrated: false,
      
      setCurrentVideo: (video) => {
        set({ currentVideo: video });
        get().addToRecentlyWatched(video);
      },
      
      addToRecentlyWatched: (video) => {
        set((state) => {
          const filteredList = state.recentlyWatched.filter(v => v.id !== video.id);
          return {
            recentlyWatched: [video, ...filteredList].slice(0, 20)
          };
        });
      },
      
      toggleLikedVideo: (videoId) => {
        set((state) => {
          const isLiked = state.likedVideos.includes(videoId);
          return {
            likedVideos: isLiked
              ? state.likedVideos.filter(id => id !== videoId)
              : [...state.likedVideos, videoId]
          };
        });
      },
      
      toggleSavedVideo: (videoId) => {
        set((state) => {
          const isSaved = state.savedVideos.includes(videoId);
          return {
            savedVideos: isSaved
              ? state.savedVideos.filter(id => id !== videoId)
              : [...state.savedVideos, videoId]
          };
        });
      },
      
      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'video-storage',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

// Hook to check if store is hydrated
export const useIsHydrated = () => {
  return useVideoStore((state) => state.isHydrated);
};