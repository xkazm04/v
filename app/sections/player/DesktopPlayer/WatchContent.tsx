'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/app/components/sidebar/sidebar';
import { LoadingScreen } from '@/app/components/layout/LoadingScreen';
import { useVideoDataManager } from '@/app/utils/videoDataManager';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { FactCheckOverlay } from '@/app/components/research/FactCheckOverlay';
import { YouTubeDesktopPlayer } from './YouTubeDesktopPlayer';
import { TimelineClaimList } from '@/app/components/video/timeline/TimelineClaimList';

const WatchContent = () => {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const { vintage, isVintage } = useLayoutTheme();

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
    refetchVideo,
    dataSource,
    isUsingMockData,
    hasApiData
  } = videoDataResult;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [videoId]);

  useEffect(() => {
    if (videoId) {
      console.log(`🎬 Loading video detail for: ${videoId}`);
      console.log(`📊 Data source: ${dataSource}`);
      console.log(`🔄 Using mock data: ${isUsingMockData}`);
    }
  }, [videoId, dataSource, isUsingMockData]);

  // Handle loading state
  if (videoLoading && !specificVideo) {
    return (
      <div className="flex relative">
        <Sidebar />
        <div className="flex flex-col items-center justify-center w-full p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <LoadingScreen />
            <p className="mt-4 text-muted-foreground">
              Loading video from multiple sources...
            </p>
            <div className="flex justify-center gap-2 mt-2">
              <Badge variant="outline">Supabase</Badge>
              <Badge variant="outline">FastAPI</Badge>
              <Badge variant="outline">Cache</Badge>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Handle error state with retry options
  if (videoError && !specificVideo) {
    return (
      <div className="flex relative">
        <Sidebar />
        <div className="flex flex-col items-center justify-center w-full p-6">
          <motion.div 
            className="text-center max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Error Loading Video</h2>
            <p className="text-red-600 mb-4">
              {videoError instanceof Error ? videoError.message : 'Unknown error occurred'}
            </p>
            <div className="bg-muted p-4 rounded-lg mb-4 text-sm">
              <p className="text-muted-foreground mb-2">Attempted sources:</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Next.js API</Badge>
                <Badge variant="outline">Supabase</Badge>
                <Badge variant="outline">FastAPI</Badge>
                <Badge variant="outline">Mock Data</Badge>
              </div>
            </div>
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
              {videoId ? `Video "${videoId}" could not be found in any data source` : 'No video ID provided'}
            </p>
            <div className="bg-muted p-4 rounded-lg mb-4 text-sm">
              <p className="text-muted-foreground mb-2">Searched in:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">Supabase Database</Badge>
                <Badge variant="outline">FastAPI Backend</Badge>
                <Badge variant="outline">Local Cache</Badge>
              </div>
            </div>
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
          
          {/* Left Column: Video Player */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">            
            <ErrorBoundary>
              <YouTubeDesktopPlayer 
                video={specificVideo}
                onTimeUpdate={setVideoCurrentTime}
                onPlayStateChange={setIsVideoPlaying}
              />
            </ErrorBoundary>
            
            {/* Enhanced Unified Timeline Claims List */}
            <ErrorBoundary>
              <Card style={{
                backgroundColor: isVintage ? vintage.paper : undefined,
                borderColor: isVintage ? vintage.crease : undefined,
                boxShadow: isVintage 
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 8px rgba(139, 69, 19, 0.1)'
                  : undefined
              }}>
                <CardContent className="p-6">
                  <TimelineClaimList 
                    video={specificVideo}
                    currentTimestamp={currentTimestamp}
                    currentTime={videoCurrentTime}
                    onSeekToTimestamp={handleSeekToTimestamp}
                    showHeader={true}
                    showStats={true}
                    maxHeight="500px"
                    isCompact={false}
                  />
                </CardContent>
              </Card>
            </ErrorBoundary>
          </div>
          
          {/* Right Column: Real-time Fact-check */}
          <div className="lg:col-span-2 xl:col-span-2">
            <ErrorBoundary>
              <FactCheckOverlay 
                video={specificVideo}
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

export default WatchContent