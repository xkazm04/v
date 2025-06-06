'use client';

import { useState, useEffect } from 'react';
import { useYouTubeTimeTracker } from './useYouTubeTimeTracker';
import { useYouTubePostMessage } from './useYouTubePostMessage';
import { useVideoTimeEstimation } from './useVideoTimeEstimation';

export function useSmartTimeTracking(videoId: string, duration: number) {
  const hashTracker = useYouTubeTimeTracker(videoId);
  const postMessageTracker = useYouTubePostMessage(videoId);
  const estimationTracker = useVideoTimeEstimation(duration);

  // Prioritize the most accurate source available
  const [timeSource, setTimeSource] = useState<'hash' | 'postmessage' | 'estimation'>('estimation');
  
  useEffect(() => {
    if (hashTracker.isAvailable) {
      setTimeSource('hash');
    } else if (postMessageTracker.isAvailable) {
      setTimeSource('postmessage');
    } else {
      setTimeSource('estimation');
    }
  }, [hashTracker.isAvailable, postMessageTracker.isAvailable]);

  const getCurrentTime = () => {
    switch (timeSource) {
      case 'hash':
        return hashTracker.currentTime;
      case 'postmessage':
        return postMessageTracker.currentTime;
      case 'estimation':
        return estimationTracker.currentTime;
      default:
        return 0;
    }
  };

  return {
    currentTime: getCurrentTime(),
    isPlaying: estimationTracker.isPlaying,
    accuracy: timeSource,
    confidence: timeSource === 'hash' ? 100 : timeSource === 'postmessage' ? 80 : 60
  };
}