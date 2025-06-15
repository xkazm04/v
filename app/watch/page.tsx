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
import { RefreshCw, AlertCircle, Wifi, WifiOff, Database, HardDrive } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
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

  // ✅ **DATA SOURCE INDICATOR COMPONENT**
  const DataSourceIndicator = () => {
    if (!specificVideo) return null;

    const getSourceConfig = () => {
      switch (dataSource) {
        case 'api':
          return {
            icon: <Database className="w-4 h-4" />,
            label: 'Supabase Live',
            color: 'bg-green-500'
          };
        case 'mock':
          return {
            icon: <HardDrive className="w-4 h-4" />,
            label: 'Offline Mode',
            color: 'bg-orange-500',
          };
        case 'hybrid':
          return {
            icon: <Wifi className="w-4 h-4" />,
            label: 'Hybrid Mode',
            color: 'bg-blue-500',
          };
        default:
          return {
            icon: <WifiOff className="w-4 h-4" />,
            label: 'No Data',
            color: 'bg-red-500',
          };
      }
    };

    const config = getSourceConfig();

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-4"
      >
        <Badge variant="secondary" className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${config.color}`} />
          {config.icon}
          {config.label}
        </Badge>
      </motion.div>
    );
  };

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
            {/* ✅ Data Source Indicator */}
            <DataSourceIndicator />
            
            <ErrorBoundary>
              <YouTubeDesktopPlayer 
                video={specificVideo}
                onTimeUpdate={setVideoCurrentTime}
                onPlayStateChange={setIsVideoPlaying}
              />
            </ErrorBoundary>
            
            <ErrorBoundary>
              <VideoTimestampsList 
                video={specificVideo}
                currentTimestamp={currentTimestamp}
                onSeekToTimestamp={handleSeekToTimestamp}
              />
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

export default function WatchPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="flex relative">
          <Sidebar />
          <div className="flex flex-col items-center justify-center w-full p-6">
            <LoadingScreen />
            <p className="mt-4 text-muted-foreground">
              Initializing watch page...
            </p>
          </div>
        </div>
      }>
        <WatchPageContent />
      </Suspense>
    </ErrorBoundary>
  );
}