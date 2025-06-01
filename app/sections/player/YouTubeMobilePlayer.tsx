'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoMetadata } from '@/app/types/video';
import { PlayerTimeline } from '@/app/sections/player/PlayerTimeline';
import { ChevronUp, ChevronDown, MoreVertical } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface YouTubeMobilePlayerProps {
  videos: VideoMetadata[];
  initialIndex?: number;
  autoPlay?: boolean;
}

export function YouTubeMobilePlayer({ 
  videos, 
  initialIndex = 0, 
  autoPlay = true 
}: YouTubeMobilePlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch/Mouse drag handlers
  const handleStart = useCallback((clientY: number) => {
    setIsDragging(true);
    setDragStart(clientY);
  }, []);

  const handleMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    const diff = clientY - dragStart;
    setDragOffset(diff);
  }, [isDragging, dragStart]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    const threshold = 100;
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset < 0 && currentIndex < videos.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (dragOffset > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setDragStart(0);
  }, [isDragging, dragOffset, currentIndex, videos.length]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientY);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  const getTransform = () => {
    const baseTransform = `translateY(-${currentIndex * 100}vh)`;
    
    if (isDragging) {
      return `translateY(calc(-${currentIndex * 100}vh + ${dragOffset}px))`;
    }
    
    return baseTransform;
  };

  const handleSeekToTimestamp = (timestamp: number) => {
    // For iframe implementation, we can't directly seek
    console.log('Seek to timestamp:', timestamp);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Video Container */}
      <div
        ref={containerRef}
        className="flex flex-col transition-transform duration-300 ease-out touch-none"
        style={{
          transform: getTransform(),
          willChange: 'transform'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="w-full h-screen flex-shrink-0 relative bg-black"
          >
            {/* YouTube iFrame */}
            <iframe
              key={`${video.youtubeId}-${index === currentIndex}`} // Force re-render when active
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=${index === currentIndex && autoPlay ? 1 : 0}&rel=0&controls=1&modestbranding=1`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />

            {/* Overlay UI */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top Gradient */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
              
              {/* Bottom Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />

              {/* Video Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: index === currentIndex ? 1 : 0, y: 0 }}
                className="absolute bottom-20 left-4 right-20 pointer-events-auto"
              >
                <h3 className="text-white text-lg font-bold mb-2 line-clamp-2 leading-tight">
                  {video.title}
                </h3>
                <p className="text-slate-300 text-sm mb-3">
                  {video.channelName}
                </p>
                
                {/* Stats */}
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span>{video.views?.toLocaleString()} views</span>
                  <span>{video.likes?.toLocaleString()} likes</span>
                </div>
              </motion.div>

              {/* Right Side Controls */}
              <div className="absolute right-4 bottom-32 flex flex-col items-center gap-4 pointer-events-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                  onClick={() => setShowTimeline(!showTimeline)}
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>

              {/* Navigation Hints */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
                <div className="flex flex-col items-center space-y-3 text-white/60">
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <ChevronUp className="w-6 h-6" />
                  </motion.div>
                  <div className="text-xs font-medium">Swipe</div>
                  <motion.div
                    animate={{ y: [2, -2, 2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <ChevronDown className="w-6 h-6" />
                  </motion.div>
                </div>
              </div>

              {/* Progress Dots */}
              <div className="absolute right-4 top-1/3 flex flex-col space-y-2 pointer-events-auto">
                {videos.map((_, dotIndex) => (
                  <motion.div
                    key={dotIndex}
                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      dotIndex === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setCurrentIndex(dotIndex)}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Overlay */}
      <AnimatePresence>
        {showTimeline && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/20 p-4"
          >
            <PlayerTimeline
              factCheck={videos[currentIndex].factCheck}
              videoDuration={videos[currentIndex].duration}
              onSeekToTimestamp={handleSeekToTimestamp}
              onExpansionChange={() => {}}
            />
            
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 text-white"
              onClick={() => setShowTimeline(false)}
            >
              Close Timeline
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}