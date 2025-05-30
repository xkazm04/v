'use client';

import { useState } from 'react';
import { VideoMetadata } from '@/app/types/video';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { formatTimeAgo, formatViewCount } from '@/app/utils/format';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoInfoProps {
  video: VideoMetadata;
}

export function VideoInfo({ video }: VideoInfoProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold md:text-2xl">{video.title}</h1>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src={video.channel.avatarUrl} alt={video.channel.name} />
            <AvatarFallback>{video.channel.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <h3 className="font-medium">{video.channel.name}</h3>
              {video.channel.verified && (
                <CheckCircle className="h-4 w-4 ml-1 text-verified" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatViewCount(video.channel.subscribers)} subscribers
            </p>
          </div>
          <Button className="ml-4 rounded-full" size="sm">
            Subscribe
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-full overflow-hidden">
            <Button variant="ghost" className="rounded-r-none flex gap-2">
              <ThumbsUp className="h-5 w-5" />
              <span>{formatViewCount(video.likes)}</span>
            </Button>
            <Separator orientation="vertical" className="h-8 self-center" />
            <Button variant="ghost" className="rounded-l-none">
              <ThumbsDown className="h-5 w-5" />
            </Button>
          </div>
          
          <Button variant="outline" className="flex gap-2">
            <Share2 className="h-5 w-5" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          
          <Button variant="outline" className="flex gap-2">
            <Bookmark className="h-5 w-5" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div 
        className="bg-muted p-4 rounded-lg cursor-pointer"
        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {formatViewCount(video.views)} views • {formatTimeAgo(video.uploadDate)}
            </p>
            <div className="flex flex-wrap gap-2">
              {video.tags.map(tag => (
                <span key={tag} className="text-xs bg-card px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="icon">
            {isDescriptionExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
        
        <AnimatePresence>
          {isDescriptionExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <p className="text-sm whitespace-pre-line">{video.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}