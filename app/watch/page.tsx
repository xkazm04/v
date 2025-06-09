'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/app/components/sidebar/sidebar';
import { LoadingScreen } from '@/app/components/layout/LoadingScreen';
import { FactCheckOverlay } from '../components/research/FactCheckOverlay';
import { VideoTimestampsList } from '../sections/player/VideoTimestampsList';
import { useVideoDetail } from '@/app/hooks/useVideoDetail';
import { YouTubeDesktopPlayer } from '../sections/player/YouTubeDesktopPlayer';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

function WatchPageContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  // Use the new video detail hook
  const { video, loading, error, refetch } = useVideoDetail(videoId);

  useEffect(() => {
    if (videoId) {
      console.log('Loading video detail for:', videoId);
    }
  }, [videoId]);

  // Handle loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex relative">
        <Sidebar />
        <div className="flex flex-col items-center justify-center w-full p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={refetch} 
              className="mt-4"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Handle missing video
  if (!video) {
    return (
      <div className="flex relative">
        <Sidebar />
        <div className="flex flex-col items-center justify-center w-full p-6">
          <p className="text-muted-foreground">
            {videoId ? 'Video not found' : 'No video ID provided'}
          </p>
        </div>
      </div>
    );
  }

  // Validate video data structure
  if (!video.timestamps) {
    console.warn('Video missing timestamps array');
    video.timestamps = [];
  }

  // Find current timestamp for highlighting
  const currentTimestamp = video.timestamps.find(ts => 
    videoCurrentTime >= ts.startTime && videoCurrentTime <= ts.endTime
  );

  const handleSeekToTimestamp = (timestamp: number) => {
    // This would be handled by the YouTubeDesktopPlayer
    console.log('Seeking to timestamp:', timestamp);
  };

  return (
    <div className="flex relative">
      <Sidebar />
      <div className="flex flex-row justify-center p-4 w-full md:p-6 max-w-[2400px]">
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
          
          {/* Left Column: Video Player */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">
            <ErrorBoundary>
              <YouTubeDesktopPlayer 
                video={video}
                onTimeUpdate={setVideoCurrentTime}
                onPlayStateChange={setIsVideoPlaying}
              />
            </ErrorBoundary>
            
            {/* Video Timestamps List - Moved from FactCheckOverlay */}
            <ErrorBoundary>
              <VideoTimestampsList 
                video={video}
                currentTimestamp={currentTimestamp}
                onSeekToTimestamp={handleSeekToTimestamp}
              />
            </ErrorBoundary>
          </div>
          
          {/* Right Column: Real-time Fact-check */}
          <div className="lg:col-span-2 xl:col-span-2">
            <ErrorBoundary>
              <FactCheckOverlay 
                video={video}
                isVideoPlaying={isVideoPlaying} 
                videoCurrentTime={videoCurrentTime}
                className="relative h-full min-h-[600px]"
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WatchPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <WatchPageContent />
      </Suspense>
    </ErrorBoundary>
  );
}