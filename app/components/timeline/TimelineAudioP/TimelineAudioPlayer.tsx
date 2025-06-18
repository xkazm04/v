'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Loader2, SkipForward, SkipBack } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { useElevenLabsAudio } from '@/app/hooks/useElevenLabsAudio';
import { useTimelineAudioStore } from '@/app/stores/useTimelineAudioStore';
import { Timeline } from '@/app/types/timeline';
import { useCallback, useState, useEffect } from 'react';

interface TimelineAudioPlayerProps {
  timeline: Timeline;
}

export default function TimelineAudioPlayer({ timeline }: TimelineAudioPlayerProps) {
  const { colors, isDark } = useLayoutTheme();
  const { isMobile, isDesktop } = useViewport();
  const [localVolume, setLocalVolume] = useState(0.7);
  
  // Store state and actions
  const {
    currentTrack,
    currentTrackIndex,
    tracks,
    isPlaying,
    isLoading,
    duration,
    currentTime,
    progress,
    volume,
    isMuted,
    error,
    initializeTracklist,
    setCurrentTrack,
    nextTrack,
    previousTrack
  } = useTimelineAudioStore();
  
  const {
    audioRef,
    generateAndPlay,
    play,
    pause,
    setVolume,
    toggleMute
  } = useElevenLabsAudio({
    autoPlay: true,
    onPlayStart: () => console.log('🎵 Playing:', currentTrack?.title),
    onPlayEnd: () => console.log('🎵 Finished:', currentTrack?.title),
    onError: (error) => console.error('🚨 Audio error:', error),
    onTrackEnd: () => console.log('🎵 Track ended, checking for next...')
  });

  // Initialize tracklist when component mounts
  useEffect(() => {
    initializeTracklist(timeline);
  }, [timeline, initializeTracklist]);

  // Handle play/pause toggle
  const handlePlayToggle = useCallback(async () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      pause();
    } else if (audioRef.current?.src) {
      play();
    } else {
      // Generate and play current track
      await generateAndPlay(currentTrack.text);
    }
  }, [isPlaying, currentTrack, pause, play, generateAndPlay, audioRef]);
  
  // Handle track navigation
  const handleNextTrack = useCallback(() => {
    nextTrack();
  }, [nextTrack]);
  
  const handlePreviousTrack = useCallback(() => {
    previousTrack();
  }, [previousTrack]);
  
  // Handle volume changes
  const handleVolumeChange = useCallback((newVolume: number) => {
    setLocalVolume(newVolume);
    setVolume(newVolume);
  }, [setVolume]);
  
  // Format time for display
  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);
  
  // Container styles
  const containerStyle = {
    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(248, 250, 252, 0.95)',
    borderColor: colors.border,
    backdropFilter: 'blur(12px)',
  };
  
  // Button styles
  const buttonStyle = {
    backgroundColor: isPlaying ? colors.primary : 'transparent',
    borderColor: colors.primary,
    color: isPlaying ? 'white' : colors.primary
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none" />
      
      {/* Audio Player UI */}
      <motion.div
        className={`fixed top-6 left-6 z-50 ${isMobile ? 'w-72' : 'w-96'}`}
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="rounded-2xl border shadow-xl overflow-hidden"
          style={containerStyle}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b" style={{ borderColor: colors.border + '30' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                  animate={{ 
                    opacity: isPlaying ? [0.4, 1, 0.4] : 1,
                    scale: isPlaying ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0 }}
                />
                <span className="text-sm font-medium" style={{ color: colors.foreground }}>
                  Timeline Audio
                </span>
              </div>
              
              {/* Track counter */}
              {tracks.length > 0 && (
                <span className="text-xs" style={{ color: colors.foreground + '60' }}>
                  {currentTrackIndex + 1} / {tracks.length}
                </span>
              )}
            </div>
          </div>
          
          {/* Track Info */}
          {currentTrack && (
            <div className="px-4 py-2 border-b" style={{ borderColor: colors.border + '20' }}>
              <div className="text-sm font-medium truncate" style={{ color: colors.foreground }}>
                {currentTrack.title}
              </div>
              <div className="text-xs" style={{ color: colors.foreground + '60' }}>
                {currentTrack.type === 'conclusion' ? 'Timeline Summary' : 
                 currentTrack.type === 'milestone_context' ? 'Context' : 
                 'Content'}
              </div>
            </div>
          )}
          
          {/* Main Controls */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              {/* Previous Track Button */}
              <motion.button
                onClick={handlePreviousTrack}
                disabled={currentTrackIndex === 0}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  currentTrackIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 hover:bg-opacity-10'
                }`}
                style={{ 
                  backgroundColor: currentTrackIndex === 0 ? 'transparent' : colors.primary + '10',
                  color: colors.primary 
                }}
                whileHover={{ scale: currentTrackIndex === 0 ? 1 : 1.05 }}
                whileTap={{ scale: currentTrackIndex === 0 ? 1 : 0.95 }}
              >
                <SkipBack className="w-4 h-4" />
              </motion.button>
              
              {/* Play/Pause Button */}
              <motion.button
                onClick={handlePlayToggle}
                disabled={isLoading || !currentTrack}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  isLoading || !currentTrack ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'
                }`}
                style={buttonStyle}
                whileHover={{ scale: isLoading || !currentTrack ? 1 : 1.05 }}
                whileTap={{ scale: isLoading || !currentTrack ? 1 : 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, rotate: 0 }}
                      animate={{ opacity: 1, rotate: 360 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </motion.div>
                  ) : isPlaying ? (
                    <motion.div
                      key="pause"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Pause className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Play className="w-5 h-5 ml-0.5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              
              {/* Next Track Button */}
              <motion.button
                onClick={handleNextTrack}
                disabled={currentTrackIndex >= tracks.length - 1}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  currentTrackIndex >= tracks.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 hover:bg-opacity-10'
                }`}
                style={{ 
                  backgroundColor: currentTrackIndex >= tracks.length - 1 ? 'transparent' : colors.primary + '10',
                  color: colors.primary 
                }}
                whileHover={{ scale: currentTrackIndex >= tracks.length - 1 ? 1 : 1.05 }}
                whileTap={{ scale: currentTrackIndex >= tracks.length - 1 ? 1 : 0.95 }}
              >
                <SkipForward className="w-4 h-4" />
              </motion.button>
              
              {/* Progress Info */}
              <div className="flex-1 min-w-0">
                {/* Progress Bar */}
                {duration > 0 && (
                  <div className="relative">
                    <div 
                      className="h-1 rounded-full"
                      style={{ backgroundColor: colors.border }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: colors.primary,
                          width: `${progress}%`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    
                    {/* Time Display */}
                    <div className="flex justify-between text-xs mt-1" style={{ color: colors.foreground + '60' }}>
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                )}
                
                {duration === 0 && currentTrack && (
                  <div className="text-xs" style={{ color: colors.foreground + '80' }}>
                    Ready to play
                  </div>
                )}
              </div>
              
              {/* Volume Control */}
              {!isMobile && (
                <div className="flex items-center gap-2 ml-3">
                  <motion.button
                    onClick={toggleMute}
                    className="p-1 rounded hover:opacity-70"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" style={{ color: colors.foreground + '60' }} />
                    ) : (
                      <Volume2 className="w-4 h-4" style={{ color: colors.foreground + '60' }} />
                    )}
                  </motion.button>
                  
                  <div className="w-16">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : localVolume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-full h-1 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.primary} ${(isMuted ? 0 : localVolume) * 100}%, ${colors.border} ${(isMuted ? 0 : localVolume) * 100}%, ${colors.border} 100%)`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-3"
              >
                <div 
                  className="text-xs p-2 rounded border"
                  style={{
                    backgroundColor: '#ef444420',
                    borderColor: '#ef4444',
                    color: '#ef4444'
                  }}
                >
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}