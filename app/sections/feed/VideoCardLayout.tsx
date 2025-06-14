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
    y: -6,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
};

const glowVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export const VideoCardLayout = memo(function VideoCard({
  video,
  layout = 'grid',
  priority = false,
  className,
  index = 0,
  isVisible = true
}: VideoCardProps) {
  const { cardColors, colors, isDark } = useLayoutTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  const cardHeight = layout === 'grid' ? 'h-[280px]' : 'h-[180px]';

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
        "relative overflow-hidden rounded-xl group",
        "border backdrop-blur-sm transition-all duration-300",
        cardHeight,
        layout === 'grid' ? "flex flex-col" : "flex flex-row",
        "hover:shadow-xl",
        className
      )}
      style={{
        backgroundColor: `${cardColors.background}f8`,
        borderColor: cardColors.border,
        boxShadow: isHovered 
          ? `0 8px 32px ${colors.primary}20, 0 0 0 1px ${colors.primary}30`
          : `0 2px 8px ${cardColors.shadow}`
      }}
      variants={cardVariants}
      custom={index}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
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
        
        {/* Dynamic hover gradient */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}05)`
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          variants={glowVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${colors.primary}15 0%, transparent 60%)`
          }}
        />
      </div>

      {/* Thumbnail section - Routes to /watch */}
      <div className={layout === 'grid' ? 'h-[55%] relative' : 'w-1/3 relative'}>
        <VideoCardThumbnail
          video={video}
          className="w-full h-full"
        />
      </div>

      {/* Content section - Contains interactive elements */}
      <div className={layout === 'grid' ? 'h-[45%] flex flex-col relative z-10' : 'flex-1 flex flex-col relative z-10'}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <VideoCardContent
            video={video}
            layout={layout}
            className="flex-1"
            isCardHovered={isHovered}
          />
        </motion.div>
      </div>

      {/* Enhanced sweep animation */}
      {contentLoaded && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, transparent 30%, ${colors.primary}08 50%, transparent 70%)`
          }}
          animate={{
            x: isHovered ? '100%' : '-100%',
            opacity: isHovered ? 0.8 : 0
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut'
          }}
        />
      )}

      {/* Corner accent */}
      <motion.div
        className="absolute top-0 right-0 w-8 h-8 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: contentLoaded ? 1 : 0 }}
        transition={{ delay: 0.3 }}
      >
        <div 
          className="absolute -top-4 -right-4 w-8 h-8 rounded-full opacity-60"
          style={{ backgroundColor: colors.primary }}
        />
      </motion.div>
    </motion.article>
  );
});