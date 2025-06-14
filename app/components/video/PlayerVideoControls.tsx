'use client';

import { Button } from '@/app/components/ui/button';
import { Slider } from '@/app/components/ui/slider';
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
import { formatDuration } from '@/app/utils/format';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { motion } from 'framer-motion';
import { cn } from '@/app/lib/utils';

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isFullscreen: boolean;
  onSettings?: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  playerRef: React.RefObject<HTMLDivElement>;
  setCurrentTime: (time: number) => void;
  togglePlay: () => void;
  setIsMuted: (isMuted: boolean) => void;
  setVolume: (volume: number) => void;
}

const controlVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.1 },
  tap: { scale: 0.95 }
};

export function PlayerVideoControls({
  isPlaying,
  isMuted,
  volume,
  currentTime,
  duration,
  isFullscreen,
  onSettings,
  videoRef,
  playerRef,
  setCurrentTime,
  togglePlay,
  setIsMuted,
  setVolume
}: VideoControlsProps) {
  const { colors, mounted } = useLayoutTheme();

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

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = !isMuted;
    setIsMuted(!isMuted);
  };

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

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.currentTime = newTime;
    setCurrentTime(newTime);
  };

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

  const ControlButton = ({ 
    children, 
    onClick, 
    className 
  }: { 
    children: React.ReactNode; 
    onClick: () => void; 
    className?: string;
  }) => (
    <motion.div
      variants={buttonVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
    >
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn("transition-all duration-200", className)}
        style={{ 
          color: colors.foreground,
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${colors.primary}20`;
          e.currentTarget.style.color = colors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = colors.foreground;
        }}
        onClick={onClick}
      >
        {children}
      </Button>
    </motion.div>
  );

  return (
    <motion.div 
      className="space-y-2 p-4 rounded-lg backdrop-blur-md"
      style={{ 
        backgroundColor: `${colors.background}e6`, // 90% opacity
        border: `1px solid ${colors.border}80` // 50% opacity
      }}
      variants={controlVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Progress bar */}
      <div className="w-full">
        <Slider
          min={0}
          max={duration}
          step={0.1}
          value={[currentTime]}
          onValueChange={handleSeek}
          className="cursor-pointer w-full"
          style={{
            '--slider-track': colors.muted,
            '--slider-range': colors.primary,
            '--slider-thumb': colors.primary
          } as React.CSSProperties}
        />
        
        {/* Time indicators */}
        <div className="flex justify-between mt-1 text-xs" style={{ color: colors.mutedForeground }}>
          <span>{formatDuration(Math.floor(currentTime))}</span>
          <span>{formatDuration(Math.floor(duration))}</span>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ControlButton onClick={togglePlay}>
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </ControlButton>
          
          <ControlButton onClick={skipBackward}>
            <SkipBack className="h-5 w-5" />
          </ControlButton>
          
          <ControlButton onClick={skipForward}>
            <SkipForward className="h-5 w-5" />
          </ControlButton>
          
          <ControlButton onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </ControlButton>
          
          <div className="w-24 hidden sm:block">
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              className="cursor-pointer"
              style={{
                '--slider-track': colors.muted,
                '--slider-range': colors.primary,
                '--slider-thumb': colors.primary
              } as React.CSSProperties}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onSettings && (
            <ControlButton onClick={onSettings}>
              <Settings className="h-5 w-5" />
            </ControlButton>
          )}
          
          <ControlButton onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </ControlButton>
        </div>
      </div>
    </motion.div>
  );
}