
import { VideoMetadata } from '@/app/types/video';
import { Video } from '../types/video_api';

export function transformVideoToMetadata(video: Video): VideoMetadata {
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
    let evaluation: 'Verified' | 'False' | 'Misleading' | 'Partial' | 'Unknown' = 'Unknown';
    
    if (video.verdict) {
      const verdict = video.verdict.toLowerCase();
      if (verdict.includes('true') || verdict.includes('verified') || verdict.includes('accurate')) {
        evaluation = 'Verified';
      } else if (verdict.includes('false') || verdict.includes('incorrect') || verdict.includes('debunked')) {
        evaluation = 'False';
      } else if (verdict.includes('misleading') || verdict.includes('deceptive')) {
        evaluation = 'Misleading';
      } else if (verdict.includes('partial') || verdict.includes('mixed')) {
        evaluation = 'Partial';
      }
    }

    return {
      evaluation,
      truthfulness: getScore(evaluation),
      transparency: Math.min(85 + Math.random() * 15, 100), // Mock transparency score
      research_quality: video.researched ? Math.min(80 + Math.random() * 20, 100) : 50,
      overall_score: getOverallScore(evaluation, video.researched)
    };
  };

  const getScore = (evaluation: string) => {
    switch (evaluation) {
      case 'Verified': return Math.min(85 + Math.random() * 15, 100);
      case 'Partial': return Math.min(60 + Math.random() * 25, 85);
      case 'Misleading': return Math.min(20 + Math.random() * 30, 50);
      case 'False': return Math.random() * 20;
      default: return 50;
    }
  };

  const getOverallScore = (evaluation: string, researched: boolean) => {
    const baseScore = getScore(evaluation);
    return researched ? baseScore : Math.max(baseScore * 0.7, 30);
  };

  return {
    id: getVideoId(video),
    title: video.title || 'Untitled Video',
    description: video.verdict || 'No description available',
    thumbnailUrl: getThumbnailUrl(video),
    duration: video.duration_seconds || 0,
    views: Math.floor(Math.random() * 1000000) + 10000, // Mock views
    likes: Math.floor(Math.random() * 10000) + 100, // Mock likes
    uploadDate: video.created_at,
    channelName: video.speaker_name || 'Unknown Speaker',
    channelAvatar: '/api/placeholder/avatar',
    category: video.source.charAt(0).toUpperCase() + video.source.slice(1),
    factCheck: getFactCheck(video),
    tags: [video.source, video.language_code || 'unknown'].filter(Boolean),
    url: getVideoUrl(video)
  };
}