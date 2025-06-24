import { motion } from 'framer-motion';
import { VideoInfoHeader } from '@/app/sections/player/VideoInfoHeader'; // ✅ RESTORED
import { useState, useRef, useEffect } from 'react';
import { Video } from '@/app/types/video_api';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface YouTubeDesktopPlayerProps {
  video: Video;
  autoPlay?: boolean;
  onTimeUpdate?: (currentTime: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onSeek?: (timestamp: number) => void;
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
  onPlayStateChange,
  onSeek
}: YouTubeDesktopPlayerProps) {
  const { isDark } = useLayoutTheme();
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState(true);
  const playerRef = useRef<any>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const youtubeId = extractYouTubeId(video.video_url);

  useEffect(() => {
    if (!youtubeId) return;

    const loadYouTubeAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve();
          return;
        }

        const existingScript = document.getElementById('youtube-api');
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve());
          return;
        }

        const script = document.createElement('script');
        script.id = 'youtube-api';
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        
        window.onYouTubeIframeAPIReady = () => {
          resolve();
        };
        
        document.head.appendChild(script);
      });
    };

    const initializePlayer = async () => {
      try {
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
            playsinline: 1,
            fs: 1,
            cc_load_policy: 1,
            iv_load_policy: 3,
            enablejsapi: 1
          },
          events: {
            onReady: (event: any) => {
              console.log('YouTube player ready');
              setIsPlayerReady(true);
              setIsPlayerLoading(false);
            },
            onStateChange: (event: any) => {
              const playerState = event.data;
              const playing = playerState === window.YT.PlayerState.PLAYING;
              
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
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
        setIsPlayerLoading(false);
      }
    };

    initializePlayer();

    return () => {
      stopTimeTracking();
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying YouTube player:', error);
        }
      }
    };
  }, [youtubeId, video.title, autoPlay, onPlayStateChange]);

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
      onSeek?.(timestamp);
    }
  };

  const containerColors = {
    background: isDark
      ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 50%, rgba(15, 23, 42, 0.98) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 50%, rgba(255, 255, 255, 0.98) 100%)',
    shadow: isDark
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(148, 163, 184, 0.1)'
      : '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(203, 213, 225, 0.2)'
  };

  if (!youtubeId) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">❌</div>
          <p className="text-muted-foreground">
            Invalid YouTube URL: {video.video_url}
          </p>
        </div>
      </div>
    );
  }

  if (isPlayerLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading video player...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* ✅ RESTORED: Video Info Header */}
      <VideoInfoHeader video={video} />
      
      {/* Video Player Container */}
      <div 
        className="relative w-full aspect-video rounded-b-lg overflow-hidden"
        style={{
          background: containerColors.background,
          boxShadow: containerColors.shadow
        }}
      >
        <div id="youtube-player-desktop" className="w-full h-full" />
        
        {/* Loading Overlay */}
        {isPlayerLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Loading...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}