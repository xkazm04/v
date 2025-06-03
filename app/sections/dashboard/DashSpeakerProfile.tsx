'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Speaker } from '@/app/constants/speakers';
import { 
  BadgeCheckIcon, 
  TrendingUpIcon, 
  TrendingDownIcon, 
  MinusIcon,
  MapPin,
  Calendar,
  Users,
  MessageSquare
} from 'lucide-react';

interface SpeakerProfileProps {
  speaker: Speaker;
}

// Add country mapping - extend Speaker type to include country if needed
const getCountryInfo = (speakerName: string) => {
  // Mock country data - in real app this would come from speaker object
  const countryMap: Record<string, { flag: string; name: string; code: string }> = {
    'Donald Trump': { flag: '🇺🇸', name: 'United States', code: 'US' },
    'Joe Biden': { flag: '🇺🇸', name: 'United States', code: 'US' },
    'Barack Obama': { flag: '🇺🇸', name: 'United States', code: 'US' },
    'Kamala Harris': { flag: '🇺🇸', name: 'United States', code: 'US' },
  };
  return countryMap[speakerName] || { flag: '🌍', name: 'International', code: 'INT' };
};

const DashSpeakerProfile = ({ speaker }: SpeakerProfileProps) => {
  const country = getCountryInfo(speaker.name);
  
  const getTrendIcon = () => {
    switch (speaker.trending) {
      case 'up':
        return <TrendingUpIcon className="w-5 h-5 text-emerald-500" />;
      case 'down':
        return <TrendingDownIcon className="w-5 h-5 text-red-500" />;
      default:
        return <MinusIcon className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getTrendLabel = () => {
    switch (speaker.trending) {
      case 'up': return 'Trending Up';
      case 'down': return 'Trending Down';
      default: return 'Stable';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50/50 dark:from-slate-900 dark:via-indigo-950/50 dark:to-purple-950/30 rounded-3xl p-8 shadow-2xl overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        {/* Geometric patterns */}
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-gradient-to-br from-primary to-purple-500 transform -translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 transform translate-x-16 translate-y-16" />
        
        {/* Pattern overlay */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Floating accent elements */}
      <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse" />
      <div className="absolute top-12 right-8 w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-300" />
      <div className="absolute top-8 right-16 w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-700" />
      
      <div className="relative z-10">
        {/* Main Profile Section */}
        <div className="flex items-start gap-6 mb-8">
          <div className="relative">
            <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/50 dark:ring-gray-800/50">
              <Image
                src={speaker.avatarUrl}
                alt={speaker.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Status indicators */}
            {speaker.verified && (
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <BadgeCheckIcon className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-lg border border-gray-200 dark:border-gray-700">
                <span className="text-xs font-bold text-primary">
                  {speaker.reliabilityScore}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Name and trending */}
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-3xl font-black text-foreground tracking-tight leading-tight">
                {speaker.name}
              </h2>
              <div className="flex items-center gap-1 bg-white/60 dark:bg-gray-800/60 rounded-full px-3 py-1 backdrop-blur-sm">
                {getTrendIcon()}
                <span className="text-xs font-medium text-muted-foreground">
                  {getTrendLabel()}
                </span>
              </div>
            </div>
            
            {/* Title and Party */}
            <div className="space-y-1 mb-4">
              <p className="text-lg font-bold text-primary">{speaker.title}</p>
              {speaker.party && (
                <p className="text-sm text-muted-foreground font-medium">{speaker.party}</p>
              )}
            </div>

            {/* Country Info */}
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {country.flag} {country.name}
              </span>
              <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-full">
                {country.code}
              </span>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground leading-relaxed bg-white/30 dark:bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            {speaker.bio}
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-lg text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
            <div className="relative z-10">
              <MessageSquare className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-3xl font-black text-foreground mb-1">
                {speaker.totalStatements}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                Statements
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-lg text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10" />
            <div className="relative z-10">
              <Users className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
              <div className="text-3xl font-black text-foreground mb-1">
                {speaker.reliabilityScore}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                Reliability
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social Media Section */}
        {Object.keys(speaker.socialMedia).length > 0 && (
          <div className="pt-6 border-t border-white/20 dark:border-gray-700/20">
            <div className="flex flex-wrap gap-2">
              {Object.entries(speaker.socialMedia).map(([platform, handle]) => (
                <motion.span
                  key={platform}
                  whileHover={{ scale: 1.05 }}
                  className="text-xs bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary border border-primary/30 px-3 py-2 rounded-full font-medium shadow-sm backdrop-blur-sm"
                >
                  {handle}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashSpeakerProfile;