'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoWithTimestamps } from '@/app/types/video_api';
import { PlayerTimeline } from '@/app/sections/player/timeline/PlayerTimeline';
import { VideoPlayerHeader } from '@/app/components/video/VideoPlayerHeader';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { MobileNavbar } from '@/app/sections/navigation/MobileNavbar';
import { YouTubePlayerWithSync } from './YouTubePlayerWithSync';
import YouTubeMobileContainer from './YouTubeMobileContainer';
import PlayerOverlayUi from './PlayerOverlayUi';

interface YouTubeMobilePlayerProps {
  videos?: VideoWithTimestamps[];
  initialIndex?: number;
  autoPlay?: boolean;
}

export function YouTubeMobilePlayer({ 
  videos, 
  initialIndex = 0, 
  autoPlay = true 
}: YouTubeMobilePlayerProps) {
  const { isDark } = useLayoutTheme();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);
  
  // Sync state
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [seekRequest, setSeekRequest] = useState<number | null>(null);

  const handleTimeUpdate = useCallback((currentTime: number) => {
    setCurrentVideoTime(currentTime);
  }, []);

  const handleSeekToTimestamp = useCallback((timestamp: number) => {
    console.log('Seek to timestamp:', timestamp);
    setSeekRequest(timestamp);
    
    // Clear seek request after a short delay
    setTimeout(() => {
      setSeekRequest(null);
    }, 500);
  }, []);

  const handleVideoChange = useCallback((newIndex: number) => {
    setCurrentIndex(newIndex);
    setCurrentVideoTime(0);
    setSeekRequest(null);
  }, []);

  const currentVideo = videos?.[currentIndex];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Video Container */}
      <YouTubeMobileContainer
        videos={videos}
        currentIndex={currentIndex}
        setCurrentIndex={handleVideoChange}
        setShowHeader={setShowHeader}
      >
        {/* Video Player */}
        {videos && videos.map((videoData, index) => {
          const youtubeId = extractYouTubeId(videoData.video.video_url);
          
          return (
            <div
              key={videoData.video.id}
              className="w-full h-screen relative bg-black"
            >
              {/* Synced YouTube Player */}
              {index === currentIndex ? (
                <YouTubePlayerWithSync
                  videoId={youtubeId}
                  videoData={videoData}
                  onTimeUpdate={handleTimeUpdate}
                  onSeekRequest={seekRequest}
                  autoPlay={autoPlay}
                  className="w-full h-full"
                />
              ) : (
                // Placeholder for non-active videos
                <div className="w-full h-full bg-black flex items-center justify-start">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">📺</div>
                    <p>Video {index + 1}</p>
                  </div>
                </div>
              )}

              {/* Enhanced Header with Fact Check */}
              {index === currentIndex && (
                <VideoPlayerHeader 
                  video={videoData.video}
                  isVisible={showHeader}
                  isMobile={true}
                />
              )}

              {/* Overlay UI */}
              <PlayerOverlayUi
                index={index}
                currentIndex={currentIndex}
                video={videoData.video}
                showTimeline={showTimeline}
                setShowTimeline={setShowTimeline}
                setCurrentIndex={handleVideoChange}
                videos={videos}
              />
            </div>
          );
        })}
      </YouTubeMobileContainer>

      {/* Enhanced Timeline Overlay - Now Synced */}
      {videos && currentVideo && (
        <AnimatePresence>
          {showTimeline && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 right-0 backdrop-blur-md border-t border-white/20 p-4 z-50"
              style={{
                bottom: '10px',
                background: isDark
                  ? 'rgba(15, 23, 42, 0.95)'
                  : 'rgba(255, 255, 255, 0.95)'
              }}
            >
              <PlayerTimeline
                videoData={currentVideo}
                onSeekToTimestamp={handleSeekToTimestamp}
                isOverNavbar={true}
                currentVideoTime={currentVideoTime}
                setShowTimeline={setShowTimeline}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      <MobileNavbar 
        isVideoPlayerMode={true}
        onVideoPlayerModeToggle={() => setNavbarCollapsed(!navbarCollapsed)}
      />
    </div>
  );
}

// Helper function to extract YouTube ID from URL
function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : '';
}