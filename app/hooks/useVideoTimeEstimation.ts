'use client';

import { useState, useEffect, useRef } from 'react';

export function useVideoTimeEstimation(duration: number) {
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  // Smart estimation when video is likely playing
  useEffect(() => {
    if (!isVisible || !isPlaying) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const newTime = Math.min(pausedTimeRef.current + elapsed, duration);
      setEstimatedTime(newTime);
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible, isPlaying, duration]);

  // Detect visibility changes
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          startTimeRef.current = Date.now();
          setIsPlaying(true); // Assume playing when visible
        } else {
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    const videoElement = document.querySelector('iframe[src*="youtube"]');
    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => observer.disconnect();
  }, []);

  // Detect user interactions (click = likely play/pause)
  useEffect(() => {
    const handleClick = () => {
      if (isVisible) {
        setIsPlaying(prev => {
          if (prev) {
            pausedTimeRef.current = estimatedTime;
          } else {
            startTimeRef.current = Date.now();
          }
          return !prev;
        });
      }
    };

    const iframe = document.querySelector('iframe[src*="youtube"]');
    if (iframe) {
      iframe.addEventListener('click', handleClick);
      return () => iframe.removeEventListener('click', handleClick);
    }
  }, [isVisible, estimatedTime]);

  return {
    currentTime: estimatedTime,
    isPlaying,
    isVisible,
    accuracy: isVisible ? 'estimated' : 'paused'
  };
}