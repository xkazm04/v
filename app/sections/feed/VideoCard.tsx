'use client';

import { VideoMetadata } from '@/app/types/video';
import { memo } from 'react';
import FeedContainer from './FeedContainer';
import { MOCK_VIDEOS } from '@/app/constants/videos';

interface VideoCardProps {
  video: VideoMetadata;
  layout?: 'grid' | 'list' | 'compact';
  priority?: boolean;
}

  export const cardStyles = {
    grid: "cursor-pointer group transition-transform hover:scale-[1.02] active:scale-[0.98]",
    list: "flex gap-4 cursor-pointer group transition-transform hover:scale-[1.01] active:scale-[0.99]",
    compact: "flex gap-2 cursor-pointer group transition-transform hover:scale-[1.02] active:scale-[0.98]"
  };

const VideoCard = memo(function VideoCard({ layout = 'grid'}: VideoCardProps) {


  switch (layout) {
    case 'compact':
      return  <FeedContainer videos={MOCK_VIDEOS} layout="compact" />
    case 'list':
      return  <FeedContainer videos={MOCK_VIDEOS} layout="list" />
    default:
      return <FeedContainer videos={MOCK_VIDEOS} layout="list" />
  }
});

export { VideoCard };