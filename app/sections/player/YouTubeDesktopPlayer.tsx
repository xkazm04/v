'use client';

import { motion } from 'framer-motion';
import { PlayerTimeline } from '@/app/sections/player/timeline/PlayerTimeline';
import { useState } from 'react';
import { Video } from '@/app/types/video_api';

interface YouTubeDesktopPlayerProps {
  videos?: Video[];
  initialIndex?: number;
  autoPlay?: boolean;
}

export function YouTubeDesktopPlayer({ 
  videos, 
  initialIndex = 0, 
  autoPlay = false 
}: YouTubeDesktopPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const currentVideo = videos?.[currentIndex];


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
     {videos && currentVideo && <>
      {/* Main Player Container */}
      <div 
        className="relative bg-black rounded-2xl overflow-hidden shadow-2xl"
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
            key={currentVideo.youtubeId} 
            src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1&controls=1`}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={currentVideo.title}
          />
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
      </>}
    </motion.div>
  );
}