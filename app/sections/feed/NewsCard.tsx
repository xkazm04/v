'use client';
import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsArticle } from '@/app/types/article';
import { NewsCardHeader } from '@/app/components/news/NewsCardHeader';
import { NewsCardContent } from '@/app/components/news/NewsCardContent';
import { NewsCardThumbnail } from '@/app/components/news/NewsCardThumbnail';

interface NewsCardProps {
  article: NewsArticle;
  layout?: 'grid' | 'compact';
  onRead?: (articleId: string) => void;
  className?: string;
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    x: 100,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

const NewsCard = memo(function NewsCard({ 
  article, 
  layout = 'grid',
  onRead,
  className = ''
}: NewsCardProps) {
  const [isRead, setIsRead] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    setIsRead(true);
    // Delay the callback to allow exit animation
    setTimeout(() => {
      onRead?.(article.id);
    }, 300);
  }, [article.id, onRead]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <AnimatePresence mode="wait">
      {!isRead && (
        <motion.article
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`
            group cursor-pointer select-none outline-none
            ${layout === 'compact' ? 'max-w-xs' : 'max-w-sm'}
            ${className}
          `}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          whileHover={{ 
            y: -3,
            transition: { duration: 0.2, ease: 'easeOut' }
          }}
          whileTap={{ 
            scale: 0.98,
            transition: { duration: 0.1 }
          }}
        >
          {/* Card Container with Newspaper-like Design */}
          <div className={`
            relative h-full overflow-hidden
            bg-gradient-to-br from-amber-50/95 to-orange-50/90 
            dark:from-slate-900/95 dark:to-slate-800/90
            backdrop-blur-sm border border-amber-200/40 dark:border-slate-700/60
            rounded-xl shadow-sm
            transition-all duration-300 ease-out
            hover:shadow-lg hover:shadow-amber-900/10 dark:hover:shadow-black/30
            hover:border-amber-300/60 dark:hover:border-slate-600/80
            before:absolute before:inset-0 before:rounded-lg
            before:bg-gradient-to-br before:from-white/30 before:to-transparent
            before:opacity-0 before:transition-opacity before:duration-300
            hover:before:opacity-100
            ${layout === 'compact' ? 'h-[100px]' : 'h-[140px]'}
          `}>
            {/* Header (fact check indicator, breaking badge) */}
            <NewsCardHeader 
              article={article}
              layout={layout}
              isHovered={isHovered}
            />

            {/* Main Content Area */}
            <div className="relative z-10 p-4 h-full flex flex-col">
              {/* Thumbnail/Logo Section */}
              <NewsCardThumbnail
                article={article}
                layout={layout}
                isHovered={isHovered}
              />

              {/* Content */}
              <NewsCardContent
                article={article}
                layout={layout}
                className="flex-1 mt-3"
              />
            </div>

            {/* Newspaper texture overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0,0,0,0.1) 2px,
                    rgba(0,0,0,0.1) 3px
                  ),
                  repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 2px,
                    rgba(0,0,0,0.05) 2px,
                    rgba(0,0,0,0.05) 3px
                  )
                `
              }}
            />

            {/* Read indicator overlay */}
            <div className="
              absolute top-2 right-2 z-20
              opacity-0 group-hover:opacity-100 transition-opacity duration-300
            ">
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                className="
                  w-6 h-6 rounded-full bg-green-500 dark:bg-green-400
                  flex items-center justify-center shadow-lg
                "
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.article>
      )}
    </AnimatePresence>
  );
});

export { NewsCard };