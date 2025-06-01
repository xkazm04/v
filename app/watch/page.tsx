'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/app/components/sidebar/sidebar';
import { VideoInfo } from '@/app/sections/player/VideoInfo';
import { RelatedVideos } from '@/app/sections/player/RelatedVideos';
import { MOCK_VIDEOS } from '@/app/constants/videos';
import { VideoMetadata } from '@/app/types/video';
import { LoadingScreen } from '@/app/components/layout/LoadingScreen';
import YtPlayer from '../sections/player/YtPlayer';

function WatchPageContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');
  const [video, setVideo] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadVideo = async () => {
      setIsLoading(true);
      
      // Small delay to prevent flashing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (videoId) {
        const foundVideo = MOCK_VIDEOS.find(v => v.id === videoId);
        if (foundVideo) {
          setVideo(foundVideo);
        }
      }
      
      setIsLoading(false);
    };
    
    loadVideo();
  }, [videoId]);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!video) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Video not found</h2>
          <p className="text-muted-foreground">The video you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-row justify-center p-4 w-full md:p-6 max-w-[1800px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 max-w-[700px]">
            <YtPlayer />
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

export default function WatchPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <WatchPageContent />
    </Suspense>
  );
}