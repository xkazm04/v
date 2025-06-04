'use client';

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { VideoMetadata } from '@/app/types/video';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { VideoCardHeader } from '@/app/components/video/VideoCardHeader';
import { VideoCardThumbnail } from '@/app/components/video/VideoCardThumbnail';
import { VideoCardFooter } from '@/app/components/video/VideoCardFooter';
import { VideoCardContent } from '@/app/components/video/VideoCardContent';

interface VideoCardProps {
  video: VideoMetadata;
  layout?: 'grid' | 'list';
  priority?: boolean;
  className?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
};

export const VideoCard = memo(function VideoCard({
  video,
  layout = 'grid',
  priority = false,
  className
}: VideoCardProps) {
  const { cardColors, colors, mounted, isDark } = useLayoutTheme();
  const [imageState, setImageState] = useState({ loaded: false, error: false });
  const [isHovered, setIsHovered] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  if (!mounted) {
    return null;
  }

  const handleImageLoad = () => setImageState(prev => ({ ...prev, loaded: true }));
  const handleImageError = () => setImageState(prev => ({ ...prev, error: true }));

  return (
    <motion.article
      className={cn(
        "relative overflow-hidden rounded-xl group cursor-pointer",
        "border backdrop-blur-sm transition-all duration-300",
        layout === 'grid' ? "flex flex-col" : "flex flex-row h-32",
        className
      )}
      style={{
        backgroundColor: `${cardColors.background}f8`,
        borderColor: cardColors.border,
        boxShadow: `0 2px 8px ${cardColors.shadow}`
      }}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => {
        setIsHovered(true);
        setShowOverlay(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        setShowOverlay(false);
      }}
    >
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        {/* Subtle grain texture */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${colors.foreground} 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Hover gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}05)`
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Border glow on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              boxShadow: `inset 0 0 0 1px ${colors.primary}40, 0 0 20px ${colors.primary}20`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Header with badges */}
      <VideoCardHeader
        video={video}
        showOverlay={showOverlay}
        layout={layout}
      />

      {/* Thumbnail */}
      <div className={layout === 'grid' ? "aspect-video" : "w-40 flex-shrink-0"}>
        <VideoCardThumbnail
          video={video}
          layout={layout}
          priority={priority}
          imageState={imageState}
          onImageLoad={handleImageLoad}
          onImageError={handleImageError}
          showOverlay={showOverlay}
          className="w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 relative z-10">
        <VideoCardContent
          video={video}
          layout={layout}
          className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}
        />
      </div>

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(45deg, transparent 30%, ${colors.primary}10 50%, transparent 70%)`
        }}
        animate={{
          x: isHovered ? ['0%', '100%'] : '0%',
          opacity: isHovered ? [0, 0.5, 0] : 0
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut'
        }}
      />
    </motion.article>
  );
});