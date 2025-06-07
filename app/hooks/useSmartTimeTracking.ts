'use client';

import { useState, useEffect, useRef } from 'react';

interface TimeTrackingState {
  currentTime: number;
  accuracy: 'High' | 'Medium' | 'Low' | 'Detecting...';
  confidence: number;
  isTracking: boolean;
}

export function useSmartTimeTracking(videoId: string, duration: number) {
  const [state, setState] = useState<TimeTrackingState>({
    currentTime: 0,
    accuracy: 'Detecting...',
    confidence: 0,
    isTracking: false
  });

  const intervalRef = useRef<NodeJS.Timeout>(null);
  const startTimeRef = useRef<number>(Date.now());
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    // Start tracking when component mounts
    startTimeRef.current = Date.now();
    setState(prev => ({ ...prev, isTracking: true }));

    // Simulate smart time tracking with increasing accuracy
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Simulate accuracy detection based on tracking duration
      let accuracy: 'High' | 'Medium' | 'Low' | 'Detecting...' = 'Detecting...';
      let confidence = 0;

      if (elapsed > 5) {
        accuracy = 'High';
        confidence = Math.min(85 + Math.random() * 10, 95);
      } else if (elapsed > 2) {
        accuracy = 'Medium';
        confidence = Math.min(70 + Math.random() * 10, 80);
      } else if (elapsed > 1) {
        accuracy = 'Low';
        confidence = Math.min(50 + Math.random() * 15, 65);
      }

      setState(prev => ({
        ...prev,
        currentTime: elapsed,
        accuracy,
        confidence: Math.round(confidence)
      }));

      lastUpdateRef.current = elapsed;
    }, 100); // Update every 100ms for smooth tracking

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [videoId, duration]);

  // Method to sync with external video time
  const syncWithVideoTime = (videoTime: number) => {
    const currentElapsed = (Date.now() - startTimeRef.current) / 1000;
    const drift = Math.abs(videoTime - currentElapsed);
    
    // Adjust accuracy based on drift
    let newAccuracy: 'High' | 'Medium' | 'Low' = 'High';
    if (drift > 2) newAccuracy = 'Low';
    else if (drift > 1) newAccuracy = 'Medium';

    setState(prev => ({
      ...prev,
      currentTime: videoTime,
      accuracy: newAccuracy,
      confidence: newAccuracy === 'High' ? 95 : newAccuracy === 'Medium' ? 75 : 55
    }));

    // Reset start time for future tracking
    startTimeRef.current = Date.now() - (videoTime * 1000);
  };

  return {
    ...state,
    syncWithVideoTime
  };
}