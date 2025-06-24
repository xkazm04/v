'use client';

import { memo, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/app/components/sidebar/sidebar';
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
import { PlayerTimeline } from '@/app/components/video/timeline/PlayerTimeline'; 
import LoaderComponent from '@/app/components/animations/LoaderComponent';
import BackgroundPlayerPattern from '@/app/components/ui/Decorative/BackgroundPlayernPattern';



const WatchContent = () => {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [showTimeline, setShowTimeline] = useState(true); 
  const { vintage, isVintage } = useLayoutTheme();

  const videoDataResult = useVideoDataManager({
    videoId,
    enableVideosList: false, 
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

  // ✅ ENHANCED: Better error state with retry options
  if (videoError && !specificVideo) {
    return (
      <div className="flex relative min-h-screen">
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
              Failed to load video: {videoId}
            </p>
            <div className="bg-muted p-4 rounded-lg mb-4 text-sm">
              <p className="font-medium mb-2">Error Details:</p>
              <p className="text-muted-foreground">
                {videoError.message || 'Unknown error occurred'}
              </p>
              <div className="mt-3">
                <p className="text-muted-foreground mb-2">Attempted sources:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Supabase</Badge>
                  <Badge variant="outline" className="text-xs">FastAPI</Badge>
                  <Badge variant="outline" className="text-xs">Mock Data</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={refetchVideo} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button 
                onClick={() => window.history.back()} 
                variant="ghost" 
                size="sm"
              >
                Go Back
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (videoLoading || !specificVideo) {
    return (
      <div className="flex relative min-h-screen">
        <div className="flex flex-col items-center justify-center w-full p-6">
          <motion.div 
            className="text-center max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <LoaderComponent 
              loading={videoLoading}
              size={18}
            />
            <h2 className="text-2xl font-bold mb-4">Loading Video...</h2>
            <p className="text-muted-foreground">
              Please wait while we fetch the video details.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentTimestamp = specificVideo.timestamps.find(ts => 
    videoCurrentTime >= ts.startTime && videoCurrentTime <= ts.endTime
  );

  const handleSeekToTimestamp = (timestamp: number) => {
    console.log('WatchContent: Seeking to timestamp:', timestamp);
    setVideoCurrentTime(timestamp);
    // TODO: Add direct player seek communication if needed
  };

  return (
    <ErrorBoundary>
      <div className="flex relative min-h-screen">
        <BackgroundPlayerPattern />
        <Sidebar />
        
        {/* Main Content Container */}
        <div className="flex-1 flex flex-col">
          {/* Content Grid */}
          <div className="flex-1 p-4 md:p-6">
            <div className="max-w-[2400px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 h-full">
                
                {/* ✅ LEFT COLUMN: Video Player + Timeline (Preserved Layout) */}
                <div className="lg:col-span-2 xl:col-span-3 space-y-6">
                  
                  {/* ✅ RESTORED: Video Player with VideoInfoHeader */}
                  <ErrorBoundary>
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <YouTubeDesktopPlayer 
                          video={specificVideo.video} // ✅ Pass Video object
                          autoPlay={false}
                          onTimeUpdate={setVideoCurrentTime}
                          onPlayStateChange={setIsVideoPlaying}
                          onSeek={handleSeekToTimestamp}
                        />
                      </CardContent>
                    </Card>
                  </ErrorBoundary>
                  
                  {/* ✅ RESTORED: PlayerTimeline Component */}
                  {showTimeline && (
                    <ErrorBoundary>
                      <PlayerTimeline
                        videoData={specificVideo} // ✅ Pass full VideoWithTimestamps
                        currentVideoTime={videoCurrentTime}
                        onSeekToTimestamp={handleSeekToTimestamp}
                        setShowTimeline={setShowTimeline}
                        isOverNavbar={false}
                        isListenMode={false}
                        syncMode="external"
                      />
                    </ErrorBoundary>
                  )}
                  
                  {/* ✅ PRESERVED: Enhanced Timeline Claims List (Additional View) */}
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
                          maxHeight="400px"
                          isCompact={false}
                        />
                      </CardContent>
                    </Card>
                  </ErrorBoundary>
                </div>
                
                {/* ✅ RIGHT COLUMN: Real-time Fact-check (Preserved Position) */}
                <div className="lg:col-span-2 xl:col-span-2">
                  <div className="sticky top-6">
                    <ErrorBoundary>
                      <FactCheckOverlay 
                        video={specificVideo} 
                        isVideoPlaying={isVideoPlaying} 
                        videoCurrentTime={videoCurrentTime}
                        className="relative h-full min-h-[1000px]"
                      />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default WatchContent;