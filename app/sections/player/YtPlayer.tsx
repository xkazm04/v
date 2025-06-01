'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoMetadata } from '@/app/types/video';
import { YouTubeDesktopPlayer } from './YouTubeDesktopPlayer';
import { YouTubeMobilePlayer } from './YouTubeMobilePlayer';
import { Monitor, Smartphone } from 'lucide-react';

interface YtPlayerProps {
  videos?: VideoMetadata[];
  initialIndex?: number;
  autoPlay?: boolean;
}

// Sample video data with fact-check information
const defaultVideos: VideoMetadata[] = [
  {
    id: '1',
    title: 'PSY - GANGNAM STYLE (강남스타일) M/V',
    channelName: 'officialpsy',
    videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    youtubeId: '9bZkp7q19f0',
    thumbnailUrl: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
    duration: 252,
    views: 5000000000,
    likes: 25000000,
    uploadDate: '2012-07-15T00:00:00Z',
    category: 'Music',
    factCheck: {
      evaluation: 'True',
      confidence: 95,
      truthPercentage: 85,
      neutralPercentage: 10,
      liePercentage: 5
    }
  },
  {
    id: '2',
    title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
    channelName: 'LuisFonsiVEVO',
    videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    youtubeId: 'kJQP7kiw5Fk',
    thumbnailUrl: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
    duration: 282,
    views: 8000000000,
    likes: 50000000,
    uploadDate: '2017-01-12T00:00:00Z',
    category: 'Music',
    factCheck: {
      evaluation: 'Misleading',
      confidence: 78,
      truthPercentage: 60,
      neutralPercentage: 25,
      liePercentage: 15
    }
  },
  {
    id: '3',
    title: 'Queen - Bohemian Rhapsody (Official Video Remastered)',
    channelName: 'Queen Official',
    videoUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    youtubeId: 'fJ9rUzIMcZQ',
    thumbnailUrl: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
    duration: 355,
    views: 2000000000,
    likes: 15000000,
    uploadDate: '2008-08-01T00:00:00Z',
    category: 'Music',
    factCheck: {
      evaluation: 'True',
      confidence: 92,
      truthPercentage: 90,
      neutralPercentage: 8,
      liePercentage: 2
    }
  },
  {
    id: '4',
    title: 'Rick Astley - Never Gonna Give You Up',
    channelName: 'RickAstleyVEVO',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: 213,
    views: 1400000000,
    likes: 16000000,
    uploadDate: '2009-10-24T00:00:00Z',
    category: 'Music',
    factCheck: {
      evaluation: 'False',
      confidence: 67,
      truthPercentage: 30,
      neutralPercentage: 20,
      liePercentage: 50
    }
  }
];

export default function YtPlayer({ 
  videos = defaultVideos, 
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mode Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20"
      >
        <div className="flex items-center gap-2 text-white text-sm font-medium">
          {isMobile ? (
            <>
              <Smartphone className="w-4 h-4" />
              Mobile Mode
            </>
          ) : (
            <>
              <Monitor className="w-4 h-4" />
              Desktop Mode
            </>
          )}
        </div>
      </motion.div>

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
          <div key="desktop" className="min-h-screen flex items-center justify-center p-6">
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