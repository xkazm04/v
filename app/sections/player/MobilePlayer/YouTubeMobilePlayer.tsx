'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoWithTimestamps } from '@/app/types/video_api';
import { PlayerTimeline } from '@/app/components/video/timeline/PlayerTimeline';
import { VideoPlayerHeader } from '@/app/components/video/VideoPlayerHeader';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { MobileNavbar } from '@/app/sections/navigation/mobile/MobileNavbar';
import { YouTubePlayerWithSync } from '../YouTubePlayerWithSync';
import YouTubeMobileContainer from './YouTubeMobileContainer';
import PlayerOverlayUi from '../PlayerOverlayUi';

interface YouTubeMobilePlayerProps {
  videos?: VideoWithTimestamps[];
  initialIndex?: number;
  autoPlay?: boolean;
}

interface ActiveStatement {
  id: string;
  timestamp: number;
  title: string;
  status: string;
  truthPercentage: number;
  endTime?: number; // When the statement context ends
}

export function YouTubeMobilePlayer({ 
  videos, 
  initialIndex = 0, 
  autoPlay = true 
}: YouTubeMobilePlayerProps) {
  const { isDark } = useLayoutTheme();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  // Changed: Timeline is now open by default on mobile
  const [showTimeline, setShowTimeline] = useState(true);
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);
  
  // Header visibility state
  const [activeStatements, setActiveStatements] = useState<ActiveStatement[]>([]);
  const [headerVisibilityTimers, setHeaderVisibilityTimers] = useState<{ [key: string]: NodeJS.Timeout }>({});
  
  // Sync state - Fixed: match desktop implementation exactly
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [seekRequest, setSeekRequest] = useState<number | null>(null);

  // Header visibility configuration
  const HEADER_DISPLAY_DURATION = 12000; // 12 seconds - longer for reading and voting
  const HEADER_MIN_DISPLAY_TIME = 5000; // Minimum 5 seconds even if user interacts
  const STATEMENT_DETECTION_THRESHOLD = 2; // Seconds tolerance for statement detection

  // Fixed: Match desktop player's time tracking approach exactly
  const handleTimeUpdate = useCallback((currentTime: number) => {
    // Update the current time state immediately like desktop
    setCurrentVideoTime(currentTime);
    
    // Check for new statements at current time
    const currentVideo = videos?.[currentIndex];
    if (!currentVideo?.timestamps) return;

    // Use the timestamp structure from video_api.ts
    const relevantTimestamps = currentVideo.timestamps.filter(timestamp => {
      const timeDiff = Math.abs(timestamp.startTime - currentTime);
      return timeDiff <= STATEMENT_DETECTION_THRESHOLD;
    });

    // Process each relevant timestamp
    relevantTimestamps.forEach(timestamp => {
      const statementId = `${currentIndex}-${timestamp.startTime}`;
      
      // Check if this statement is already active
      const isAlreadyActive = activeStatements.some(stmt => stmt.id === statementId);
      
      if (!isAlreadyActive) {
        const newStatement: ActiveStatement = {
          id: statementId,
          timestamp: timestamp.startTime,
          title: 'Key Statement', // Use generic title since VideoTimestamp doesn't have title
          status: timestamp.factCheck?.status || 'UNVERIFIED',
          truthPercentage: timestamp.factCheck?.confidence || 0,
          endTime: timestamp.endTime || timestamp.startTime + 30 // Use endTime or fallback
        };

        setActiveStatements(prev => {
          // Limit to maximum 2 statements visible at once
          const updated = [...prev, newStatement];
          return updated.slice(-2); // Keep only the last 2
        });

        // Set up visibility timer for this statement
        const timer = setTimeout(() => {
          setActiveStatements(prev => 
            prev.filter(stmt => stmt.id !== statementId)
          );
          
          setHeaderVisibilityTimers(prev => {
            const { [statementId]: removedTimer, ...rest } = prev;
            return rest;
          });
        }, HEADER_DISPLAY_DURATION);

        setHeaderVisibilityTimers(prev => ({
          ...prev,
          [statementId]: timer
        }));
      }
    });

    // Remove statements that have passed their context time
    setActiveStatements(prev => 
      prev.filter(stmt => 
        !stmt.endTime || currentTime < stmt.endTime + 5 // 5 second grace period
      )
    );
  }, [currentIndex, videos, activeStatements]);

  const handleSeekToTimestamp = useCallback((timestamp: number) => {
    console.log('Mobile seek to timestamp:', timestamp);
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
    
    // Clear all active statements and timers when changing videos
    Object.values(headerVisibilityTimers).forEach(timer => clearTimeout(timer));
    setHeaderVisibilityTimers({});
    setActiveStatements([]);
  }, [headerVisibilityTimers]);

  // Handle user interaction with headers (extend visibility)
  const handleHeaderInteraction = useCallback((statementId: string) => {
    const existingTimer = headerVisibilityTimers[statementId];
    if (existingTimer) {
      clearTimeout(existingTimer);
      
      // Extend visibility by another 8 seconds after interaction
      const newTimer = setTimeout(() => {
        setActiveStatements(prev => 
          prev.filter(stmt => stmt.id !== statementId)
        );
        
        setHeaderVisibilityTimers(prev => {
          const { [statementId]: removedTimer, ...rest } = prev;
          return rest;
        });
      }, 8000);
      
      setHeaderVisibilityTimers(prev => ({
        ...prev,
        [statementId]: newTimer
      }));
    }
  }, [headerVisibilityTimers]);

  // Force show header for testing (remove in production)
  useEffect(() => {
    if (videos && videos[currentIndex]) {
      const mockStatement: ActiveStatement = {
        id: `mock-${currentIndex}`,
        timestamp: 30,
        title: 'Test Statement',
        status: 'PARTIALLY_TRUE',
        truthPercentage: 75,
        endTime: 60
      };
      
      // Show mock statement after 2 seconds for testing
      const mockTimer = setTimeout(() => {
        setActiveStatements([mockStatement]);
      }, 2000);

      return () => clearTimeout(mockTimer);
    }
  }, [currentIndex, videos]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(headerVisibilityTimers).forEach(timer => clearTimeout(timer));
    };
  }, [headerVisibilityTimers]);

  const currentVideo = videos?.[currentIndex];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <YouTubeMobileContainer
        videos={videos}
        currentIndex={currentIndex}
        setCurrentIndex={handleVideoChange}
        setShowHeader={() => {}} // Not used anymore, we handle this internally
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
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">📺</div>
                    <p>Video {index + 1}</p>
                  </div>
                </div>
              )}

              {/* Multiple Statement Headers */}
              {index === currentIndex && (
                <AnimatePresence>
                  {activeStatements.map((statement, headerIndex) => (
                    <div 
                      key={statement.id}
                      onClick={() => handleHeaderInteraction(statement.id)}
                    >
                      <VideoPlayerHeader 
                        video={{
                          ...videoData.video,
                          factCheck: {
                            status: statement.status,
                            truthPercentage: statement.truthPercentage
                          }
                        }}
                        isVisible={true}
                        isMobile={true}
                        headerIndex={headerIndex}
                        totalHeaders={activeStatements.length}
                        className="cursor-pointer" // Make it clear it's interactive
                      />
                    </div>
                  ))}
                </AnimatePresence>
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

      {/* Enhanced Timeline Overlay - Now Fully Synced like Desktop */}
      {videos && currentVideo && (
        <AnimatePresence>
          {showTimeline && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 right-0 backdrop-blur-md border-t border-white/20 p-4 z-40" // z-40 to stay below headers
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
                isListenMode={true} // Match desktop's isListenMode setting
                currentVideoTime={currentVideoTime}
                syncMode="external" // Enable external sync mode like desktop
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