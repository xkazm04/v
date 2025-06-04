'use client';
import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsArticle } from '@/app/types/article';
import { FakeStamp } from '../icons/stamps';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';

interface NewsCardHeaderProps {
  article: NewsArticle;
  layout: 'grid' | 'compact';
  isHovered: boolean;
  priority?: 'high' | 'medium' | 'low';
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
      type: 'spring',
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: { duration: 0.2 }
  }
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -180 },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 400,
      damping: 15
    }
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.2 }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const NewsCardHeader = memo(function NewsCardHeader({
  article,
  layout,
}: NewsCardHeaderProps) {
  const { colors, mounted, isDark } = useLayoutTheme();
  const isCompact = layout === 'compact';
  
  // Enhanced time calculations
  const timeMetrics = useMemo(() => {
    const now = Date.now();
    const publishTime = new Date(article.publishedAt).getTime();
    const timeDiff = now - publishTime;
    
    const isRecent = timeDiff < 3600000; // 1 hour
    const isVeryRecent = timeDiff < 1800000; // 30 minutes
    const isBreaking = article.isBreaking;
    const isUrgent = isBreaking && isVeryRecent;
    
    return { isRecent, isVeryRecent, isBreaking, isUrgent, timeDiff };
  }, [article.publishedAt, article.isBreaking]);

  // Theme-aware badge colors
  const getBadgeColors = (type: 'breaking' | 'new' | 'urgent' | 'priority') => {
    const baseColors = {
      breaking: {
        bg: isDark ? 'rgba(239, 68, 68, 0.9)' : 'rgba(220, 38, 38, 0.9)',
        text: '#ffffff',
        border: isDark ? '#ef4444' : '#dc2626',
        glow: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(220, 38, 38, 0.3)'
      },
      new: {
        bg: isDark ? 'rgba(59, 130, 246, 0.9)' : 'rgba(37, 99, 235, 0.9)',
        text: '#ffffff',
        border: isDark ? '#3b82f6' : '#2563eb',
        glow: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)'
      },
      urgent: {
        bg: isDark ? 'rgba(245, 158, 11, 0.9)' : 'rgba(217, 119, 6, 0.9)',
        text: '#ffffff',
        border: isDark ? '#f59e0b' : '#d97706',
        glow: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(217, 119, 6, 0.3)'
      },
      priority: {
        bg: isDark ? 'rgba(139, 92, 246, 0.9)' : 'rgba(124, 58, 237, 0.9)',
        text: '#ffffff',
        border: isDark ? '#8b5cf6' : '#7c3aed',
        glow: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(124, 58, 237, 0.3)'
      }
    };
    
    return baseColors[type];
  };

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {/* Breaking News Stamp - positioned outside card boundaries */}
      {timeMetrics.isBreaking && (
        <motion.div
          key="breaking-stamp"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            "absolute z-20",
            isCompact ? "top-0 -right-3" : "top-0 -right-5"
          )}
        >
          <motion.div
            variants={badgeVariants}
            whileHover="hover"
            className="relative"
          >
            <FakeStamp 
              width={isCompact ? 80 : 100} 
              height={isCompact ? 24 : 30} 
              color={getBadgeColors('breaking').bg}
            />
            
            {/* Glow effect for breaking news */}
            {timeMetrics.isUrgent && (
              <motion.div
                className="absolute inset-0 rounded-full blur-md"
                style={{ 
                  backgroundColor: getBadgeColors('breaking').glow,
                  zIndex: -1
                }}
                variants={pulseVariants}
                animate="pulse"
              />
            )}
          </motion.div>
        </motion.div>
      )}

    </AnimatePresence>
  );
});