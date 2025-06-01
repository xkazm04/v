'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export interface YouTubePlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isPlayerReady: boolean;
  isLoading: boolean;
}

interface UseYouTubePlayerProps {
  videoId: string;
  autoPlay?: boolean;
  onReady?: () => void;
  onStateChange?: (isPlaying: boolean) => void;
  onError?: (error: any) => void;
}

export function useYouTubePlayer({
  videoId,
  autoPlay = false,
  onReady,
  onStateChange,
  onError
}: UseYouTubePlayerProps) {
  const [playerState, setPlayerState] = useState<YouTubePlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    isPlayerReady: false,
    isLoading: true
  });

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
        timeUpdateIntervalRef.current = null;
      }
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (error) {
          console.warn('Error destroying YouTube player:', error);
        }
      }
    };
  }, []);

  const onPlayerReady = useCallback((event: any) => {
    console.log('Player ready');
    try {
      const player = event.target;
      
      setPlayerState(prev => ({
        ...prev,
        duration: player.getDuration() || 0,
        volume: (player.getVolume() || 70) / 100,
        isPlayerReady: true,
        isLoading: false
      }));

      // Start time tracking
      const updateTime = () => {
        try {
          if (player && typeof player.getCurrentTime === 'function' && playerRef.current === player) {
            const currentTime = player.getCurrentTime() || 0;
            setPlayerState(prev => ({
              ...prev,
              currentTime: currentTime
            }));
          }
        } catch (error) {
          console.warn('Error getting current time:', error);
        }
      };

      // Clear existing interval
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }

      timeUpdateIntervalRef.current = setInterval(updateTime, 1000);
      
      onReady?.();
      console.log('Player successfully initialized');
    } catch (error) {
      console.error('Error in onPlayerReady:', error);
    }
  }, [onReady]);

  const onPlayerStateChange = useCallback((event: any) => {
    try {
      const state = event.data;
      const isPlaying = state === window.YT?.PlayerState?.PLAYING;
      
      console.log('Player state changed:', state, 'isPlaying:', isPlaying);
      
      setPlayerState(prev => ({
        ...prev,
        isPlaying: isPlaying
      }));

      onStateChange?.(isPlaying);
    } catch (error) {
      console.warn('Error in onPlayerStateChange:', error);
    }
  }, [onStateChange]);

  const onPlayerError = useCallback((event: any) => {
    console.error('YouTube Player Error:', event.data);
    setPlayerState(prev => ({ 
      ...prev, 
      isLoading: false,
      isPlayerReady: false 
    }));
    onError?.(event.data);
  }, [onError]);

  const createPlayer = useCallback(async () => {
    if (!containerRef.current || !videoId || !window.YT || !window.YT.Player) {
      console.error('Cannot create player: missing requirements');
      return;
    }

    try {
      // Destroy existing player
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying previous player:', error);
        }
        playerRef.current = null;
      }

      // Clear existing interval
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
        timeUpdateIntervalRef.current = null;
      }

      setPlayerState(prev => ({ ...prev, isLoading: true, isPlayerReady: false }));

      console.log('Creating YouTube player with video ID:', videoId);

      // Create new player
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: autoPlay ? 1 : 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError
        }
      });
    } catch (error) {
      console.error('Error creating YouTube player:', error);
      setPlayerState(prev => ({ ...prev, isLoading: false }));
    }
  }, [videoId, autoPlay, onPlayerReady, onPlayerStateChange, onPlayerError]);

  const seekTo = useCallback((time: number) => {
    if (!playerRef.current || !playerState.isPlayerReady) {
      console.warn('Player not ready for seeking');
      return;
    }

    try {
      if (typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(time, true);
        setPlayerState(prev => ({ ...prev, currentTime: time }));
      }
    } catch (error) {
      console.error('Error seeking to time:', error);
    }
  }, [playerState.isPlayerReady]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current || !playerState.isPlayerReady) {
      console.warn('Player not ready for play/pause');
      return;
    }

    try {
      if (playerState.isPlaying) {
        if (typeof playerRef.current.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
        }
      } else {
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      }
    } catch (error) {
      console.error('Error toggling play state:', error);
    }
  }, [playerState.isPlaying, playerState.isPlayerReady]);

  const setVolume = useCallback((volume: number) => {
    if (!playerRef.current || !playerState.isPlayerReady) {
      return;
    }

    try {
      if (typeof playerRef.current.setVolume === 'function') {
        playerRef.current.setVolume(volume * 100);
        setPlayerState(prev => ({ ...prev, volume }));
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  }, [playerState.isPlayerReady]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current || !playerState.isPlayerReady) {
      return;
    }

    try {
      if (playerState.isMuted) {
        if (typeof playerRef.current.unMute === 'function') {
          playerRef.current.unMute();
          setPlayerState(prev => ({ ...prev, isMuted: false }));
        }
      } else {
        if (typeof playerRef.current.mute === 'function') {
          playerRef.current.mute();
          setPlayerState(prev => ({ ...prev, isMuted: true }));
        }
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  }, [playerState.isMuted, playerState.isPlayerReady]);

  return {
    playerState,
    containerRef,
    createPlayer,
    seekTo,
    togglePlay,
    setVolume,
    toggleMute
  };
}