'use client';

import { VideoMetadata } from '@/app/types/video';
import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoCardHeaderProps {
  video: VideoMetadata;
  showOverlay: boolean;
  layout: 'grid' | 'list';
}

const headerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export const VideoCardHeader = memo(function VideoCardHeader({
  video,
  showOverlay,
  layout
}: VideoCardHeaderProps) {
  // For now, header is minimal - can be expanded with trending badges, etc.
  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-20"
    >
      {/* Future: Trending badge, Live indicator, etc. */}
      <AnimatePresence>
        {video.views > 1000000 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="
              absolute top-4 right-4 z-30
              px-2 py-1 rounded-full text-xs font-bold
              bg-gradient-to-r from-orange-500 to-red-500
              text-white shadow-lg
            "
          >
            🔥 Trending
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});