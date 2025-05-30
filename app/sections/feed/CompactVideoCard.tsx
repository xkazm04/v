'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { VideoMetadata } from '@/app/types/video';
import { getEvaluationIcon, getEvaluationColor } from '@/app/helpers/factCheck';
import { formatDuration, formatViewCount, formatTimeAgo } from '@/app/utils/format';
import { Badge } from '@/app/components/ui/badge';
import { Eye, Calendar, ThumbsUp } from 'lucide-react';
import VideoTruthBar from './VideoTruthBar';

interface CompactVideoCardProps {
  video: VideoMetadata;
  priority?: boolean;
}

const CompactVideoCard = ({ video, priority = false }: CompactVideoCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link href={`/watch?v=${video.id}`}>
        <div className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
          {/* Thumbnail */}
          <div className="relative w-32 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
            {!imageError && (
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className={`object-cover transition-all duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                } group-hover:scale-105`}
                sizes="128px"
                priority={priority}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}
            
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            
            {/* Duration Badge */}
            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
              {formatDuration(video.duration)}
            </div>
            
            {/* Fact Check Badge */}
            <div className="absolute top-1 left-1 flex items-center gap-1 bg-background/90 text-foreground text-xs px-1.5 py-0.5 rounded backdrop-blur-sm border border-border/30">
              {getEvaluationIcon(video.factCheck.evaluation, 'sm')}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title */}
            <h4 className="font-medium text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {video.title}
            </h4>
            
            {/* Channel */}
            <p className="text-xs text-muted-foreground font-medium">
              {video.channelName}
            </p>
            
            {/* Stats Row */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{formatViewCount(video.views)}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                <span>{formatViewCount(video.likes)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatTimeAgo(video.uploadDate)}</span>
              </div>
            </div>
            
            {/* Truth Bar */}
            <VideoTruthBar 
              factCheck={video.factCheck}
              height="h-1.5"
              showLabel={false}
              compact={true}
            />
            
            {/* Bottom Row */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs px-2 py-0">
                {video.category}
              </Badge>
              <div className="flex items-center gap-1 text-xs">
                <span className={`font-medium ${getEvaluationColor(video.factCheck.evaluation)}`}>
                  {video.factCheck.evaluation}
                </span>
                <span className="text-muted-foreground">
                  ({video.factCheck.confidence}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CompactVideoCard;