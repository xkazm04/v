'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useTimelineAudioStore } from '@/app/stores/useTimelineAudioStore';

interface UseElevenLabsAudioOptions {
  autoPlay?: boolean;
  voiceId?: string;
  languageCode?: string;
  onPlayStart?: (title?: string) => void;
  onPlayEnd?: () => void;
  onError?: (error: string) => void;
  onTrackEnd?: () => void;
  // Add scroll utilities as parameters
  scrollToMilestone?: (milestoneId: string) => void;
  scrollToEvent?: (eventId: string, milestoneId: string) => void;
}

export function useElevenLabsAudio(options: UseElevenLabsAudioOptions = {}) {
  const {
    autoPlay = false,
    voiceId,
    languageCode,
    onPlayStart,
    onPlayEnd,
    onError,
    onTrackEnd,
    scrollToMilestone,
    scrollToEvent
  } = options;

  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  
  // Get store state and actions
  const {
    isPlaying,
    isLoading,
    duration,
    currentTime,
    progress,
    volume,
    isMuted,
    error,
    currentTrack,
    setPlaybackState,
    setProgress,
    setVolume: setStoreVolume,
    setMuted,
    setError,
    getNextTrack,
    playTrack: storePlayTrack
  } = useTimelineAudioStore();

  // Enhanced scroll-to-section function that uses proper timeline scroll methods
  const scrollToSection = useCallback((track: any) => {
    if (!track || !track.progressId) {
      console.warn('No track or progressId available for scrolling');
      return;
    }
    
    console.log('Scrolling to section for track:', track.title, 'type:', track.type, 'progressId:', track.progressId);
    
    // Determine track type and use appropriate scroll method
    if (track.type === 'milestone_context' && scrollToMilestone) {
      // For milestone contexts, progressId is the milestone ID
      scrollToMilestone(track.progressId);
    } else if (track.type === 'event' && scrollToEvent && track.milestoneId) {
      // For events, progressId is the event ID, and we have milestoneId
      scrollToEvent(track.progressId, track.milestoneId);
    }
    // For other types (conclusion/hero), fall back to basic scroll
    else {
      const element = document.getElementById(track.progressId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      } else {
        console.warn(`Element with ID "${track.progressId}" not found`);
      }
    }
  }, [scrollToMilestone, scrollToEvent]);

  // Generate audio from text using ElevenLabs API
  const generateAudio = useCallback(async (text: string, overrideVoiceId?: string, overrideLanguageCode?: string): Promise<string> => {
    try {
      setError(null);
      setPlaybackState({ isLoading: true });

      console.log('Generating audio for text:', text.substring(0, 100) + '...');

      // Build request payload with voice preference
      const requestPayload: any = { text };
      
      // Priority: override params > hook options > defaults
      if (overrideVoiceId || voiceId) {
        requestPayload.voiceId = overrideVoiceId || voiceId;
      } else if (overrideLanguageCode || languageCode) {
        requestPayload.languageCode = overrideLanguageCode || languageCode;
      }

      console.log('Audio generation request:', requestPayload);

      const response = await fetch('/api/elevenlabs/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      console.log('Audio blob received, size:', blob.size);
      
      // Get voice ID from response headers for logging
      const usedVoiceId = response.headers.get('X-Voice-ID');
      console.log('Used voice ID:', usedVoiceId);
      
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      console.log('Audio URL created:', url);
      return url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate audio';
      console.error('Audio generation error:', errorMessage);
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setPlaybackState({ isLoading: false });
    }
  }, [setError, setPlaybackState, onError, voiceId, languageCode]);

  // Play audio from URL
  const play = useCallback(async (url?: string) => {
    if (!audioRef.current) {
      console.error('Audio ref not available');
      return;
    }

    try {
      console.log('Playing audio:', url || audioRef.current.src);
      
      if (url) {
        audioRef.current.src = url;
      }
      
      if (!audioRef.current.src) {
        throw new Error('No audio source available');
      }

      // Wait for audio to load before playing
      await new Promise((resolve, reject) => {
        const audio = audioRef.current!;
        
        const handleCanPlay = () => {
          audio.removeEventListener('canplay', handleCanPlay);
          audio.removeEventListener('error', handleError);
          resolve(void 0);
        };
        
        const handleError = () => {
          audio.removeEventListener('canplay', handleCanPlay);
          audio.removeEventListener('error', handleError);
          reject(new Error('Audio failed to load'));
        };
        
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('error', handleError);
        
        audio.load();
      });

      await audioRef.current.play();
      setPlaybackState({ isPlaying: true });
      onPlayStart?.(currentTrack?.title || 'Unknown track');
      
      console.log('Audio playback started successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to play audio';
      console.error('Audio playback error:', errorMessage);
      setError(errorMessage);
      setPlaybackState({ isPlaying: false });
      onError?.(errorMessage);
    }
  }, [setPlaybackState, onPlayStart, onError, setError, currentTrack]);

  // Pause audio
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlaybackState({ isPlaying: false });
      console.log('Audio paused');
    }
  }, [setPlaybackState]);

  // Stop audio
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaybackState({ isPlaying: false });
      setProgress(0, audioRef.current.duration || 0);
      console.log('Audio stopped');
    }
  }, [setPlaybackState, setProgress]);

  // Generate and play audio in one step
  const generateAndPlay = useCallback(async (text: string, overrideVoiceId?: string, overrideLanguageCode?: string) => {
    try {
      console.log('Generating and playing audio...');
      const url = await generateAudio(text, overrideVoiceId, overrideLanguageCode);
      
      if (autoPlay) {
        await play(url);
      }
      return url;
    } catch (err) {
      console.error('Failed to generate and play audio:', err);
      throw err;
    }
  }, [generateAudio, play, autoPlay]);

  // Handle track ending and auto-advance
  const handleTrackEnd = useCallback(() => {
    console.log('Track ended');
    setPlaybackState({ isPlaying: false });
    onPlayEnd?.();
    onTrackEnd?.();
    
    // Auto-advance to next track if available
    if (currentTrack) {
      const nextTrack = getNextTrack(currentTrack.id);
      if (nextTrack) {
        console.log('Auto-advancing to next track:', nextTrack.title);
        
        // Scroll to the next section first
        scrollToSection(nextTrack);
        
        // Generate and play the next track
        generateAndPlay(nextTrack.text)
          .then(() => {
            storePlayTrack(nextTrack);
          })
          .catch(error => {
            console.error('Failed to auto-advance to next track:', error);
          });
      }
    }
  }, [setPlaybackState, onPlayEnd, onTrackEnd, currentTrack, getNextTrack, scrollToSection, generateAndPlay, storePlayTrack]);

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    setStoreVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  }, [setStoreVolume, isMuted]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setMuted(newMuted);
    if (audioRef.current) {
      audioRef.current.volume = newMuted ? 0 : volume;
    }
  }, [isMuted, volume, setMuted]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime, audio.duration);
    };

    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded, duration:', audio.duration);
      setProgress(audio.currentTime, audio.duration);
    };

    const handleEnded = () => {
      console.log('Audio ended event fired');
      handleTrackEnd();
    };

    const handleError = (e: Event) => {
      const errorMessage = 'Audio playback failed';
      console.error('Audio element error:', e);
      setError(errorMessage);
      setPlaybackState({ isPlaying: false });
      onError?.(errorMessage);
    };

    const handleLoadStart = () => {
      console.log('Audio load started');
    };

    const handleCanPlay = () => {
      console.log('Audio can play');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [handleTrackEnd, setProgress, setError, setPlaybackState, onError]);

  // Initialize volume when audio is ready
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return {
    audioRef,
    isLoading,
    isPlaying,
    duration,
    currentTime,
    progress,
    error,
    currentTrack,
    generateAudio,
    generateAndPlay,
    play,
    pause,
    stop,
    setVolume,
    toggleMute
  };
}