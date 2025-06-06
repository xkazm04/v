'use client';

import { memo, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsArticle } from '@/app/types/article';
import { NewsCardHeader } from '@/app/components/news/NewsCardHeader';
import { FactCheckModal } from '@/app/components/modals/FactCheckModal';
import NewsCardContent from '@/app/components/news/NewsCardContent';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';

interface NewsCardProps {
  article: NewsArticle;
  layout?: 'grid' | 'compact';
  onRead?: (articleId: string) => void;
  className?: string;
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.9,
    rotateX: -10
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    rotateY: 2,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

const dismissVariants = {
  exit: {
    opacity: 0,
    scale: 0.8,
    x: 300,
    rotateY: 45,
    rotateX: 15,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const shimmerVariants = {
  shimmer: {
    x: ['100%', '-100%'],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 3
    }
  }
};

const NewsCard = memo(function NewsCard({ 
  article, 
  layout = 'grid',
  onRead,
  className = ''
}: NewsCardProps) {
  const { colors, mounted, isDark } = useLayoutTheme();
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

  // Dynamic styling based on article properties
  const cardStyles = useMemo(() => {
    const baseHeight = isCompact ? 'h-32' : 'h-48';
    const isBreaking = article.isBreaking;
    const hasFactCheck = !!article.factCheck;
    
    return {
      height: baseHeight,
      background: mounted 
        ? colors.card.background
        : isDark ? '#1e293b' : '#ffffff',
      borderColor: mounted
        ? isBreaking 
          ? isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(220, 38, 38, 0.3)'
          : hasFactCheck
            ? isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)'
            : colors.border
        : isDark ? '#334155' : '#e2e8f0',
      boxShadow: mounted
        ? isHovered 
          ? `0 20px 40px -12px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)'}, 0 0 0 1px ${colors.border}`
          : `0 4px 12px -2px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}, 0 0 0 1px ${colors.border}`
        : isDark 
          ? '0 4px 12px -2px rgba(0, 0, 0, 0.3)' 
          : '0 4px 12px -2px rgba(0, 0, 0, 0.1)'
    };
  }, [isCompact, article, colors, mounted, isDark, isHovered]);

  if (!mounted) {
    return (
      <div 
        className={cn(
          'group relative cursor-pointer flex flex-col justify-between',
          cardStyles.height,
          'rounded-xl border-2 transition-all duration-300 overflow-hidden',
          className
        )}
        style={{
          backgroundColor: cardStyles.background,
          borderColor: cardStyles.borderColor,
          boxShadow: cardStyles.boxShadow
        }}
      />
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!isRead && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit={dismissVariants.exit}
            whileHover="hover"
            whileTap="tap"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleLeftClick}
            onContextMenu={handleRightClick}
            className={cn(
              'group relative cursor-pointer flex flex-col justify-between',
              cardStyles.height,
              'rounded-xl border-2 transition-all duration-300 overflow-hidden transform-gpu',
              className
            )}
            style={{
              transformStyle: 'preserve-3d',
              backgroundColor: cardStyles.background,
              borderColor: cardStyles.borderColor,
              boxShadow: cardStyles.boxShadow
            }}
          >
            {/* Enhanced Background Pattern */}
            <motion.div 
              className="absolute inset-0 opacity-[0.02]"
              initial={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div 
                className="absolute inset-0"
                style={{
                  background: isDark 
                    ? `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`
                    : `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                       radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)`
                }}
              />
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: isDark
                    ? `radial-gradient(circle at 2px 2px, rgba(148, 163, 184, 0.3) 1px, transparent 0)`
                    : `radial-gradient(circle at 2px 2px, rgba(71, 85, 105, 0.2) 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }}
              />
            </motion.div>

            {/* Header with enhanced status badges */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative z-20"
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
              className="relative z-10 flex-1"
            >
              <NewsCardContent
                article={article}
                isCompact={isCompact}
                isHovered={isHovered}
              />
            </motion.div>

            {/* Enhanced Hover Effect Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pointer-events-none z-5"
              style={{
                background: isDark
                  ? `linear-gradient(135deg, 
                      rgba(59, 130, 246, 0.03) 0%, 
                      rgba(147, 51, 234, 0.02) 50%, 
                      rgba(168, 85, 247, 0.03) 100%
                    )`
                  : `linear-gradient(135deg, 
                      rgba(59, 130, 246, 0.02) 0%, 
                      rgba(147, 51, 234, 0.01) 50%, 
                      rgba(168, 85, 247, 0.02) 100%
                    )`
              }}
            />

            {/* Enhanced Interaction Hints */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ 
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  transition={{ 
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  className="absolute bottom-2 right-2 z-30"
                >
                  <div 
                    className="text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-md border"
                    style={{
                      backgroundColor: isDark 
                        ? 'rgba(15, 23, 42, 0.8)' 
                        : 'rgba(255, 255, 255, 0.9)',
                      color: colors.foreground,
                      borderColor: colors.border,
                      boxShadow: `0 4px 12px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span>👆 dismiss</span>
                      <span 
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: colors.border }}
                      />
                      <span>🖱️ details</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced shimmer effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-[1] overflow-hidden"
              variants={shimmerVariants}
              animate={isHovered ? "shimmer" : ""}
            >
              <div 
                className="absolute inset-0 w-full h-full transform -skew-x-12"
                style={{
                  background: `linear-gradient(90deg, 
                    transparent 0%, 
                    ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)'} 50%, 
                    transparent 100%
                  )`,
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                }}
              />
            </motion.div>

            {/* Subtle border glow for important articles */}
            {(article.isBreaking || article.factCheck) && (
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: `linear-gradient(45deg, 
                    ${article.isBreaking 
                      ? isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)'
                      : isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)'
                    } 0%, 
                    transparent 50%, 
                    ${article.isBreaking 
                      ? isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)'
                      : isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)'
                    } 100%
                  )`,
                  zIndex: 1
                }}
                animate={{
                  opacity: isHovered ? 0.8 : 0.3,
                  scale: isHovered ? 1.02 : 1
                }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Fact Check Modal */}
      <FactCheckModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        article={article}
      />
    </>
  );
});

export { NewsCard };