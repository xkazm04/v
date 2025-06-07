'use client';

import { AnimatePresence } from 'framer-motion';
import { VideoMetadata } from '@/app/types/video';
import { YouTubeDesktopPlayer } from './YouTubeDesktopPlayer';

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

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AnimatePresence mode="wait">
          <div key="desktop" className="flex items-center justify-center p-6">
            <YouTubeDesktopPlayer
              videos={videos}
              initialIndex={initialIndex}
              autoPlay={autoPlay}
            />
          </div>
      </AnimatePresence>
    </div>
  );
}