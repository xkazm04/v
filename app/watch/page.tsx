'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/app/components/sidebar/sidebar';
import { LoadingScreen } from '@/app/components/layout/LoadingScreen';
import YtPlayer from '../sections/player/YtPlayer';
import { FactCheckOverlay } from '../components/research/FactCheckOverlay';

function WatchPageContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const videoCurrentTime = 0;
  let videos
  
  useEffect(() => {
    const loadVideo = async () => {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      
      setIsLoading(false);
    };
    
    loadVideo();
  }, [videoId]);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="flex relative">
      <Sidebar />
      <div className="flex flex-row justify-center p-4 w-full md:p-6 max-w-[2000px]">
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">
            <YtPlayer 
              videos={videos}
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