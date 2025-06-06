'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoMetadata } from '@/app/types/video';
import { PlayerTimeline } from '@/app/sections/player/timeline/PlayerTimeline';
import { Button } from '@/app/components/ui/button';
import { VideoPlayerHeader } from '@/app/components/video/VideoPlayerHeader';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import YouTubeMobileContainer from './YouTubeMobileContainer';
import PlayerOverlayUi from './PlayerOverlayUi';

interface YouTubeMobilePlayerProps {
  videos?: VideoMetadata[];
  initialIndex?: number;
  autoPlay?: boolean;
}

export function YouTubeMobilePlayer({ 
  videos, 
  initialIndex = 0, 
  autoPlay = true 
}: YouTubeMobilePlayerProps) {
  const { colors, isDark } = useLayoutTheme();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  const handleSeekToTimestamp = (timestamp: number) => {
    console.log('Seek to timestamp:', timestamp);
  };

  const currentVideo = videos?.[currentIndex];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Video Container */}
      <YouTubeMobileContainer
        videos={videos}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        setShowHeader={setShowHeader}
      >
        {/* Video Player */}
        {videos && videos.map((video, index) => (
          <div
            key={video.id}
            className="w-full h-screen flex-shrink-0 relative bg-black"
          >
            {/* YouTube iFrame */}
            <iframe
              key={`${video.youtubeId}-${index === currentIndex}`}
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=${index === currentIndex && autoPlay ? 1 : 0}&rel=0&controls=1&modestbranding=1`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />

            {/* Enhanced Header with Fact Check */}
            {index === currentIndex && (
              <VideoPlayerHeader 
                video={video}
                isVisible={showHeader}
                isMobile={true}
              />
            )}

            {/* Overlay UI */}
            <PlayerOverlayUi
              index={index}
              currentIndex={currentIndex}
              video={video}
              showTimeline={showTimeline}
              setShowTimeline={setShowTimeline}
              setCurrentIndex={setCurrentIndex}
              videos={videos}
              />
          </div>
        ))}
      </YouTubeMobileContainer>
      {/* Enhanced Timeline Overlay */}
      {videos && currentVideo && (
        <AnimatePresence>
          {showTimeline && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 backdrop-blur-md border-t border-white/20 p-4"
              style={{
                background: isDark
                  ? 'rgba(15, 23, 42, 0.95)'
                  : 'rgba(255, 255, 255, 0.95)'
              }}
            >
              <PlayerTimeline
                factCheck={currentVideo.factCheck}
                videoDuration={currentVideo.duration}
                onSeekToTimestamp={handleSeekToTimestamp}
                onExpansionChange={() => {}}
              />
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3"
                  style={{ color: colors.foreground }}
                  onClick={() => setShowTimeline(false)}
                >
                  Close Timeline
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}