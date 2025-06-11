'use client';

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { VideoCardThumbnail } from '@/app/components/video/VideoCardThumbnail';
import { VideoCardContent } from '@/app/components/video/VideoCardContent';
import { Video } from '@/app/types/video_api';

interface VideoCardProps {
  video: Video;
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
  const [isHovered, setIsHovered] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  if (!mounted) {
    return null;
  }

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

        <>
          <div className="h-1/2 relative">
            <VideoCardThumbnail
              video={video}
              className="w-full h-full"
            />
          </div>

          <div className="h-1/2 flex flex-col relative z-10">
            <VideoCardContent
              video={video}
              layout={layout}
              className="flex-1"
            />
          </div>
        </>
      
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