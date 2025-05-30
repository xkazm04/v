'use client';

import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Flag
} from 'lucide-react';
import { formatViewCount } from '@/app/utils/format';

interface VideoActionsProps {
  likes: number;
  onLike?: () => void;
  onDislike?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onReport?: () => void;
}

export function PlayerVideoActions({ 
  likes, 
  onLike, 
  onDislike, 
  onShare, 
  onSave, 
  onReport 
}: VideoActionsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex bg-muted rounded-full overflow-hidden">
        <Button variant="ghost" className="rounded-r-none flex gap-2" onClick={onLike}>
          <ThumbsUp className="h-5 w-5" />
          <span>{formatViewCount(likes)}</span>
        </Button>
        <Separator orientation="vertical" className="h-8 self-center" />
        <Button variant="ghost" className="rounded-l-none" onClick={onDislike}>
          <ThumbsDown className="h-5 w-5" />
        </Button>
      </div>
      
      <Button variant="outline" className="flex gap-2" onClick={onShare}>
        <Share2 className="h-5 w-5" />
        <span className="hidden sm:inline">Share</span>
      </Button>
      
      <Button variant="outline" className="flex gap-2" onClick={onSave}>
        <Bookmark className="h-5 w-5" />
        <span className="hidden sm:inline">Save</span>
      </Button>

      <Button variant="outline" className="flex gap-2" onClick={onReport}>
        <Flag className="h-5 w-5" />
        <span className="hidden sm:inline">Report</span>
      </Button>
      
      <Button variant="outline" size="icon">
        <MoreHorizontal className="h-5 w-5" />
      </Button>
    </div>
  );
}