'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/app/components/sidebar/sidebar';
import { LoadingScreen } from '@/app/components/layout/LoadingScreen';
import { FactCheckOverlay } from '../components/research/FactCheckOverlay';
import { VideoTimestampsList } from '../sections/player/VideoTimestampsList';
import { useVideoDataManager } from '@/app/utils/videoDataManager';
import { YouTubeDesktopPlayer } from '../sections/player/YouTubeDesktopPlayer';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion } from 'framer-motion';

function WatchPageContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  const videoDataResult = useVideoDataManager({
    limit: 10, 
    researched: false,
    sort_by: 'processed_at',
    sort_order: 'desc',
    videoId
  });

  const {
    specificVideo,
    videoLoading,
    videoError,
    refetchVideo
  } = videoDataResult;

  useEffect(() => {
    if (videoId) {
      console.log('Loading video detail for:', videoId);
    }
  }, [videoId]);

  // Handle loading state
  if (videoLoading && !specificVideo) {
    return (
      <div className="flex relative">
        <Sidebar />
        <div className="flex flex-col items-center justify-center w-full p-6">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  // Handle error state
  if (videoError && !specificVideo) {
    return (
      <div className="flex relative">
        <Sidebar />
        <div className="flex flex-col items-center justify-center w-full p-6">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Error Loading Video</h2>
            <p className="text-red-600 mb-4">
              {videoError instanceof Error ? videoError.message : 'Unknown error occurred'}
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={refetchVideo} 
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button 
                onClick={() => window.history.back()}
                variant="secondary"
              >
                Go Back
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Handle missing video
  if (!specificVideo) {
    return (
      <div className="flex relative">
        <Sidebar />
        <div className="flex flex-col items-center justify-center w-full p-6">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-4xl mb-4">📺</div>
            <h2 className="text-2xl font-bold mb-4">Video Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {videoId ? 'The requested video could not be found' : 'No video ID provided'}
            </p>
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
            >
              Go Back
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Find current timestamp for highlighting
  const currentTimestamp = specificVideo.timestamps.find(ts => 
    videoCurrentTime >= ts.startTime && videoCurrentTime <= ts.endTime
  );

  const handleSeekToTimestamp = (timestamp: number) => {
    console.log('Seeking to timestamp:', timestamp);
  };

  return (
    <div className="flex relative">
      <Sidebar />
      <div className="flex flex-row justify-center p-4 w-full md:p-6 max-w-[2400px]">
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
          
          {/* Left Column: Video Player - Direct usage! */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">
            <ErrorBoundary>
              <YouTubeDesktopPlayer 
                video={specificVideo} // Direct VideoWithTimestamps!
                onTimeUpdate={setVideoCurrentTime}
                onPlayStateChange={setIsVideoPlaying}
              />
            </ErrorBoundary>
            
            <ErrorBoundary>
              <VideoTimestampsList 
                video={specificVideo} // Direct VideoWithTimestamps!
                currentTimestamp={currentTimestamp}
                onSeekToTimestamp={handleSeekToTimestamp}
              />
            </ErrorBoundary>
          </div>
          
          {/* Right Column: Real-time Fact-check - Direct usage! */}
          <div className="lg:col-span-2 xl:col-span-2">
            <ErrorBoundary>
              <FactCheckOverlay 
                video={specificVideo} // Direct VideoWithTimestamps!
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