'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Speaker } from '@/app/constants/speakers';
import { BadgeCheckIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon } from 'lucide-react';

interface SpeakerProfileProps {
  speaker: Speaker;
}

const DashSpeakerProfile = ({ speaker }: SpeakerProfileProps) => {
  const getTrendIcon = () => {
    switch (speaker.trending) {
      case 'up':
        return <TrendingUpIcon className="w-5 h-5 text-green-600" />;
      case 'down':
        return <TrendingDownIcon className="w-5 h-5 text-red-600" />;
      default:
        return <MinusIcon className="w-5 h-5 text-neutral-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <Image
            src={speaker.avatarUrl}
            alt={speaker.name}
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
          {speaker.verified && (
            <BadgeCheckIcon className="absolute -top-1 -right-1 w-6 h-6 text-blue-600" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-foreground truncate">
              {speaker.name}
            </h2>
            {getTrendIcon()}
          </div>
          
          <p className="text-primary font-medium mb-1">{speaker.title}</p>
          {speaker.party && (
            <p className="text-sm text-muted-foreground mb-3">{speaker.party}</p>
          )}
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {speaker.bio}
          </p>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-background rounded-lg border border-border/50">
          <div className="text-2xl font-bold text-foreground">
            {speaker.totalStatements}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Total Statements
          </div>
        </div>
        
        <div className="text-center p-3 bg-background rounded-lg border border-border/50">
          <div className="text-2xl font-bold text-green-600">
            {speaker.overallTruthRating}%
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Truth Rating
          </div>
        </div>
      </div>
      
      {/* Social Media Links */}
      {Object.keys(speaker.socialMedia).length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex flex-wrap gap-2">
            {Object.entries(speaker.socialMedia).map(([platform, handle]) => (
              <span
                key={platform}
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
              >
                {handle}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DashSpeakerProfile;