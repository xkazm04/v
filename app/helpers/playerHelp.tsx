import { VideoTimestamp } from '@/app/types/video_api';

// Get segment color based on category from backend
export const getSegmentColor = (type: 'truth' | 'neutral' | 'lie'): string => {
  switch (type) {
    case 'truth':
      return 'bg-green-500/80 hover:bg-green-400';
    case 'lie':
      return 'bg-red-500/80 hover:bg-red-400';
    case 'neutral':
    default:
      return 'bg-yellow-500/80 hover:bg-yellow-400';
  }
};

// Convert backend category to UI segment type
export const getSegmentTypeFromCategory = (category: string | null): 'truth' | 'neutral' | 'lie' => {
  if (!category) return 'neutral';
  
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('factual') || lowerCategory.includes('true')) {
    return 'truth';
  }
  
  if (lowerCategory.includes('false') || lowerCategory.includes('misleading')) {
    return 'lie';
  }
  
  return 'neutral';
};

// Format timestamp duration
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Calculate percentage of video duration
export const getTimelinePercentage = (timestamp: number, totalDuration: number): number => {
  return Math.min(Math.max((timestamp / totalDuration) * 100, 0), 100);
};

// Get confidence level description
export const getConfidenceLevel = (confidence: number): {
  level: string;
  color: string;
  description: string;
} => {
  if (confidence >= 95) {
    return {
      level: 'Very High',
      color: '#22c55e',
      description: 'Extremely reliable with strong evidence'
    };
  } else if (confidence >= 85) {
    return {
      level: 'High',
      color: '#3b82f6',
      description: 'Reliable with good supporting evidence'
    };
  } else if (confidence >= 70) {
    return {
      level: 'Moderate',
      color: '#f59e0b',
      description: 'Somewhat reliable, may need verification'
    };
  } else if (confidence >= 50) {
    return {
      level: 'Low',
      color: '#f97316',
      description: 'Limited reliability, requires caution'
    };
  } else {
    return {
      level: 'Very Low',
      color: '#ef4444',
      description: 'Unreliable, significant concerns'
    };
  }
};

// Extract YouTube ID from various URL formats
export const extractYouTubeId = (url: string): string => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/user\/[^\/]+#p\/[^\/]+\/\d+\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return '';
};