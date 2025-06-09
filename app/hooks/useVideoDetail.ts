'use client';

import { useState, useEffect } from 'react';
import { videoAPI } from '@/app/api/videos/videos';
import { VideoDetail } from '@/app/types/video_api';

interface UseVideoDetailResult {
  video: VideoDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useVideoDetail(videoId: string | null): UseVideoDetailResult {
  const [video, setVideo] = useState<VideoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideo = async () => {
    if (!videoId) {
      setVideo(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const videoData = await videoAPI.getVideoForPlayer(videoId);
      setVideo(videoData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load video';
      setError(errorMessage);
      console.error('Failed to fetch video detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  const refetch = async () => {
    await fetchVideo();
  };

  return {
    video,
    loading,
    error,
    refetch
  };
}