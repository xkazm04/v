'use client';

import { useState, useRef, useEffect } from 'react';
import { VideoMetadata } from '@/app/types/video';
import { 
  Play, 
  Heart, 
  MessageCircle, 
  Share2, 
  BookmarkPlus, 
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { formatViewCount } from '@/app/utils/format';
import { useRouter } from 'next/navigation';

interface MobileVideoPlayerProps {
  video: VideoMetadata;
  autoPlay?: boolean;
}

export function MobileVideoPlayer({ video, autoPlay = true }: MobileVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  
  // Handle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Autoplay
  useEffect(() => {
    if (videoRef.current && autoPlay) {
      videoRef.current.play().catch(error => {
        console.error("Autoplay failed:", error);
        setIsPlaying(false);
      });
    }
  }, [autoPlay]);
  
  // Handle exit
  const handleExit = () => {
    router.push('/');
  };
  
  return (
    <div className="mobile-video-player">
      <div 
        className="relative h-full w-full"
        onClick={() => {
          setShowControls(!showControls);
        }}
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          loop={false}
          playsInline
          muted={false}
          className="h-full w-full object-cover"
        />
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        
        {/* Top bar with exit button */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white rounded-full bg-black/30" 
            onClick={handleExit}
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Center play button (only when paused) */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Button 
                variant="outline" 
                size="icon" 
                className="h-20 w-20 rounded-full bg-black/30 border-white/20 text-white hover:bg-black/50"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
              >
                <Play className="h-10 w-10" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Right side action buttons */}
        <div className="mobile-actions">
          <div className="flex flex-col items-center">
            <div className="relative h-12 w-12 mb-1">
              <Image
                src={video.channel.avatarUrl}
                alt={video.channel.name}
                fill
                className="object-cover rounded-full ring-2 ring-white"
              />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-2 py-1 text-white text-xs bg-primary rounded-full"
            >
              Follow
            </Button>
          </div>
          
          <div className="flex flex-col items-center mt-6">
            <Button variant="ghost" size="icon" className="text-white">
              <Heart className="h-7 w-7" />
            </Button>
            <span className="text-white text-xs mt-1">{formatViewCount(video.likes)}</span>
          </div>
          
          <div className="flex flex-col items-center mt-4">
            <Button variant="ghost" size="icon" className="text-white">
              <MessageCircle className="h-7 w-7" />
            </Button>
            <span className="text-white text-xs mt-1">
              {formatViewCount(Math.floor(video.views * 0.01))}
            </span>
          </div>
          
          <div className="flex flex-col items-center mt-4">
            <Button variant="ghost" size="icon" className="text-white">
              <BookmarkPlus className="h-7 w-7" />
            </Button>
            <span className="text-white text-xs mt-1">Save</span>
          </div>
          
          <div className="flex flex-col items-center mt-4">
            <Button variant="ghost" size="icon" className="text-white">
              <Share2 className="h-7 w-7" />
            </Button>
            <span className="text-white text-xs mt-1">Share</span>
          </div>
        </div>
        
        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-medium text-lg">{video.title}</h3>
          <p className="text-white/80 text-sm mt-1">
            {video.channel.name} • {formatViewCount(video.views)} views
          </p>
        </div>
      </div>
    </div>
  );
}