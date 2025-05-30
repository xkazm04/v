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
      className={config.containerClass}
    >
      <Link href={`/watch?v=${video.id}`} className="block h-full">
        <motion.div 
          className={config.thumbnailClass}
          onMouseEnter={() => config.showOverlay && setShowOverlay(true)}
          onMouseLeave={() => config.showOverlay && setShowOverlay(false)}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {!imageError && (
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className={`object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${layout === 'grid' ? 'group-hover:scale-105' : ''}`}
              sizes={
                layout === 'grid' 
                  ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  : layout === 'list' 
                    ? "320px"
                    : "256px"
              }
              priority={priority}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
          
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
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
            className="absolute bottom-2 right-2 bg-background/90 text-foreground text-xs px-2 py-1 rounded-md backdrop-blur-sm font-medium border border-border/30"
          >
            {formatDuration(video.duration)}
          </motion.div>
          
          {/* Fact Check Badge */}
          <motion.div 
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            className="absolute top-2 left-2 flex items-center gap-1.5 bg-background/90 text-foreground text-xs px-2.5 py-1.5 rounded-md backdrop-blur-sm border border-border/30"
          >
            {getEvaluationIcon(video.factCheck.evaluation, layout === 'compact' ? 'sm' : 'md')}
            {layout !== 'compact' && (
              <span className={`font-semibold ${getEvaluationColor(video.factCheck.evaluation)}`}>
                {video.factCheck.evaluation}
              </span>
            )}
          </motion.div>
        </motion.div>
        
        <div className={config.contentClass}>
          <div className="flex-1 min-w-0">
            <h3 className={config.titleClass}>
              {video.title}
            </h3>
            
            <div className="space-y-2">
              {/* Channel Name */}
              <p className="text-sm font-medium text-foreground/80">
                {video.channelName}
              </p>
              
              {/* Metadata Grid */}
              <div className={`grid gap-2 ${layout === 'grid' ? 'grid-cols-2' : layout === 'list' ? 'grid-cols-4' : 'grid-cols-2'}`}>

              </div>
              
              {/* Truth Bar */}
              <VideoTruthBar 
                factCheck={video.factCheck}
                height={config.progressBarHeight}
                showLabel={layout !== 'compact'}
                compact={layout === 'compact'}
              />
              
              {/* Category Tag */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20`}>
                  {video.category}
                </span>
                
                {layout !== 'compact' && (
                  <span className="text-xs text-muted-foreground">
                    {video.factCheck.confidence}% confidence
                  </span>
                )}
              </div>
            </div>
            
            {config.showDescription && (
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                {video.description}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default UnifiedFeedLayout;