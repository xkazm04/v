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

  // Load YouTube API
  useEffect(() => {
    if (!videoId) return;

    const loadYouTubeAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.body.appendChild(script);

        window.onYouTubeIframeAPIReady = () => resolve();
      });
    };

    const initializePlayer = async () => {
      await loadYouTubeAPI();

      if (!playerRef.current) return;

      ytPlayerRef.current = new window.YT.Player(playerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: autoPlay ? 1 : 0,
          rel: 0,
          modestbranding: 1,
          controls: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
          iv_load_policy: 3,
          cc_load_policy: 0,
        },
        events: {
          onReady: (event: any) => {
            console.log('YouTube Player Ready (Mobile Sync)');
            setIsReady(true);
          },
          onStateChange: (event: any) => {
            const playing = event.data === window.YT.PlayerState.PLAYING;
            setIsPlaying(playing);

            // Match desktop implementation exactly
            if (playing) {
              startTimeTracking();
            } else {
              stopTimeTracking();
            }
          },
          onError: (error: any) => {
            console.error('YouTube Player Error (Mobile):', error);
          }
        }
      });
    };

    initializePlayer();

    return () => {
      stopTimeTracking();
      if (ytPlayerRef.current && ytPlayerRef.current.destroy) {
        try {
          ytPlayerRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying player:', error);
        }
      }
    };
  }, [videoId, autoPlay]);

  // Match desktop implementation exactly - 1000ms interval
  const startTimeTracking = useCallback(() => {
    if (timeUpdateIntervalRef.current) return;

    timeUpdateIntervalRef.current = setInterval(() => {
      if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
        const time = ytPlayerRef.current.getCurrentTime();
        onTimeUpdate(time);
      }
    }, 1000); // Match desktop exactly - 1000ms
  }, [onTimeUpdate]);

  const stopTimeTracking = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
  }, []);

  // Handle seek requests - match desktop implementation
  const handleSeekToTimestamp = useCallback((timestamp: number) => {
    if (ytPlayerRef.current && ytPlayerRef.current.seekTo && isReady) {
      console.log('Mobile seeking to:', timestamp);
      ytPlayerRef.current.seekTo(timestamp, true);
    }
  }, [isReady]);

  // Handle seek requests from timeline
  useEffect(() => {
    if (onSeekRequest !== null && 
        onSeekRequest !== lastSeekRequestRef.current && 
        isReady) {
      
      handleSeekToTimestamp(onSeekRequest);
      lastSeekRequestRef.current = onSeekRequest;
    }
  }, [onSeekRequest, isReady, handleSeekToTimestamp]);

  return (
    <div className={className} style={{ position: 'relative' }}>
      <div 
        ref={playerRef} 
        className="w-full h-full"
        style={{ minHeight: '200px' }}
      />
      
      {/* Loading overlay */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
            <p className="text-lg font-medium">Loading Video...</p>
            <p className="text-sm text-white/70 mt-2">Syncing timeline</p>
          </div>
        </div>
      )}
      
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && isReady && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {isPlaying ? '▶️ Playing' : '⏸️ Paused'} | Mobile Sync
        </div>
      )}
    </div>
  );
}