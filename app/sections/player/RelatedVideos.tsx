'use client';

import { VideoMetadata } from '@/app/types/video';
import { MOCK_VIDEOS } from '@/app/constants/videos';
import CompactVideoCard from '../feed/CompactVideoCard';

interface RelatedVideosProps {
  currentVideo: VideoMetadata;
}

export function RelatedVideos({ currentVideo }: RelatedVideosProps) {
  const relatedVideos = MOCK_VIDEOS
    .filter(video => video.id !== currentVideo.id)
    .sort((a, b) => {
      // Prioritize videos from same category
      const aScore = a.category === currentVideo.category ? 1 : 0;
      const bScore = b.category === currentVideo.category ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, 5); 
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Related Videos</h3>
      <div className="space-y-3">
        {relatedVideos.map((video, index) => (
          <CompactVideoCard 
            key={video.id} 
            video={video} 
            priority={index === 0}
          />
        ))}
      </div>
    </div>
  );
}