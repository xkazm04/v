'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Heart, Repeat2, MessageCircle, CheckCircle } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { xService, PredefinedTweet } from '@/app/lib/services/x-service';

interface PredefinedTweetsProps {
  onSelectTweet: (tweet: PredefinedTweet) => void;
  selectedTweetId?: string;
  disabled?: boolean;
}

const PredefinedTweets: React.FC<PredefinedTweetsProps> = ({
  onSelectTweet,
  selectedTweetId,
  disabled
}) => {
  const { colors, isDark } = useLayoutTheme();
  const predefinedTweets = xService.getPredefinedTweets();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const getCardVariants = (index: number) => {
    const isOdd = index % 2 === 1; // Second tweet (index 1) comes from right
    
    return {
      hidden: {
        opacity: 0,
        x: isOdd ? '100vw' : '-100vw', // Start from way off screen
        y: 20,
        scale: 0.8,
        rotate: isOdd ? 5 : -5
      },
      visible: {
        opacity: 1,
        x: isOdd ? '12.5%' : 0, // Second tweet (from right) stops at 1/8 from left (75% width from right side)
        y: 0,
        scale: 1,
        rotate: 0,
        transition: {
          duration: 1.8,
          type: "spring",
          stiffness: 80,
          damping: 20
        }
      }
    };
  };

  return (
    <div className="relative overflow-hidden"> {/* Add overflow hidden to parent */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
            Select a Predefined Tweet
          </h3>
          <p className="text-sm" style={{ color: colors.mutedForeground }}>
            Choose from examples below to test fact-checking capabilities
          </p>
        </div>

        <div className="space-y-4 relative">
          {predefinedTweets.map((tweet, index) => (
            <motion.div
              key={tweet.id}
              variants={getCardVariants(index)}
              className={`relative cursor-pointer group transition-all duration-300 rounded-xl border-2 overflow-hidden ${
                disabled ? 'cursor-not-allowed opacity-50' : ''
              }`}
              style={{
                borderColor: selectedTweetId === tweet.id
                  ? isDark ? 'rgba(29, 161, 242, 0.6)' : 'rgba(29, 161, 242, 0.4)'
                  : isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.4)',
                background: selectedTweetId === tweet.id
                  ? isDark ? 'rgba(29, 161, 242, 0.1)' : 'rgba(29, 161, 242, 0.05)'
                  : isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                width: index % 2 === 1 ? '75%' : '75%', 
                marginLeft: index % 2 === 1 ? '25%' : '0%',
                zIndex: 10 - index 
              }}
              onClick={() => !disabled && onSelectTweet(tweet)}
              whileHover={!disabled ? { 
                scale: 1.02,
                x: index % 2 === 1 ? '12.5%' : 0, // Maintain position on hover
                transition: { duration: 0.2 }
              } : {}}
              whileTap={!disabled ? { 
                scale: 0.98,
                x: index % 2 === 1 ? '12.5%' : 0, // Maintain position on tap
                transition: { duration: 0.1 }
              } : {}}
            >
              {/* Selection Indicator */}
              {selectedTweetId === tweet.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 z-10"
                >
                  <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </motion.div>
              )}

              {/* Direction Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.3 }}
                className="absolute top-3 left-3 z-10"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: index % 2 === 1 
                      ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.2))'
                      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
                    color: index % 2 === 1 ? '#ec4899' : '#3b82f6'
                  }}
                >
                  {index % 2 === 1 ? '→' : '←'}
                </div>
              </motion.div>

              <div className="p-4">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-full bg-sky-500/20 flex-shrink-0">
                    <Twitter className="h-4 w-4 text-sky-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm truncate" style={{ color: colors.foreground }}>
                        {tweet.preview.display_name}
                      </h4>
                      {tweet.preview.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      )}
                      <span className="text-xs" style={{ color: colors.mutedForeground }}>
                        @{tweet.preview.username}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-1">
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: index % 2 === 1
                            ? isDark ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.1)'
                            : isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                          color: index % 2 === 1
                            ? isDark ? 'rgba(236, 72, 153, 0.9)' : 'rgba(236, 72, 153, 0.8)'
                            : isDark ? 'rgba(59, 130, 246, 0.9)' : 'rgba(59, 130, 246, 0.8)'
                        }}
                      >
                        {tweet.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p 
                  className="text-sm leading-relaxed mb-3 line-clamp-3"
                  style={{ color: colors.foreground }}
                >
                  {tweet.preview.content}
                </p>

                {/* Engagement */}
                <div className="flex items-center gap-4 text-xs" style={{ color: colors.mutedForeground }}>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{xService.formatEngagement(tweet.preview.engagement.likes)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Repeat2 className="h-3 w-3" />
                    <span>{xService.formatEngagement(tweet.preview.engagement.retweets)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{xService.formatEngagement(tweet.preview.engagement.replies)}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-3 pt-3 border-t" style={{ borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.4)' }}>
                  <p className="text-xs" style={{ color: colors.mutedForeground }}>
                    {tweet.description}
                  </p>
                </div>
              </div>

              {/* Hover Overlay */}
              {!disabled && (
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    background: index % 2 === 1
                      ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(219, 39, 119, 0.05))'
                      : 'linear-gradient(135deg, rgba(29, 161, 242, 0.1), rgba(59, 130, 246, 0.05))',
                    pointerEvents: 'none' 
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PredefinedTweets;