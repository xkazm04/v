'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoMetadata } from '@/app/types/video';
import { YouTubeDesktopPlayer } from './YouTubeDesktopPlayer';
import { YouTubeMobilePlayer } from './YouTubeMobilePlayer';

interface YtPlayerProps {
  videos?: VideoMetadata[];
  initialIndex?: number;
  autoPlay?: boolean;
}

export default function YtPlayer({ 
  videos, 
  initialIndex = 0, 
  autoPlay = false 
}: YtPlayerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsLoading(false);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg font-medium">Loading Player...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Player Content */}
      <AnimatePresence mode="wait">
        {isMobile ? (
          <YouTubeMobilePlayer
            key="mobile"
            videos={videos}
            initialIndex={initialIndex}
            autoPlay={autoPlay}
          />
        ) : (
          <div key="desktop" className="flex items-center justify-center p-6">
            <YouTubeDesktopPlayer
              videos={videos}
              initialIndex={initialIndex}
              autoPlay={autoPlay}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}