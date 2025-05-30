export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  views: number;
  likes: number;
  dislikes: number;
  uploadDate: string;
  verified: boolean;
  channel: Channel;
  category: VideoCategory;
  tags: string[];
}

export interface Channel {
  id: string;
  name: string;
  avatarUrl: string;
  subscribers: number;
  verified: boolean;
}

export type VideoCategory = 
  | 'All'
  | 'Gaming'
  | 'Music'
  | 'Technology'
  | 'Science'
  | 'Education'
  | 'Entertainment'
  | 'News'
  | 'Sports'
  | 'Travel'
  | 'Cooking'
  | 'Fashion'
  | 'Art';