'use client';

import { useState, useEffect, useRef } from 'react';
import { VideoMetadata } from '@/app/types/video';
import { Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { PlayerVideoControls } from '../../components/video/PlayerVideoControls';
import { PlayerTimeline } from './PlayerTimeline';

interface VideoPlayerProps {
  video: VideoMetadata;
  autoPlay?: boolean;
}

export function VideoPlayer({ video, autoPlay = false }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showFactCheck, setShowFactCheck] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load video metadata
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleLoadedMetadata = () => {
        setDuration(videoElement.duration);
      };
      
      const handleWaiting = () => setIsBuffering(true);
      const handleCanPlay = () => setIsBuffering(false);
      
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('waiting', handleWaiting);
      videoElement.addEventListener('canplay', handleCanPlay);
      
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('waiting', handleWaiting);
        videoElement.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  // Handle time updates
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleTimeUpdate = () => {
        setCurrentTime(videoElement.currentTime);
      };
      
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  // Control visibility logic
  useEffect(() => {
    const hideControls = () => {
      if (isPlaying) setShowControls(false);
    };

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (showControls && isPlaying) {
      controlsTimeoutRef.current = setTimeout(hideControls, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);


    const togglePlay = () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    };

  const handleSeekToTimestamp = (timestamp: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    videoElement.currentTime = timestamp;
    setCurrentTime(timestamp);
    
    // Auto-play if paused
    if (!isPlaying) {
      videoElement.play();
      setIsPlaying(true);
    }
  };

  // Update fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Hide fact-check in fullscreen
  useEffect(() => {
    setShowFactCheck(!isFullscreen);
  }, [isFullscreen]);

  return (
    <motion.div 
      className="relative w-full bg-black rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Video Player Container - Fixed sizing, no more dynamic changes */}
      <div 
        ref={playerRef}
        className="relative w-full bg-black aspect-video"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          className="w-full h-full object-contain"
          autoPlay={autoPlay}
          playsInline
          muted={isMuted}
          onClick={togglePlay}
        />

        {/* Loading indicator */}
        <AnimatePresence>
          {isBuffering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30"
            >
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showControls && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex flex-col justify-between p-4"
            >
              {/* Top info bar */}
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium text-base max-w-lg truncate">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 text-white text-xs">
                  <span className="bg-black/50 px-2 py-1 rounded">
                    {video.category}
                  </span>
                </div>
              </div>
              
              {/* Center play button */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pointer-events-auto"
                    >
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-16 w-16 rounded-full bg-black/30 border-white/20 text-white hover:bg-black/50"
                        onClick={togglePlay}
                      >
                        <Play className="h-8 w-8" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom controls */}
              <div>
                <PlayerVideoControls
                  isPlaying={isPlaying}
                  isMuted={isMuted}
                  volume={volume}
                  currentTime={currentTime}
                  duration={duration || video.duration}
                  isFullscreen={isFullscreen}
                  setCurrentTime={setCurrentTime}
                  togglePlay={togglePlay}
                  setIsMuted={setIsMuted}
                  setVolume={setVolume}
                  videoRef={videoRef}
                  playerRef={playerRef}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fact-Check Timeline - Positioned at bottom, no layout changes */}
      <AnimatePresence>
        {showFactCheck && !isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <PlayerTimeline
              factCheck={video.factCheck}
              videoDuration={duration || video.duration}
              onSeekToTimestamp={handleSeekToTimestamp}
              onExpansionChange={() => {}} // No longer needed but keep for compatibility
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}