'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/app/components/sidebar/sidebar';
import { VideoPlayer } from '@/app/components/video/video-player';
import { MobileVideoPlayer } from '@/app/components/video/mobile-video-player';
import { VideoInfo } from '@/app/sections/player/VideoInfo';
import { RelatedVideos } from '@/app/sections/player/RelatedVideos';
import { MOCK_VIDEOS } from '@/app/constants/videos';
import { VideoMetadata } from '@/app/types/video';
import { useMediaQuery } from '@/app/hooks/use-media-query';

export default function WatchPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');
  const [video, setVideo] = useState<VideoMetadata | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    // In a real app, this would be an API call
    if (videoId) {
      const foundVideo = MOCK_VIDEOS.find(v => v.id === videoId);
      if (foundVideo) {
        setVideo(foundVideo);
      }
    }
  }, [videoId]);
  
  if (!video) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-lg">Loading video...</p>
      </div>
    );
  }
  
  if (isMobile) {
    return <MobileVideoPlayer video={video} />;
  }
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer video={video} autoPlay />
            <VideoInfo video={video} />
          </div>
          <div className="lg:col-span-1">
            <RelatedVideos currentVideo={video} />
          </div>
        </div>
      </div>
    </div>
  );
}