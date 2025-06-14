'use client';

import { memo, useState, useEffect } from 'react';
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
  index?: number;
  isVisible?: boolean;
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 15, 
    scale: 0.98
  },
  visible: (index: number) => ({ 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      delay: Math.min(index * 0.06, 1), 
      type: "tween" 
    }
  }),
  hover: {
    y: -4,
    scale: 1.01,
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
  className,
  index = 0,
  isVisible = true
}: VideoCardProps) {
  const { cardColors, colors } = useLayoutTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  const cardHeight = layout === 'grid' ? 'h-[250px]' : 'h-[180px]';

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setContentLoaded(true);
      }, 100); 
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]);


  return (
    <motion.article
      className={cn(
        "relative overflow-hidden rounded-xl group cursor-pointer",
        "border backdrop-blur-sm",
        cardHeight,
        layout === 'grid' ? "flex flex-col" : "flex flex-row",
        className
      )}
      style={{
        backgroundColor: `${cardColors.background}f8`,
        borderColor: cardColors.border,
        boxShadow: `0 2px 8px ${cardColors.shadow}`
      }}
      variants={cardVariants}
      custom={index}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Thumbnail section */}
      <div className={layout === 'grid' ? 'h-1/2 relative' : 'w-1/3 relative'}>
        <VideoCardThumbnail
          video={video}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content section */}
      <div className={layout === 'grid' ? 'h-1/2 flex flex-col relative z-10' : 'flex-1 flex flex-col relative z-10'}>
        {/* Only show content when it's marked as loaded */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <VideoCardContent
              video={video}
              layout={layout}
              className="flex-1 p-4"
            />
          </motion.div>
      </div>

      {/* Sweep animation on hover - only when content is loaded */}
      {contentLoaded && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, transparent 30%, ${colors.primary}08 50%, transparent 70%)`
          }}
          animate={{
            x: isHovered ? '100%' : '-100%',
            opacity: isHovered ? 0.6 : 0
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut'
          }}
        />
      )}
    </motion.article>
  );
});