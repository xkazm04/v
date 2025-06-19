'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/app/lib/utils';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { ResearchResult } from '@/app/types/article';
import NewsCardSpeaker from './NewsCardSpeaker';

interface VintageTopicBannerProps {
  research?: ResearchResult; 
  className?: string;
}

export const VintageTopicBanner = memo(function VintageTopicBanner({
  research,
  className
}: VintageTopicBannerProps) {
  const { isDark, vintage, colors } = useLayoutTheme();

  return (
    <motion.div
      className={cn(
        'relative h-8 flex items-center justify-start px-4 overflow-hidden',
        className
      )}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* ✅ Background */}
      <div className="absolute inset-0">
        {isDark ? (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, 
                ${colors.background} 0%, 
                ${colors.muted} 50%, 
                ${colors.background} 100%
              )`,
              borderBottom: `2px solid ${colors.border}`
            }}
          />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, 
                  ${vintage.aged} 0%, 
                  ${vintage.paper} 25%, 
                  ${vintage.highlight} 50%, 
                  ${vintage.paper} 75%, 
                  ${vintage.aged} 100%
                )`,
                borderBottom: `1px double ${vintage.ink}60`
              }}
            />
            
            {/* Vintage ornamental corners */}
            <div className="absolute top-1 left-4 w-4 h-1 opacity-30"
                 style={{ background: `linear-gradient(90deg, ${vintage.ink}, transparent)` }} />
            <div className="absolute top-1 right-4 w-4 h-1 opacity-30"
                 style={{ background: `linear-gradient(-90deg, ${vintage.ink}, transparent)` }} />
          </>
        )}
      </div>

      {/* ✅ Topic title */}
      <motion.div
        className="relative z-10 flex items-center gap-3"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div
          className="text-sm font-bold tracking-wide"
          style={{
            fontFamily: "'Times New Roman', serif",
            color: isDark ? colors.foreground : vintage.ink,
            textShadow: isDark 
              ? 'none' 
              : `1px 1px 2px ${vintage.paper}, -1px -1px 1px ${vintage.highlight}`,
            letterSpacing: '0.1em'
          }}
        >
          <NewsCardSpeaker research={research} />
        </div>
      </motion.div>
    </motion.div>
  );
});