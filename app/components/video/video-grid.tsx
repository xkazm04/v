import { VideoCard } from '@/app/components/video/video-card';
import { VideoMetadata } from '@/app/types/video';

interface VideoGridProps {
  videos: VideoMetadata[];
  columns?: 1 | 2 | 3 | 4;
}

export function VideoGrid({ videos, columns = 3 }: VideoGridProps) {
  const getGridCols = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className={`grid ${getGridCols()} gap-4 md:gap-6`}>
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}