export type LayoutType = 'grid' | 'list' | 'compact';

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  views: number;
  likes: number;
  uploadDate: string;
  channelName: string;
  category: string;
  tags?: string[];
  factCheck: FactCheckResult;
  youtubeId: string; // YouTube video ID
}

export interface FactCheckResult {
  evaluation?: 'Fact' | 'Mislead' | 'Lie' | 'Unverified';
  truthPercentage?: number;
  neutralPercentage?: number;
  misleadingPercentage?: number;
  totalClaims?: number;
  verifiedClaims?: number;
  sources?: number;
  confidence?: number; // 0-100
}

export type FeedProps = {
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
  imageError: boolean;
  setImageError: (error: boolean) => void;
  video: VideoMetadata;
  priority?: boolean;
}

export interface Channel {
  name: string;
  avatarUrl: string;
  verified: boolean;
  subscribers: number;
}
