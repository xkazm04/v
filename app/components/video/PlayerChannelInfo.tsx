'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { formatViewCount } from '@/app/utils/format';

interface ChannelInfoProps {
  channelName: string;
  avatarUrl?: string;
  verified?: boolean;
  subscribers?: number;
}

export function PlayerChannelInfo({ channelName, avatarUrl, verified = false, subscribers = 0 }: ChannelInfoProps) {
  return (
    <div className="flex items-center justify-between bg-background/80 rounded-xl px-2">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-4">
          <AvatarImage src={avatarUrl} alt={channelName} />
          <AvatarFallback>{channelName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center">
            <h3 className="font-medium">{channelName}</h3>
            {verified && (
              <CheckCircle className="h-4 w-4 ml-1 text-blue-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {formatViewCount(subscribers)} subscribers
          </p>
        </div>
      </div>
      <Button className="rounded-full" size="sm">
        Subscribe
      </Button>
    </div>
  );
}