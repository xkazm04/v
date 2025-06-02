'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FeedProps } from '@/app/types/video';
import { LAYOUT_CONFIGS } from '@/app/config/layout';
import { getEvaluationIcon, getEvaluationColor } from '@/app/helpers/factCheck';
import { itemVariants, badgeVariants } from '@/app/helpers/animation';
import { formatDuration } from '@/app/utils/format';
import { LayoutType } from '@/app/types/layout';
import VideoFactOverlay from './VideoFactOverlay';
import VideoTruthBar from './VideoTruthBar';

interface UnifiedFeedLayoutProps extends FeedProps {
  layout: LayoutType;
}

const UnifiedFeedLayout = ({ 
  imageLoaded, 
  setImageLoaded, 
  imageError, 
  setImageError, 
  video, 
  priority = false,
  layout = 'grid'
}: UnifiedFeedLayoutProps) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const config = LAYOUT_CONFIGS[layout];

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className={`${config.containerClass} group`}
    >
      <Link href={`/watch?v=${video.id}`} className="block h-full">
        <motion.div
          className={`
            bg-card border border-border/60 rounded-xl overflow-hidden max-w-[700px]
            shadow-sm hover:shadow-md transition-all duration-300
            relative
            ${layout === 'grid' ? 'p-0' : 'p-4'}
            hover:border-border/80 hover:-translate-y-0.5
          `}
          style={{
            boxShadow: `
              0 1px 3px rgba(0, 0, 0, 0.06),
              0 1px 2px rgba(0, 0, 0, 0.04),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1)
            `
          }}
          whileHover={{ 
            y: -2,
            boxShadow: `
              0 4px 12px rgba(0, 0, 0, 0.08),
              0 2px 4px rgba(0, 0, 0, 0.06),
              inset 0 0 0 1px rgba(255, 255, 255, 0.15)
            `
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Card Inner Container */}
          <div className={layout === 'grid' ? 'p-0' : 'flex gap-4 h-full'}>
            {/* Thumbnail Section */}
            <motion.div 
              className={`
                ${layout === 'grid' 
                  ? 'relative aspect-video w-full overflow-hidden' 
                  : layout === 'list'
                    ? 'relative w-72 h-44 flex-shrink-0 overflow-hidden rounded-md'
                    : 'relative w-56 h-32 flex-shrink-0 overflow-hidden rounded-md'
                }
                bg-muted/30
              `}
              onMouseEnter={() => config.showOverlay && setShowOverlay(true)}
              onMouseLeave={() => config.showOverlay && setShowOverlay(false)}
            >
              {!imageError && (
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  fill
                  className={`object-cover transition-all duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  } group-hover:scale-105`}
                  sizes={
                    layout === 'grid' 
                      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      : layout === 'list' 
                        ? "288px"
                        : "224px"
                  }
                  priority={priority}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}
              
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-muted/50 animate-pulse">
                  <div className="absolute inset-4 bg-muted/30 rounded"></div>
                </div>
              )}
              
              {/* Fact Check Overlay */}
              <AnimatePresence>
                {showOverlay && config.overlayContent !== 'none' && (
                  <VideoFactOverlay 
                    factCheck={video.factCheck}
                    overlayType={config.overlayContent}
                  />
                )}
              </AnimatePresence>
              
              {/* Duration Badge */}
              <motion.div 
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                className="
                  absolute bottom-2 right-2 
                  bg-background/95 text-foreground 
                  text-xs px-2.5 py-1.5 rounded-md 
                  backdrop-blur-sm font-medium 
                  border border-border/40
                  shadow-sm
                "
              >
                {formatDuration(video.duration)}
              </motion.div>
              
              {/* Fact Check Badge */}
              <motion.div 
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                className="
                  absolute top-2 left-2 
                  flex items-center gap-1.5 
                  bg-background/95 text-foreground 
                  text-xs px-2.5 py-1.5 rounded-md 
                  backdrop-blur-sm border border-border/40
                  shadow-sm
                "
              >
                {getEvaluationIcon(video.factCheck.evaluation || 'Unknown', layout === 'compact' ? 'sm' : 'md')}
                {layout !== 'compact' && (
                  <span className={`font-semibold ${getEvaluationColor(video.factCheck.evaluation || 'Unknown')}`}>
                    {video.factCheck.evaluation}
                  </span>
                )}
              </motion.div>
            </motion.div>
            
            {/* Content Section */}
            <div className={`
              ${layout === 'grid' 
                ? 'p-5 space-y-4' 
                : 'flex-1 min-w-0 flex flex-col justify-between space-y-3'
              }
            `}>
              <div className="flex-1 min-w-0 space-y-3">
                <h3 className={`${config.titleClass} leading-snug`}>
                  {video.title}
                </h3>
                
                {/* Channel Name */}
                <p className={`
                  font-medium text-foreground/70
                  ${layout === 'compact' ? 'text-xs' : 'text-sm'}
                `}>
                  {video.channelName}
                </p>
                
                {/* Truth Bar */}
                <div className="space-y-2">
                  <VideoTruthBar 
                    factCheck={video.factCheck}
                    showLabel={layout !== 'compact'}
                    compact={layout === 'compact'}
                  />
                </div>
                
                {config.showDescription && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                )}
              </div>
              
              {/* Footer Section */}
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <span className={`
                  inline-flex items-center px-2.5 py-1.5 rounded-full 
                  text-xs font-medium 
                  bg-primary/8 text-primary 
                  border border-primary/20
                  shadow-sm
                `}>
                  {video.category}
                </span>
                
                {layout !== 'compact' && (
                  <span className="text-xs text-muted-foreground font-medium">
                    {video.factCheck.confidence}% confidence
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Subtle paper texture overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
              `,
              mixBlendMode: 'multiply'
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default UnifiedFeedLayout;