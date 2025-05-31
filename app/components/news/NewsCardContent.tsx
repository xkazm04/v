'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { NewsArticle } from '@/app/types/article';

interface NewsCardContentProps {
  article: NewsArticle;
  layout: 'grid' | 'compact';
  className?: string;
}

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: 0.1,
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

export const NewsCardContent = memo(function NewsCardContent({
  article,
  layout,
  className
}: NewsCardContentProps) {
  const isCompact = layout === 'compact';
  
  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {/* Source and Date */}
      <div className={`
        flex items-center justify-between mb-3
        ${isCompact ? 'text-xs' : 'text-sm'}
      `}>
        <span className="
          font-medium text-slate-600 dark:text-slate-400
          transition-colors duration-200
          group-hover:text-slate-800 dark:group-hover:text-slate-200
        ">
          {article.source.name}
        </span>
        
        <time className="text-slate-500 dark:text-slate-500 text-xs">
          {new Date(article.publishedAt).toLocaleDateString()}
        </time>
      </div>
    </motion.div>
  );
});