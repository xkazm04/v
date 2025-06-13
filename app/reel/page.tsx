'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { YouTubeMobilePlayer } from '@/app/sections/player/YouTubeMobilePlayer';
import { useVideoDataManager } from '@/app/utils/videoDataManager';
import { VideoDataStates } from '@/app/components/video/VideoDataStates';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

function ReelPageContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');

  // Use the common video data manager
  const videoDataResult = useVideoDataManager({
    limit: 50,
    researched: true,
    sort_by: 'processed_at',
    sort_order: 'desc',
    videoId
  });

  return (
    <VideoDataStates result={videoDataResult}>
      <div className="h-screen bg-black relative">
        <YouTubeMobilePlayer
          videos={videoDataResult.enhancedVideos}
          initialIndex={videoDataResult.initialIndex}
          autoPlay={true}
        />
      </div>
    </VideoDataStates>
  );
}

export default function ReelPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-black flex items-center justify-center">
        <motion.div
          className="text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading player...</p>
        </motion.div>
      </div>
    }>
      <ReelPageContent />
    </Suspense>
  );
}