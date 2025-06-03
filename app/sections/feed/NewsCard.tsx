'use client';

import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsArticle } from '@/app/types/article';
import { NewsCardHeader } from '@/app/components/news/NewsCardHeader';
import { FactCheckModal } from '@/app/components/modals/FactCheckModal';
import NewsCardContent from '@/app/components/news/NewsCardContent';

interface NewsCardProps {
  article: NewsArticle;
  layout?: 'grid' | 'compact';
  onRead?: (articleId: string) => void;
  className?: string;
}

const dismissVariants = {
  exit: {
    opacity: 0,
    scale: 0.8,
    x: 200,
    rotateY: 45,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
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
  const [showModal, setShowModal] = useState(false);

  const handleLeftClick = useCallback(() => {
    setIsRead(true);
    setTimeout(() => {
      onRead?.(article.id);
    }, 500); 
  }, [article.id, onRead]);

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const isCompact = layout === 'compact';

  return (
    <>
      <AnimatePresence mode="wait">
        {!isRead && (
          <motion.div
            variants={dismissVariants}
            exit="exit"
            whileHover="hover"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleLeftClick}
            onContextMenu={handleRightClick}
            className={`
              group relative cursor-pointer flex flex-col justify-between h-full
              ${isCompact ? 'h-32' : 'h-48'}
              rounded-lg border border-slate-200 dark:border-slate-700
              bg-white dark:bg-slate-800
              shadow-sm hover:shadow-lg
              transition-all duration-300
              overflow-hidden
              transform-gpu
              ${className}
            `}
            style={{
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Background Pattern with subtle animation */}
            <motion.div 
              className="absolute inset-0 opacity-5"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950" />
            </motion.div>

            {/* Header with status badges */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <NewsCardHeader 
                article={article} 
                layout={layout} 
                isHovered={isHovered} 
              />
            </motion.div>

            {/* Main Content Area */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <NewsCardContent
                article={article}
                isCompact={isCompact}
              />
            </motion.div>

            {/* Hover Effect Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="
                absolute inset-0 pointer-events-none z-10
                bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-blue-50/50
                dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/20
              "
            />

            {/* Interaction Hints with improved animation */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 20,
                scale: isHovered ? 1 : 0.8
              }}
              transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className="
                absolute bottom-2 right-2 z-20
                text-xs text-slate-400 dark:text-slate-500
                pointer-events-none
                bg-black/10 dark:bg-white/10 backdrop-blur-sm
                px-2 py-1 rounded-full
              "
            >
              <div className="flex space-x-2">
                <span>👆 dismiss</span>
                <span>🖱️ details</span>
              </div>
            </motion.div>

            {/* Subtle shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-5"
              initial={{ x: '-100%', opacity: 0 }}
              whileHover={{ 
                x: '100%', 
                opacity: [0, 0.3, 0],
                transition: { 
                  duration: 1.5, 
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 2
                }
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                transform: 'skewX(-45deg)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fact Check Modal */}
      <FactCheckModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        article={article}
      />
    </>
  );
});

export { NewsCard };