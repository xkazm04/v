'use client';

import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Slider } from '@/app/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { formatDuration } from '@/app/utils/format';

interface YouTubePlayerControlsProps {
  //@eslint-disable-next-line
  playerState: any;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  compact?: boolean;
}

export function YouTubePlayerControls({ 
  playerState, 
  onTogglePlay, 
  onSeek, 
  compact = false 
}: YouTubePlayerControlsProps) {
  const handleSeek = (value: number[]) => {
    onSeek(value[0]);
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2"
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-white hover:bg-white/10"
          onClick={onTogglePlay}
        >
          {playerState.isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" fill="currentColor" />
          )}
        </Button>
        
        <div className="text-white text-xs font-medium">
          {formatDuration(Math.floor(playerState.currentTime))} / {formatDuration(Math.floor(playerState.duration))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Progress Slider */}
      <div className="w-full">
        <Slider
          min={0}
          max={playerState.duration}
          step={1}
          value={[playerState.currentTime]}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={onTogglePlay}
          >
            {playerState.isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" fill="currentColor" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => onSeek(Math.max(0, playerState.currentTime - 10))}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => onSeek(Math.min(playerState.duration, playerState.currentTime + 10))}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            {playerState.isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
          
          <div className="text-white text-sm font-medium">
            {formatDuration(Math.floor(playerState.currentTime))} / {formatDuration(Math.floor(playerState.duration))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}