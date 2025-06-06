'use client';

import { useState, useEffect, useCallback } from 'react';

interface YouTubeTimeTracker {
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  isAvailable: boolean;
}

export function useYouTubeTimeTracker(videoId: string): YouTubeTimeTracker {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    // Method 1: Monitor URL hash changes
    const trackHashChanges = () => {
      const hash = window.location.hash;
      const timeMatch = hash.match(/[?&]t=(\d+)/);
      if (timeMatch) {
        setCurrentTime(parseInt(timeMatch[1]));
        setIsAvailable(true);
      }
    };

    // Method 2: Try to access YouTube's internal state (if available)
    const tryYouTubeInternals = () => {
      try {
        // YouTube sometimes exposes player state in global scope
        const ytPlayer = (window as any).ytInitialPlayerResponse;
        if (ytPlayer?.videoDetails) {
          setDuration(parseInt(ytPlayer.videoDetails.lengthSeconds));
          setIsAvailable(true);
        }
      } catch (e) {
        // Silently fail - this is expected in most cases
      }
    };

    // Method 3: Observe DOM changes for YouTube's native progress bar
    const observeProgressBar = () => {
      const progressBar = document.querySelector('.ytp-progress-bar-container .ytp-progress-bar');
      if (progressBar) {
        const observer = new MutationObserver(() => {
          const progressElement = progressBar.querySelector('.ytp-play-progress');
          if (progressElement) {
            const style = window.getComputedStyle(progressElement);
            const transform = style.transform;
            // Parse transform to get progress percentage
            const scaleMatch = transform.match(/scaleX\(([\d.]+)\)/);
            if (scaleMatch && duration > 0) {
              const progress = parseFloat(scaleMatch[1]);
              setCurrentTime(progress * duration);
              setIsAvailable(true);
            }
          }
        });

        observer.observe(progressBar, { 
          attributes: true, 
          childList: true, 
          subtree: true 
        });

        return () => observer.disconnect();
      }
    };

    // Try all methods
    trackHashChanges();
    tryYouTubeInternals();
    const cleanup = observeProgressBar();

    window.addEventListener('hashchange', trackHashChanges);
    window.addEventListener('popstate', trackHashChanges);

    return () => {
      window.removeEventListener('hashchange', trackHashChanges);
      window.removeEventListener('popstate', trackHashChanges);
      cleanup?.();
    };
  }, [videoId, duration]);

  return { currentTime, isPlaying, duration, isAvailable };
}