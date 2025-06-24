'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { VideoCardThumbnail } from '@/app/components/video/VideoCardThumbnail';
import { VideoCardContent } from '@/app/components/video/VideoCardContent';
import VideoCardWrapper from '@/app/components/video/VideoCardWrapper';
import { Video } from '@/app/types/video_api';
import { VintageBanner } from '@/app/components/shared/VintageBanner';
import { VintageStamp } from '@/app/components/shared/VintageStamp';

interface VideoCardProps {
  video: Video;
  layout?: 'grid' | 'list';
  priority?: boolean;
  className?: string;
  index?: number;
  isVisible?: boolean;
}

export const VideoCardLayout = memo(function VideoCard({
  video,
  layout = 'grid',
  priority = false,
  className,
  index = 0,
  isVisible = true
}: VideoCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/watch/${video.id}`);
  };

  return (
    <VideoCardWrapper
      layout={layout}
      className={className}
      index={index}
      isVisible={isVisible}
      onClick={handleCardClick}
    >
      {/* VintageBanner - positioned at top */}
      <VintageBanner data={video} />
      
      <VintageStamp
        data={video}
        className="absolute -top-1 -right-2 z-50"
        size={'md'}
        animated={true}
      />
      
      {/* Thumbnail section */}
      <div className={layout === 'grid' ? 'h-[55%] relative' : 'w-1/3 relative'}>
        <VideoCardThumbnail
          video={video}
          className="w-full h-full"
        />
      </div>

      {/* Content section */}
      <div className={layout === 'grid' ? 'h-[45%] flex flex-col relative z-10' : 'flex-1 flex flex-col relative z-10'}>
        <VideoCardContent
          video={video}
          layout={layout}
          className="flex-1"
        />
      </div>
    </VideoCardWrapper>
  );
});