'use client';

import { useState } from 'react';
import { VideoMetadata } from '@/app/types/video';
import { ChevronDown, ChevronUp, Eye, Calendar } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { formatTimeAgo, formatViewCount } from '@/app/utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerChannelInfo } from '@/app/components/video/PlayerChannelInfo';
import { PlayerVideoActions } from '@/app/components/video/PlayerVideoActions';
import { PlayerStatsPanel } from '@/app/components/video/PlayerStatsPanel';

interface VideoInfoProps {
  video: VideoMetadata;
}

export function VideoInfo({ video }: VideoInfoProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // Generate avatar URL and mock data since not in original type
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(video.channelName)}&background=random`;
  const mockSubscribers = Math.floor(Math.random() * 1000000) + 50000;
  
  return (
    <div className="space-y-6">
      {/* Video Title */}
      <div>
        <h1 className="text-xl font-bold md:text-2xl mb-2">{video.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{formatViewCount(video.views)} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatTimeAgo(video.uploadDate)}</span>
          </div>
          <Badge variant="secondary">{video.category}</Badge>
        </div>
      </div>
      
      {/* Channel and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <PlayerChannelInfo 
          channelName={video.channelName}
          avatarUrl={avatarUrl}
          verified={Math.random() > 0.5}
          subscribers={mockSubscribers}
        />
        
        <PlayerVideoActions 
          likes={video.likes}
          onLike={() => console.log('Liked')}
          onDislike={() => console.log('Disliked')}
          onShare={() => console.log('Shared')}
          onSave={() => console.log('Saved')}
          onReport={() => console.log('Reported')}
        />
      </div>
      
      {/* Description Card */}
      <Card>
        <CardContent className="p-4">
          <div 
            className="cursor-pointer"
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-wrap gap-2">
                {video.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              <Button variant="ghost" size="icon" className="shrink-0">
                {isDescriptionExpanded ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </Button>
            </div>
            
            <div className={`text-sm ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
              {video.description}
            </div>
            
            <AnimatePresence>
              {isDescriptionExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 pt-4 border-t"
                >
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Video ID: {video.id}</p>
                    <p>Duration: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</p>
                    <p>Upload Date: {new Date(video.uploadDate).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Fact-Check Panel */}
      <PlayerStatsPanel factCheck={video.factCheck} />
    </div>
  );
}