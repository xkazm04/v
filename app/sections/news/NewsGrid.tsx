'use client';

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { NewsArticle } from '@/app/types/article';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { NewsCardHeader } from '@/app/components/news/NewsCardHeader';
import NewsCardContent from '@/app/components/news/NewsCardContent';

interface NewsCardProps {
  article: NewsArticle;
  layout?: 'grid' | 'compact';
  priority?: 'high' | 'medium' | 'low';
  onView?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  viewCount?: number;
  isBookmarked?: boolean;
  className?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
};

export const NewsCard = memo(function NewsCard({
  article,
  layout = 'grid',
  priority = 'medium',
  onView,
  onShare,
  onBookmark,
  viewCount,
  isBookmarked,
  className
}: NewsCardProps) {
  const { cardColors, colors, mounted, isDark } = useLayoutTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  if (!mounted) {
    return null;
  }

  const isCompact = layout === 'compact';

  return (
    <motion.article
      className={cn(
        "relative overflow-hidden rounded-lg group cursor-pointer",
        "border backdrop-blur-sm transition-all duration-300",
        isCompact ? "h-32" : "h-48 md:h-56",
        className
      )}
      style={{
        backgroundColor: `${cardColors.background}f8`,
        borderColor: cardColors.border,
        boxShadow: `0 2px 8px ${cardColors.shadow}`
      }}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onView}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        {/* Vintage newspaper texture */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${colors.foreground} 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: isHovered 
              ? `linear-gradient(135deg, ${cardColors.background} 0%, ${colors.muted} 100%)`
              : 'transparent'
          }}
          animate={{
            opacity: isHovered ? 0.3 : 0
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Border glow on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              boxShadow: `inset 0 0 0 1px ${colors.primary}40, 0 0 20px ${colors.primary}20`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Header with badges */}
      <NewsCardHeader
        article={article}
        layout={layout}
        isHovered={isHovered}
      />

      {/* Content */}
      <NewsCardContent
        article={article}
        isCompact={isCompact}
        isHovered={isHovered}
      />

      {/* Hover shine effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(45deg, transparent 30%, ${colors.primary}10 50%, transparent 70%)`
        }}
        animate={{
          x: isHovered ? ['0%', '100%'] : '0%',
          opacity: isHovered ? [0, 0.5, 0] : 0
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut'
        }}
      />
    </motion.article>
  );
});