'use client';

import { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { NewsArticle } from '@/app/types/article';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { formatSafeDate } from '@/app/helpers/dateHelpers';
import { Divider } from '../ui/divider';

interface NewsCardContentProps {
  isCompact?: boolean;
  article: NewsArticle;
  isHovered?: boolean;
}

// Safe date formatting function with relative time


const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

const NewsCardContent = memo(function NewsCardContent({
  isCompact = false,
  article,
  isHovered = false,
}: NewsCardContentProps) {
  const { colors, mounted, isDark } = useLayoutTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const dateInfo = useMemo(() => formatSafeDate(article.publishedAt), [article.publishedAt]);
  const maxLength = isCompact ? 120 : 200;
  const shouldTruncate = article.headline.length > maxLength;
  const displayText = isExpanded || !shouldTruncate
    ? article.headline
    : `${article.headline.slice(0, maxLength)}...`;

  // Credibility indicator colors
  const getCredibilityColor = () => {
    if (!article.factCheck) return null;

    const evaluation = article.factCheck.evaluation;
    const colors = {
      TRUE: isDark ? '#22c55e' : '#16a34a',
      FALSE: isDark ? '#ef4444' : '#dc2626',
      MISLEADING: isDark ? '#f59e0b' : '#d97706',
      PARTIALLY_TRUE: isDark ? '#3b82f6' : '#2563eb',
      UNVERIFIABLE: isDark ? '#8b5cf6' : '#7c3aed'
    };

    return colors[evaluation as keyof typeof colors] || colors.UNVERIFIABLE;
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      className="relative z-10 flex flex-col h-full justify-between p-4"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Quote/Statement with enhanced typography */}
      <motion.div
        className="flex flex-col items-start justify-between flex-1"
        variants={itemVariants}
      >
        <div>
          <blockquote
            className={cn(
              "font-medium leading-relaxed transition-all duration-300 cursor-pointer line-clamp-5",
              isCompact ? 'text-sm' : 'md:text-sm lg:text-base 2xl:text-lg',
            )}
            style={{
              color: isHovered ? colors.foreground : colors.mutedForeground,
              fontFamily: "'Georgia', 'Times New Roman', serif" // Newspaper-like font
            }}
            onClick={() => shouldTruncate && setIsExpanded(!isExpanded)}
          >
            <motion.span
              className="relative"
              whileHover={{ letterSpacing: '0.01em' }}
              transition={{ duration: 0.2 }}
            >
              "{displayText}"
              {shouldTruncate && !isExpanded && (
                <motion.span
                  className="ml-1 font-semibold"
                  style={{ color: colors.primary }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Read more
                </motion.span>
              )}
            </motion.span>
          </blockquote>

        </div>
        {/* Source and Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {/* Source with logo */}
            <div className="flex items-center space-x-2 min-w-0">
              {article.source.logoUrl && (
                <motion.img
                  src={article.source.logoUrl}
                  alt={article.source.name}
                  className="w-4 h-4 rounded-sm object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <span
                className="text-xs font-medium truncate"
                style={{ color: colors.foreground }}
              >
                {article.source.name}
              </span>
            </div>

            <span
              className="w-1 h-1 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors.border }}
            />

            {/* Date display */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Clock className="w-3 h-3" style={{ color: colors.mutedForeground }} />
              <span
                className="text-xs"
                style={{ color: colors.mutedForeground }}
                title={dateInfo.absolute}
              >
                {dateInfo.relative}
              </span>
            </div>
          </div>

        </div>
      </motion.div>

      <Divider 
        variant='glow' />

      {/* Bottom Section */}
      {article.factCheck.verdict && <motion.div
        className="mt-2 pt-2 text-xs font-medium"
        variants={itemVariants}
      >
        
      </motion.div>}
    </motion.div>
  );
});

export default NewsCardContent;