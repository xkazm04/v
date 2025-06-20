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
        controls: 1, // Keep controls visible for mobile accessibility
        rel: 0, // Don't show related videos
        modestbranding: 1, // Reduce YouTube branding
        playsinline: 1, // Play inline on iOS
        enablejsapi: 1, // Enable JavaScript API
        origin: window.location.origin,
        iv_load_policy: 3, // Hide video annotations
        cc_load_policy: 0, // Don't show captions by default
        disablekb: 0, // Allow keyboard controls
        fs: 1, // Allow fullscreen
        hl: 'en', 
        color: 'white', 
        showinfo: 0, 
        end: videoData.video.duration_seconds || undefined, 
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError
      }
    });
  }, [videoId, autoPlay, videoData.video.duration_seconds]);

  const onPlayerReady = useCallback((event: any) => {
    console.log('YouTube Player Ready - Mobile Sync Mode');
    setIsReady(true);
    
    // Start time tracking immediately for better sync
    startTimeTracking();
    
    // Set quality to auto for better mobile performance
    try {
      if (ytPlayerRef.current?.setPlaybackQuality) {
        ytPlayerRef.current.setPlaybackQuality('auto');
      }
    } catch (error) {
      console.warn('Could not set playback quality:', error);
    }
  }, []);

  const onPlayerStateChange = useCallback((event: any) => {
    const playerState = event.data;
    
    console.log('Player state changed (Mobile):', playerState);
    
    switch (playerState) {
      case window.YT.PlayerState.PLAYING:
        setIsPlaying(true);
        startTimeTracking();
        break;
      case window.YT.PlayerState.PAUSED:
        setIsPlaying(false);
        // Continue tracking even when paused for accurate timeline position
        break;
      case window.YT.PlayerState.ENDED:
        setIsPlaying(false);
        stopTimeTracking();
        break;
      case window.YT.PlayerState.BUFFERING:
        // Keep tracking during buffering for smooth timeline updates
        if (!timeUpdateIntervalRef.current) {
          startTimeTracking();
        }
        break;
      case window.YT.PlayerState.CUED:
        // Video is cued and ready to play
        if (autoPlay) {
          setTimeout(() => {
            try {
              ytPlayerRef.current?.playVideo();
            } catch (error) {
              console.warn('Error auto-playing video:', error);
            }
          }, 100);
        }
        break;
    }
  }, [autoPlay]);

  const onPlayerError = useCallback((error: any) => {
    console.error('YouTube Player Error (Mobile):', error);
    // Handle common error codes
    switch (error.data) {
      case 2:
        console.error('Invalid video ID');
        break;
      case 5:
        console.error('HTML5 player error');
        break;
      case 100:
        console.error('Video not found or private');
        break;
      case 101:
      case 150:
        console.error('Video not available for embedded playback');
        break;
    }
  }, []);

  const startTimeTracking = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
    }

    // Use more frequent updates for better mobile timeline sync (50ms = 20fps)
    timeUpdateIntervalRef.current = setInterval(() => {
      if (ytPlayerRef.current && isReady && !isSeekingRef.current) {
        try {
          const currentTime = ytPlayerRef.current.getCurrentTime();
          if (typeof currentTime === 'number' && !isNaN(currentTime)) {
            onTimeUpdate(currentTime);
          }
        } catch (error) {
          console.warn('Error getting current time (Mobile):', error);
        }
      }
    }, 50); // Faster updates for smoother mobile timeline
  }, [isReady, onTimeUpdate]);

  const stopTimeTracking = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
  }, []);

  // Handle seek requests from timeline with better mobile handling
  useEffect(() => {
    if (onSeekRequest !== null && 
        onSeekRequest !== lastSeekRequestRef.current && 
        ytPlayerRef.current && 
        isReady) {
      
      console.log('Mobile seeking to:', onSeekRequest);
      
      try {
        isSeekingRef.current = true;
        
        // Pause briefly to ensure smooth seeking on mobile
        const wasPlaying = isPlaying;
        if (wasPlaying) {
          ytPlayerRef.current.pauseVideo();
        }
        
        // Perform the seek
        ytPlayerRef.current.seekTo(onSeekRequest, true);
        lastSeekRequestRef.current = onSeekRequest ?? null;
        
        // Resume playback if it was playing
        setTimeout(() => {
          if (wasPlaying) {
            ytPlayerRef.current.playVideo();
          }
          isSeekingRef.current = false;
        }, 200); // Slightly longer delay for mobile stability
        
      } catch (error) {
        console.warn('Error seeking to time (Mobile):', error);
        isSeekingRef.current = false;
      }
    }
  }, [onSeekRequest, isReady, isPlaying]);

  // Clean up on video change
  useEffect(() => {
    return () => {
      stopTimeTracking();
      if (ytPlayerRef.current?.destroy) {
        try {
          ytPlayerRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying player:', error);
        }
      }
    };
  }, [videoId]);

  return (
    <div className={className} style={{ position: 'relative' }}>
      <div 
        ref={playerRef} 
        className="w-full h-full"
        style={{ minHeight: '200px' }}
      />
      
      {/* Enhanced loading overlay for mobile */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
            <p className="text-lg font-medium">Loading Video...</p>
            <p className="text-sm text-white/70 mt-2">Preparing timeline sync</p>
          </div>
        </div>
      )}
      
      {/* Sync status indicator for debugging (remove in production) */}
      {isReady && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {isPlaying ? '▶️ Playing' : '⏸️ Paused'} | Sync: {isSeekingRef.current ? 'Seeking' : 'Active'}
        </div>
      )}
    </div>
  );
}