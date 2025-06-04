import { VideoMetadata } from '@/app/types/video';
import { Video } from '../types/video_api';

export function transformVideoToMetadata(video: Video | VideoMetadata): VideoMetadata {
  // If it's already VideoMetadata, return as-is
  if ('youtubeId' in video && 'factCheck' in video) {
    return video as VideoMetadata;
  }
  
  // Transform API Video to VideoMetadata
  const apiVideo = video as Video;

  // Generate YouTube-style URL if it's a YouTube video
  const getVideoUrl = (video: Video) => {
    if (video.source === 'youtube' && video.video_url.includes('watch?v=')) {
      return video.video_url;
    }
    return video.video_url;
  };

  // Extract video ID from URL
  const getVideoId = (video: Video) => {
    if (video.source === 'youtube') {
      const match = video.video_url.match(/[?&]v=([^&]+)/);
      return match ? match[1] : video.id;
    }
    return video.id;
  };

  // Get thumbnail URL (placeholder for now)
  const getThumbnailUrl = (video: Video) => {
    if (video.source === 'youtube') {
      const videoId = getVideoId(video);
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    // Return placeholder for other sources
    return '/api/placeholder/video-thumbnail';
  };

  // Transform fact check data
  const getFactCheck = (video: Video) => {
    let evaluation: 'Fact' | 'Mislead' | 'Lie' | 'Unverified' = 'Unverified';
    
    if (video.verdict) {
      const verdict = video.verdict.toLowerCase();
      if (verdict.includes('true') || verdict.includes('verified') || verdict.includes('accurate')) {
        evaluation = 'Fact';
      } else if (verdict.includes('false') || verdict.includes('incorrect') || verdict.includes('debunked')) {
        evaluation = 'Lie';
      } else if (verdict.includes('misleading') || verdict.includes('deceptive')) {
        evaluation = 'Mislead';
      }
    }

    return {
      evaluation,
      truthPercentage: getScore(evaluation),
      neutralPercentage: Math.floor(Math.random() * 20) + 5,
      misleadingPercentage: Math.floor(Math.random() * 15) + 5,
      totalClaims: Math.floor(Math.random() * 15) + 5,
      verifiedClaims: Math.floor(Math.random() * 10) + 3,
      sources: Math.floor(Math.random() * 20) + 5,
      confidence: apiVideo.researched ? Math.min(80 + Math.random() * 20, 100) : 50
    };
  };

  const getScore = (evaluation: string) => {
    switch (evaluation) {
      case 'Fact': return Math.min(80 + Math.random() * 20, 100);
      case 'Mislead': return Math.min(40 + Math.random() * 30, 70);
      case 'Lie': return Math.random() * 25;
      default: return 50;
    }
  };

  return {
    id: getVideoId(apiVideo),
    title: apiVideo.title || 'Untitled Video',
    description: apiVideo.verdict || 'No description available',
    thumbnailUrl: getThumbnailUrl(apiVideo),
    videoUrl: getVideoUrl(apiVideo),
    duration: apiVideo.duration_seconds || 0,
    views: Math.floor(Math.random() * 1000000) + 10000, // Mock views
    likes: Math.floor(Math.random() * 10000) + 100, // Mock likes
    uploadDate: apiVideo.created_at,
    channelName: apiVideo.speaker_name || 'Unknown Speaker',
    category: (apiVideo.source.charAt(0).toUpperCase() + apiVideo.source.slice(1)) as any,
    factCheck: getFactCheck(apiVideo),
    tags: [apiVideo.source, apiVideo.language_code || 'unknown'].filter(Boolean),
    youtubeId: getVideoId(apiVideo)
  };
}