import { VideoMetadata } from '@/app/types/video';
import { VideoCard } from '../feed/VideoCard';
import { MOCK_VIDEOS } from '@/app/constants/videos';

interface RelatedVideosProps {
  currentVideo: VideoMetadata;
}

export function RelatedVideos({ currentVideo }: RelatedVideosProps) {
  // Filter out the current video and get related videos
  // In a real app, this would use a recommendation algorithm
  const relatedVideos = MOCK_VIDEOS
    .filter(video => video.id !== currentVideo.id)
    .slice(0, 8);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Related Videos</h3>
      <div className="space-y-4">
        {relatedVideos.map(video => (
          <VideoCard key={video.id} video={video} layout="compact" />
        ))}
      </div>
    </div>
  );
}