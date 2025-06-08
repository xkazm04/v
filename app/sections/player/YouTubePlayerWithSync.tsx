'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { VideoWithTimestamps } from '@/app/types/video_api';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerWithSyncProps {
  videoId: string;
  videoData: VideoWithTimestamps;
  onTimeUpdate: (currentTime: number) => void;
  onSeekRequest?: number | null;
  autoPlay?: boolean;
  className?: string;
}

export function YouTubePlayerWithSync({
  videoId,
  videoData,
  onTimeUpdate,
  onSeekRequest,
  autoPlay = false,
  className = "w-full h-full"
}: YouTubePlayerWithSyncProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSeekRequestRef = useRef<number | null>(null);
  const isSeekingRef = useRef<boolean>(false);

  // Load YouTube API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initializePlayer();
      return;
    }

    // Load YouTube API script if not already loaded
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Set up API ready callback
    window.onYouTubeIframeAPIReady = initializePlayer;

    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
    };
  }, []);

  const initializePlayer = useCallback(() => {
    if (!playerRef.current || !window.YT?.Player) return;

    ytPlayerRef.current = new window.YT.Player(playerRef.current, {
      videoId: videoId,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: autoPlay ? 1 : 0,
        controls: 1,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError
      }
    });
  }, [videoId, autoPlay]);

  const onPlayerReady = useCallback((event: any) => {
    console.log('YouTube Player Ready');
    setIsReady(true);
    
    // Start time tracking immediately
    startTimeTracking();
  }, []);

  const onPlayerStateChange = useCallback((event: any) => {
    const playerState = event.data;
    
    console.log('Player state changed:', playerState);
    
    switch (playerState) {
      case window.YT.PlayerState.PLAYING:
        setIsPlaying(true);
        startTimeTracking();
        break;
      case window.YT.PlayerState.PAUSED:
        setIsPlaying(false);
        // Continue tracking even when paused for accurate position
        break;
      case window.YT.PlayerState.ENDED:
        setIsPlaying(false);
        stopTimeTracking();
        break;
      case window.YT.PlayerState.BUFFERING:
        // Keep tracking during buffering
        if (!timeUpdateIntervalRef.current) {
          startTimeTracking();
        }
        break;
    }
  }, []);

  const onPlayerError = useCallback((error: any) => {
    console.error('YouTube Player Error:', error);
  }, []);

  const startTimeTracking = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
    }

    timeUpdateIntervalRef.current = setInterval(() => {
      if (ytPlayerRef.current && isReady && !isSeekingRef.current) {
        try {
          const currentTime = ytPlayerRef.current.getCurrentTime();
          if (typeof currentTime === 'number' && !isNaN(currentTime)) {
            onTimeUpdate(currentTime);
          }
        } catch (error) {
          console.warn('Error getting current time:', error);
        }
      }
    }, 100); // Update every 100ms for smooth timeline
  }, [isReady, onTimeUpdate]);

  const stopTimeTracking = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
  }, []);

  // Handle seek requests from timeline
  useEffect(() => {
    if (onSeekRequest !== null && 
        onSeekRequest !== lastSeekRequestRef.current && 
        ytPlayerRef.current && 
        isReady) {
      
      console.log('Seeking to:', onSeekRequest);
      
      try {
        isSeekingRef.current = true;
        ytPlayerRef.current.seekTo(onSeekRequest, true);
        lastSeekRequestRef.current = onSeekRequest;
        
        // Reset seeking flag after a short delay
        setTimeout(() => {
          isSeekingRef.current = false;
        }, 500);
        
      } catch (error) {
        console.warn('Error seeking to time:', error);
        isSeekingRef.current = false;
      }
    }
  }, [onSeekRequest, isReady]);

  return (
    <div className={className} style={{ position: 'relative' }}>
      <div 
        ref={playerRef} 
        className="w-full h-full"
        style={{ minHeight: '200px' }}
      />
      
      {/* Loading overlay */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2 mx-auto"></div>
            <p className="text-sm">Loading player...</p>
          </div>
        </div>
      )}
    </div>
  );
}