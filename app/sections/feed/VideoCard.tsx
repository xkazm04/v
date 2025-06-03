'use client';

import { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import CompactVideoCard from './CompactVideoCard';
import { VideoCardHeader } from '@/app/components/video/VideoCardHeader';
import { VideoCardThumbnail } from '@/app/components/video/VideoCardThumbnail';
import { VideoCardContent } from '@/app/components/video/VideoCardContent';
import { VideoCardFooter } from '@/app/components/video/VideoCardFooter';

import { transformVideoToMetadata } from '@/app/utils/videoTransform';
import { Video } from '@/app/types/video_api';

interface VideoCardProps {
  video: Video
  layout?: 'grid' | 'list' | 'compact';
  priority?: boolean;
  className?: string;
}

const LAYOUT_CONFIGS = {
  grid: {
    containerClass: 'block w-full max-w-sm',
    thumbnailClass: 'aspect-video mb-4',
    contentClass: 'space-y-3',
    direction: 'vertical'
  },
  list: {
    containerClass: 'flex gap-4 w-full max-w-2xl',
    thumbnailClass: 'w-80 h-48 flex-shrink-0',
    contentClass: 'flex-1 min-w-0 py-1',
    direction: 'horizontal'
  }
} as const;

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.96
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const VideoCard = memo(function VideoCard({ 
  video, 
  layout = 'grid', 
  priority = false,
  className = ''
}: VideoCardProps) {
  const [imageState, setImageState] = useState({
    loaded: false,
    error: false
  });
  const [showOverlay, setShowOverlay] = useState(false);

  // Transform API video data to component format
  const videoMetadata = useMemo(() => transformVideoToMetadata(video), [video]);
  
  const config = useMemo(() => LAYOUT_CONFIGS[layout as keyof typeof LAYOUT_CONFIGS], [layout]);

  // Use compact component for compact layout
  if (layout === 'compact') {
    return <CompactVideoCard video={videoMetadata} priority={priority} />;
  }

  const handleImageLoad = () => setImageState(prev => ({ ...prev, loaded: true }));
  const handleImageError = () => setImageState(prev => ({ ...prev, error: true }));
  const handleMouseEnter = () => setShowOverlay(true);
  const handleMouseLeave = () => setShowOverlay(false);

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`
        group cursor-pointer select-none outline-none
        ${config.containerClass}
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      {/* Card Container with Glass Effect */}
      <div className={`
        relative h-full overflow-hidden
        bg-gradient-to-br from-slate-50/90 to-white/95 dark:from-slate-900/90 dark:to-slate-800/95
        backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60
        rounded-2xl shadow-sm
        transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-black/20
        hover:border-slate-300/80 dark:hover:border-slate-600/80
        before:absolute before:inset-0 before:rounded-2xl
        before:bg-gradient-to-br before:from-white/20 before:to-transparent
        before:opacity-0 before:transition-opacity before:duration-300
        hover:before:opacity-100
      `}>
        {/* Header */}
        <VideoCardHeader 
          video={videoMetadata}
          showOverlay={showOverlay}
          layout={layout}
        />

        {/* Main Content Area */}
        <div className={config.direction === 'horizontal' ? 'flex gap-4 p-5' : 'block'}>
          {/* Thumbnail */}
          <VideoCardThumbnail
            video={videoMetadata}
            layout={layout}
            priority={priority}
            imageState={imageState}
            onImageLoad={handleImageLoad}
            onImageError={handleImageError}
            showOverlay={showOverlay}
            className={config.thumbnailClass}
          />

          {/* Content */}
          <VideoCardContent
            video={videoMetadata}
            layout={layout}
            className={config.contentClass}
          />
        </div>

        {/* Footer */}
        <VideoCardFooter
          video={videoMetadata}
          layout={layout}
        />

        {/* Subtle ambient glow effect */}
        <div className="
          absolute inset-0 rounded-2xl opacity-0 
          bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5
          group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
        " />
      </div>
    </motion.article>
  );
});

export { VideoCard };