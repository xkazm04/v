'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { VideoMetadata } from '@/app/types/video';
import { PlayerTimeline } from '@/app/sections/player/PlayerTimeline';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';

interface YouTubeDesktopPlayerProps {
  videos: VideoMetadata[];
  initialIndex?: number;
  autoPlay?: boolean;
}

export function YouTubeDesktopPlayer({ 
  videos, 
  initialIndex = 0, 
  autoPlay = false 
}: YouTubeDesktopPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showControls, setShowControls] = useState(true);

  const currentVideo = videos[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSeekToTimestamp = (timestamp: number) => {
    // For iframe implementation, we can't directly seek
    // This would require YouTube API integration for full control
    console.log('Seek to timestamp:', timestamp);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Main Player Container */}
      <div 
        className="relative bg-black rounded-2xl overflow-hidden shadow-2xl"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(15, 23, 42, 0.98) 0%,
              rgba(30, 41, 59, 0.98) 50%,
              rgba(15, 23, 42, 0.98) 100%
            )
          `,
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(148, 163, 184, 0.1)
          `
        }}
      >
        {/* Video Container */}
        <div className="relative aspect-video bg-black rounded-t-2xl overflow-hidden">
          {/* YouTube iFrame */}
          <iframe

            key={currentVideo.youtubeId} // Force re-render on video change
            src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1&controls=1`}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={currentVideo.title}
          />

          {/* Overlay Controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex flex-col justify-between p-6 pointer-events-none"
              >
                {/* Top Info Bar */}
                <div className="flex justify-between items-start pointer-events-auto">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-white font-bold text-xl max-w-2xl leading-tight">
                      {currentVideo.title}
                    </h2>
                    <p className="text-slate-300 text-sm mt-1">
                      {currentVideo.channelName}
                    </p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm">
                      {currentVideo.category}
                    </div>
                    <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm">
                      {currentIndex + 1} / {videos.length}
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Navigation */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between pointer-events-auto"
                >
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 bg-black/30 border-white/20 text-white hover:bg-black/50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-4 text-white text-sm">
                    <span>{currentVideo.views?.toLocaleString()} views</span>
                    <span>{currentVideo.likes?.toLocaleString()} likes</span>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={currentIndex === videos.length - 1}
                    className="flex items-center gap-2 bg-black/30 border-white/20 text-white hover:bg-black/50 disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(30, 41, 59, 0.8) 0%,
                rgba(51, 65, 85, 0.9) 100%
              )
            `
          }}
        >
          <PlayerTimeline
            factCheck={currentVideo.factCheck}
            videoDuration={currentVideo.duration}
            onSeekToTimestamp={handleSeekToTimestamp}
            onExpansionChange={() => {}}
          />
        </motion.div>
      </div>

      {/* Video Playlist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              index === currentIndex
                ? 'bg-blue-500/20 border-2 border-blue-500/50'
                : 'bg-slate-800/50 border-2 border-slate-700/50 hover:border-slate-600/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <div className="flex items-center gap-3">
              <div className="w-20 h-12 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm truncate">
                  {video.title}
                </h4>
                <p className="text-slate-400 text-xs truncate">
                  {video.channelName}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <span>{video.views?.toLocaleString()} views</span>
                  <span>•</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}