'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { NewsArticle } from '@/app/types/article';

interface NewsCardThumbnailProps {
  article: NewsArticle;
  layout: 'grid' | 'compact';
  isHovered: boolean;
}

const quoteVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      delay: 0.2,
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

export const NewsCardThumbnail = memo(function NewsCardThumbnail({
  article,
  layout,
  isHovered
}: NewsCardThumbnailProps) {
  const isCompact = layout === 'compact';
  
  return (
    <div className={`
      relative overflow-hidden rounded-md
      ${isCompact ? 'h-16' : 'h-20'}
      bg-gradient-to-r from-slate-100/50 to-slate-200/30
      dark:from-slate-800/50 dark:to-slate-700/30
    `}>
      {/* News Source Logo (very low opacity) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {article.source.logoUrl ? (
          <Image
            src={article.source.logoUrl}
            alt={article.source.name}
            width={isCompact ? 40 : 60}
            height={isCompact ? 40 : 60}
            className="opacity-10 dark:opacity-5 object-contain filter grayscale"
          />
        ) : (
          <div className={`
            ${isCompact ? 'text-lg' : 'text-2xl'} 
            font-bold opacity-10 dark:opacity-5 text-slate-600
          `}>
            {article.source.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Citation Quote Overlay */}
      <motion.div
        variants={quoteVariants}
        initial="hidden"
        animate="visible"
        className="
          absolute inset-0 flex items-center justify-center p-3
          bg-gradient-to-br from-black/5 to-black/10
          dark:from-white/5 dark:to-white/10
        "
      >
        <div className="text-center">
          {/* Opening Quote */}
          <span className={`
            text-amber-600 dark:text-amber-400 font-serif
            ${isCompact ? 'text-lg' : 'text-xl'}
          `}>
            "
          </span>
          
          {/* Citation Text */}
          <p className={`
            font-medium text-slate-700 dark:text-slate-300 leading-tight
            line-clamp-2 px-1
            ${isCompact ? 'text-xs' : 'text-sm'}
          `}>
            {article.citation || article.headline.substring(0, 50) + '...'}
          </p>
          
          {/* Closing Quote */}
          <span className={`
            text-amber-600 dark:text-amber-400 font-serif
            ${isCompact ? 'text-lg' : 'text-xl'}
          `}>
            "
          </span>
        </div>
      </motion.div>

      {/* Hover glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="
          absolute inset-0 bg-gradient-to-r 
          from-amber-200/20 via-orange-200/20 to-amber-200/20
          dark:from-amber-600/10 dark:via-orange-600/10 dark:to-amber-600/10
        "
      />
    </div>
  );
});