'use client';
import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsArticle } from '@/app/types/article';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { formatSafeDate } from '@/app/helpers/dateHelpers';
import { Clock } from 'lucide-react';
import Image from 'next/image';

interface NewsCardHeaderProps {
  article: NewsArticle;
  layout: 'grid' | 'compact';
  isHovered: boolean;
}

const headerVariants = {
  hidden: { opacity: 0, scale: 0.9, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: { duration: 0.2 }
  }
};

export const NewsCardHeader = memo(function NewsCardHeader({
  article,
  layout,
}: NewsCardHeaderProps) {
  const { colors, isDark } = useLayoutTheme();
  const dateInfo = useMemo(() => formatSafeDate(article.publishedAt), [article.publishedAt]);
  
  return (
    <AnimatePresence>
      <motion.div
        key="news-header"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          "relative w-full overflow-hidden rounded-t-lg",
          "flex items-center justify-between px-3 py-2"
        )}
      >
        {/* Country Flag Background */}
        <div className="absolute -right-20 inset-0 z-0">
          <Image
            src="/countries/country_usa.svg"
            alt={`${article.source.name} country flag`}
            fill
            className={cn(
              "object-contain",
              isDark ? "opacity-45" : "opacity-50"
            )}
            style={{
              filter: isDark ? 'brightness(0.7)' : 'brightness(1.1)'
            }}
          />
        </div>
        <div className="relative z-10 w-full flex items-center justify-between">
          {/* Left Side - Source */}
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {article.source.logoUrl && (
              <motion.img
                src={article.source.logoUrl}
                alt={article.source.name}
                className={cn(
                  "w-4 h-4 rounded-sm object-cover flex-shrink-0",
                  "ring-1 ring-white/20"
                )}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            <span
              className={cn(
                "text-sm font-semibold truncate",
                "drop-shadow-sm"
              )}
              style={{ 
                color: colors.foreground,
                textShadow: isDark 
                  ? '0 1px 2px rgba(0,0,0,0.8)' 
                  : '0 1px 2px rgba(255,255,255,0.8)'
              }}
            >
              {article.source.name}
            </span>
          </div>

          {/* Right Side - Date */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Clock 
              className="w-3 h-3 drop-shadow-sm" 
              style={{ 
                color: colors.mutedForeground,
                filter: isDark 
                  ? 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' 
                  : 'drop-shadow(0 1px 1px rgba(255,255,255,0.8))'
              }} 
            />
            <span
              className={cn(
                "text-xs font-medium",
                "drop-shadow-sm whitespace-nowrap"
              )}
              style={{ 
                color: colors.mutedForeground,
                textShadow: isDark 
                  ? '0 1px 1px rgba(0,0,0,0.8)' 
                  : '0 1px 1px rgba(255,255,255,0.8)'
              }}
              title={dateInfo.absolute}
            >
              {dateInfo.relative}
            </span>
          </div>
        </div>

        {/* Gradient Overlay for better text readability */}
        <div
          className={cn(
            "absolute inset-0 z-[1]",
            isDark 
              ? "bg-gradient-to-r from-black/40 via-transparent to-black/40"
              : "bg-gradient-to-r from-white/60 via-transparent to-white/60"
          )}
        />
      </motion.div>
    </AnimatePresence>
  );
});