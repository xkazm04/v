'use client';

import { useState, useEffect } from 'react';
import { VideoMetadata } from '@/app/types/video';
import { useYouTubeAPI } from '@/app/hooks/useYouTubeAPI';
import { useYouTubePlayer } from '@/app/hooks/useYouTubePlayer';
import { extractYouTubeId } from '@/app/utils/youtube';

interface YouTubePlayerBaseProps {
  videos: VideoMetadata[];
  currentIndex: number;
  onVideoChange: (index: number) => void;
  autoPlay?: boolean;
}

export function YouTubePlayerBase({ 
  videos, 
  currentIndex, 
  onVideoChange, 
  autoPlay = true
}: YouTubePlayerBaseProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { loadAPI, isAPIReady } = useYouTubeAPI();
  
  const currentVideo = videos[currentIndex];
  const videoId = currentVideo ? extractYouTubeId(currentVideo.videoUrl) : '';

  const {
    playerState,
    containerRef,
    createPlayer,
    seekTo,
    togglePlay,
    setVolume,
    toggleMute
  } = useYouTubePlayer({
    videoId: videoId || '',
    autoPlay,
    onReady: () => setIsInitialized(true),
    onStateChange: (isPlaying) => {
      console.log('Video playing state:', isPlaying);
    },
    onError: (error) => {
      console.error('Player error:', error);
    }
  });

  // Initialize player when API is ready and video changes
  useEffect(() => {
    const initPlayer = async () => {
      if (!videoId) return;
      
      try {
        await loadAPI();
        
        if (isAPIReady()) {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            createPlayer();
          }, 100);
        }
      } catch (error) {
        console.error('Failed to initialize player:', error);
      }
    };

    initPlayer();
  }, [currentIndex, videoId, loadAPI, isAPIReady, createPlayer]);

  return {
    playerState,
    containerRef,
    seekTo,
    togglePlay,
    setVolume,
    toggleMute,
    currentVideo,
    isInitialized
  };
}