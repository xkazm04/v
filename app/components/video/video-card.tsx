'use client';

import Link from 'next/link';
import Image from 'next/image';
import { VideoMetadata } from '@/app/types/video';
import { formatDuration, formatTimeAgo, formatViewCount } from '@/app/utils/format';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface VideoCardProps {
  video: VideoMetadata;
  layout?: 'grid' | 'list' | 'compact';
}

export function VideoCard({ video, layout = 'grid' }: VideoCardProps) {
  if (layout === 'compact') {
    return (
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex gap-2 cursor-pointer group"
      >
        <Link href={`/watch?v=${video.id}`} className="block relative w-40 h-24 flex-shrink-0">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover rounded-md"
          />
          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/watch?v=${video.id}`} className="block">
            <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary">
              {video.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              {video.channel.name}
              {video.channel.verified && (
                <CheckCircle className="h-3 w-3 ml-1 inline text-verified" />
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatViewCount(video.views)} views • {formatTimeAgo(video.uploadDate)}
            </p>
          </Link>
        </div>
      </motion.div>
    );
  }
  
  if (layout === 'list') {
    return (
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="flex gap-4 cursor-pointer group"
      >
        <Link href={`/watch?v=${video.id}`} className="block relative w-60 h-32 flex-shrink-0">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover rounded-md"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/watch?v=${video.id}`} className="block">
            <h3 className="text-lg font-medium line-clamp-2 group-hover:text-primary">
              {video.title}
            </h3>
            <div className="flex items-center mt-2">
              <div className="relative h-8 w-8 mr-2">
                <Image
                  src={video.channel.avatarUrl}
                  alt={video.channel.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <p className="text-sm flex items-center">
                  {video.channel.name}
                  {video.channel.verified && (
                    <CheckCircle className="h-3 w-3 ml-1 inline text-verified" />
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatViewCount(video.views)} views • {formatTimeAgo(video.uploadDate)}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {video.description}
            </p>
          </Link>
        </div>
      </motion.div>
    );
  }

  // Default grid layout
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer group"
    >
      <Link href={`/watch?v=${video.id}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
        <div className="mt-2 flex gap-3">
          <div className="relative h-9 w-9 flex-shrink-0">
            <Image
              src={video.channel.avatarUrl}
              alt={video.channel.name}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium line-clamp-2 group-hover:text-primary">
              {video.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 flex items-center">
              {video.channel.name}
              {video.channel.verified && (
                <CheckCircle className="h-3 w-3 ml-1 inline text-verified" />
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatViewCount(video.views)} views • {formatTimeAgo(video.uploadDate)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}