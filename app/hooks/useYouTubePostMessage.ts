'use client';

import { useState, useEffect } from 'react';

export function useYouTubePostMessage(videoId: string) {
  const [timeData, setTimeData] = useState({
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    isAvailable: false
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // YouTube sometimes sends postMessage updates
      if (event.origin !== 'https://www.youtube.com') return;
      
      try {
        const data = JSON.parse(event.data);
        
        // YouTube's internal message format (varies)
        if (data.info?.currentTime !== undefined) {
          setTimeData(prev => ({
            ...prev,
            currentTime: data.info.currentTime,
            duration: data.info.duration || prev.duration,
            isPlaying: data.info.playerState === 1,
            isAvailable: true
          }));
        }
      } catch (e) {
        // Ignore malformed messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [videoId]);

  return timeData;
}