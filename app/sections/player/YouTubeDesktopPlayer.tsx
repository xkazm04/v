'use client';

import { motion } from 'framer-motion';
import { PlayerTimeline } from '@/app/sections/player/timeline/PlayerTimeline';
import { VideoInfoHeader } from '@/app/sections/player/VideoInfoHeader';
import { useState, useRef, useEffect } from 'react';
import { VideoWithTimestamps } from '@/app/types/video_api'; // Single import!
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface YouTubeDesktopPlayerProps {
  video: VideoWithTimestamps; // Direct usage!
  autoPlay?: boolean;
  onTimeUpdate?: (currentTime: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

export function YouTubeDesktopPlayer({ 
  video,
  autoPlay = false,
  onTimeUpdate,
  onPlayStateChange
}: YouTubeDesktopPlayerProps) {
  const { colors, isDark } = useLayoutTheme();
  const [showTimeline, setShowTimeline] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState(true);
  const playerRef = useRef<any>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Direct access to video properties - no conversion needed!
  const youtubeId = extractYouTubeId(video.video.video_url);

  useEffect(() => {
    if (!youtubeId) return;

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

      playerRef.current = new window.YT.Player('youtube-player-desktop', {
        height: '100%',
        width: '100%',
        videoId: youtubeId,
        playerVars: {
          autoplay: autoPlay ? 1 : 0,
          rel: 0,
          modestbranding: 1,
          controls: 1,
          playsinline: 1
        },
        events: {
          onReady: (event: any) => {
            console.log('YouTube player ready for:', video.video.title);
            setIsPlayerReady(true);
            setIsPlayerLoading(false);
          },
          onStateChange: (event: any) => {
            const playing = event.data === window.YT.PlayerState.PLAYING;
            setIsPlaying(playing);
            onPlayStateChange?.(playing);

            if (playing) {
              startTimeTracking();
            } else {
              stopTimeTracking();
            }
          },
        },
      });
    };

    initializePlayer();

    return () => {
      stopTimeTracking();
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [youtubeId, video.video.title, autoPlay, onPlayStateChange]);

  const startTimeTracking = () => {
    if (timeUpdateIntervalRef.current) return;

    timeUpdateIntervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);
        onTimeUpdate?.(time);
      }
    }, 1000);
  };

  const stopTimeTracking = () => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
  };

  const handleSeekToTimestamp = (timestamp: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(timestamp, true);
      setCurrentTime(timestamp);
      onTimeUpdate?.(timestamp);
    }
  };

  const containerColors = {
    background: isDark
      ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 50%, rgba(15, 23, 42, 0.98) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 50%, rgba(255, 255, 255, 0.98) 100%)',
    shadow: isDark
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(148, 163, 184, 0.1)'
      : '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(203, 213, 225, 0.2)',
    timelineBackground: isDark
      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.9) 100%)'
  };

  if (!youtubeId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl mx-auto"
      >
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Invalid YouTube URL</h3>
          <p className="text-red-600 dark:text-red-300">Could not extract video ID from: {video.video.video_url}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div 
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: containerColors.background,
          boxShadow: containerColors.shadow
        }}
      >
        <div className="relative aspect-video bg-black rounded-t-2xl overflow-hidden">
          <div id="youtube-player-desktop" className="w-full h-full" />
          
          {isPlayerLoading && (
            <motion.div 
              className="absolute inset-0 bg-black/80 flex items-center justify-center z-10"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-white text-center">
                <motion.div 
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p>Loading {video.video.title}...</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Direct usage - no conversion! */}
        <VideoInfoHeader video={video} />

        {showTimeline && isPlayerReady && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6"
            style={{
              background: containerColors.timelineBackground
            }}
          >
            <PlayerTimeline
              videoData={video} // Direct usage!
              onSeekToTimestamp={handleSeekToTimestamp}
              isListenMode={true}
              currentVideoTime={currentTime}
              syncMode="external"
              setShowTimeline={setShowTimeline}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}