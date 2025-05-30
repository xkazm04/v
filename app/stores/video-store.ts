'use client';

import { create } from 'zustand';
import { VideoMetadata } from '@/app/types/video';
import { MOCK_VIDEOS } from '@/app/constants/videos';

interface VideoState {
  videos: VideoMetadata[];
  currentVideo: VideoMetadata | null;
  recentlyWatched: VideoMetadata[];
  likedVideos: string[]; // video IDs
  savedVideos: string[]; // video IDs
  
  // Actions
  setCurrentVideo: (video: VideoMetadata) => void;
  addToRecentlyWatched: (video: VideoMetadata) => void;
  toggleLikedVideo: (videoId: string) => void;
  toggleSavedVideo: (videoId: string) => void;
  getVideosByCategory: (category: string) => VideoMetadata[];
}

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: MOCK_VIDEOS,
  currentVideo: null,
  recentlyWatched: [],
  likedVideos: [],
  savedVideos: [],
  
  setCurrentVideo: (video) => {
    set({ currentVideo: video });
    get().addToRecentlyWatched(video);
  },
  
  addToRecentlyWatched: (video) => {
    set((state) => {
      // Remove the video if it's already in the list
      const filteredList = state.recentlyWatched.filter(v => v.id !== video.id);
      // Add it to the beginning
      return {
        recentlyWatched: [video, ...filteredList].slice(0, 20) // Keep only last 20
      };
    });
  },
  
  toggleLikedVideo: (videoId) => {
    set((state) => {
      if (state.likedVideos.includes(videoId)) {
        return {
          likedVideos: state.likedVideos.filter(id => id !== videoId)
        };
      } else {
        return {
          likedVideos: [...state.likedVideos, videoId]
        };
      }
    });
  },
  
  toggleSavedVideo: (videoId) => {
    set((state) => {
      if (state.savedVideos.includes(videoId)) {
        return {
          savedVideos: state.savedVideos.filter(id => id !== videoId)
        };
      } else {
        return {
          savedVideos: [...state.savedVideos, videoId]
        };
      }
    });
  },
  
  getVideosByCategory: (category) => {
    if (category === 'All') {
      return get().videos;
    }
    return get().videos.filter(video => video.category === category);
  }
}));