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

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isFullscreen: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (value: number[]) => void;
  onSeek: (value: number[]) => void;
  onToggleFullscreen: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onSettings?: () => void;
}

export function PlayerVideoControls({
  isPlaying,
  isMuted,
  volume,
  currentTime,
  duration,
  isFullscreen,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onSeek,
  onToggleFullscreen,
  onSkipForward,
  onSkipBackward,
  onSettings
}: VideoControlsProps) {
  return (
    <div className="space-y-2">
      {/* Progress bar */}
      <div className="w-full">
        <Slider
          min={0}
          max={duration}
          step={0.1}
          value={[currentTime]}
          onValueChange={onSeek}
          className="cursor-pointer"
        />
      </div>
      
      {/* Control buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-white" onClick={onTogglePlay}>
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-white" onClick={onSkipBackward}>
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white" onClick={onSkipForward}>
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white" onClick={onToggleMute}>
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <div className="w-24 hidden sm:block">
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[isMuted ? 0 : volume]}
              onValueChange={onVolumeChange}
              className="cursor-pointer"
            />
          </div>
          <div className="text-white text-xs">
            {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-white" onClick={onSettings}>
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white" onClick={onToggleFullscreen}>
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}