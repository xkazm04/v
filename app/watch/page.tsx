'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/app/components/sidebar/sidebar';
import { RelatedVideos } from '@/app/sections/player/RelatedVideos';
import { MOCK_VIDEOS } from '@/app/constants/videos';
import { VideoMetadata } from '@/app/types/video';
import { LoadingScreen } from '@/app/components/layout/LoadingScreen';
import YtPlayer from '../sections/player/YtPlayer';
import { useViewport } from '../hooks/useViewport';
import { FactCheckOverlay } from '../components/research/FactCheckOverlay';

function WatchPageContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');
  const [video, setVideo] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const {width} = useViewport();

  const videoCurrentTime = 0;
  
  useEffect(() => {
    const loadVideo = async () => {
      setIsLoading(true);
      
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
  
  // if (!video) {
  //   return (
  //     <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
  //       <div className="text-center space-y-4">
  //         <h2 className="text-2xl font-semibold">Video not found</h2>
  //         <p className="text-muted-foreground">The video you're looking for doesn't exist.</p>
  //       </div>
  //     </div>
  //   );
  // }
  
  return (
    <div className="flex relative">
      <Sidebar />
      <div className="flex flex-row justify-center p-4 w-full md:p-6 max-w-[2000px]">
        {/* Updated grid to include fact-check area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
          {/* Video section */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">
            <YtPlayer 
              videos={MOCK_VIDEOS}
            />  
          </div>
          
          {/* Fact-check section */}
          <div className="lg:col-span-2 xl:col-span-2">
            <FactCheckOverlay 
              isVideoPlaying={isVideoPlaying} 
              videoCurrentTime={videoCurrentTime}
              className="relative h-full"
            />
          </div>
          
          {/* Related videos section */}
          {/* <div className="lg:col-span-1 xl:col-span-1">
            <div className={`${width <= 2500 ? 'hidden xl:block' : 'block'}`}>
              <RelatedVideos currentVideo={video} />
            </div>
          </div> */}
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