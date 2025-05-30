'use client';

import { useState, useEffect, useRef } from 'react';
import { VideoMetadata } from '@/app/types/video';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  SkipForward,
  SkipBack,
  Settings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/app/components/ui/slider';
import { Button } from '@/app/components/ui/button';
import { formatDuration } from '@/app/utils/format';

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
      
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
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

  // Control visibility of controls
  useEffect(() => {
    const hideControls = () => {
      if (!isPlaying) return;
      setShowControls(false);
    };

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (showControls) {
      controlsTimeoutRef.current = setTimeout(hideControls, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  // Toggle play/pause
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

  // Toggle mute
  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Change volume
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
      videoElement.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      videoElement.muted = false;
    }
  };

  // Seek to time
  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
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

  // Forward and backward
  const skipForward = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.currentTime = Math.min(videoElement.currentTime + 10, videoElement.duration);
  };

  const skipBackward = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.currentTime = Math.max(videoElement.currentTime - 10, 0);
  };

  return (
    <div 
      ref={playerRef}
      className="relative w-full rounded-lg overflow-hidden bg-black"
      onMouseMove={() => {
        setShowControls(true);
      }}
      onClick={() => {
        if (!showControls) {
          setShowControls(true);
        }
      }}
    >
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        className="w-full aspect-video object-contain"
        autoPlay={autoPlay}
        loop={false}
        playsInline
        muted={isMuted}
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
      />

      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex flex-col justify-between p-4"
          >
            {/* Top controls */}
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium truncate max-w-lg">{video.title}</h3>
              <Button variant="ghost" size="icon" className="text-white" onClick={() => {}}>
                <Settings className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Center play/pause button */}
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
                      className="h-16 w-16 rounded-full bg-black/30 border-white/20 text-white hover:bg-black/50 hover:text-white"
                      onClick={togglePlay}
                    >
                      <Play className="h-8 w-8" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom controls */}
            <div className="space-y-2">
              {/* Progress bar */}
              <div className="w-full">
                <Slider
                  min={0}
                  max={duration || video.duration}
                  step={0.1}
                  value={[currentTime]}
                  onValueChange={handleSeek}
                  className="cursor-pointer"
                />
              </div>
              
              {/* Control buttons */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="text-white" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white" onClick={skipBackward}>
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white" onClick={skipForward}>
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <div className="w-24 hidden sm:block">
                    <Slider
                      min={0}
                      max={1}
                      step={0.01}
                      value={[isMuted ? 0 : volume]}
                      onValueChange={handleVolumeChange}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="text-white text-xs">
                    {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration || video.duration))}
                  </div>
                </div>
                <div>
                  <Button variant="ghost" size="icon" className="text-white" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}