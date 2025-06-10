'use client';

import { memo, useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsArticle } from '@/app/types/article';
import { NewsCardHeader } from '@/app/components/news/NewsCardHeader';
import { FactCheckModal } from '@/app/components/modals/FactCheck/FactCheckModal';
import NewsCardContent from '@/app/components/news/NewsCardContent';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import NewsCardWrapper from './NewsCardWrapper';

interface NewsCardProps {
  article: NewsArticle;
  layout?: 'grid' | 'compact';
  onRead?: (articleId: string) => void;
  className?: string;
}

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
  const [isDragging, setIsDragging] = useState(false);
  const [dismissType, setDismissType] = useState<'fade' | 'swipe-right' | null>(null);
  
  // Touch gesture tracking
  const lastTapRef = useRef<number>(0);
  const tapCountRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);

  // SEPARATED: Mouse left click - fade out without movement
  const handleMouseClick = useCallback((e: React.MouseEvent) => {
    // Only handle if it's a genuine mouse click (not touch on mobile)
    if (e.pointerType === 'mouse' || (!('ontouchstart' in window) && e.type === 'click')) {
      if (isDragging || hasDraggedRef.current) return; // Don't handle if we just dragged
      
      setDismissType('fade');
      setIsRead(true);
      setTimeout(() => {
        onRead?.(article.id);
      }, 300); // Shorter delay for fade effect
    }
  }, [article.id, onRead, isDragging]);

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isDragging) return;
    setShowModal(true);
  }, [isDragging]);

  // SEPARATED: Touch interactions - handle double tap for modal
  const handleTouchTap = useCallback(() => {
    if (isDragging || hasDraggedRef.current) return;
    
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;
    
    if (timeDiff < 300) { // Double tap detected (within 300ms)
      tapCountRef.current++;
      if (tapCountRef.current === 2) {
        setShowModal(true);
        tapCountRef.current = 0;
        return;
      }
    } else {
      tapCountRef.current = 1;
    }
    
    lastTapRef.current = now;
    
    // Single tap after delay (if no second tap)
    setTimeout(() => {
      if (tapCountRef.current === 1 && (Date.now() - lastTapRef.current) >= 300) {
        tapCountRef.current = 0;
        // On mobile, single tap does nothing - only swipe dismisses
      }
    }, 350);
  }, [isDragging]);

  // Handle swipe right gesture - slide out to right
  const handleSwipeRight = useCallback(() => {
    setDismissType('swipe-right');
    setIsRead(true);
    setTimeout(() => {
      onRead?.(article.id);
    }, 500);
  }, [article.id, onRead]);

  // Reset drag state after drag ends
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    // Reset drag flag after a short delay to prevent click handling
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 100);
  }, []);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    hasDraggedRef.current = true;
  }, []);

  const isCompact = layout === 'compact';

  // Dynamic styling based on article properties
  const cardStyles = useMemo(() => {
    const baseHeight = isCompact ? 'h-32' : 'h-48';
    
    return {
      height: baseHeight,
      background: mounted 
        ? colors.card.background
        : isDark ? '#1e293b' : '#ffffff',
      borderColor: mounted ? colors.border : (isDark ? '#374151' : '#e5e7eb'),
      boxShadow: mounted
        ? isHovered 
          ? `0 20px 40px -12px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)'}, 0 0 0 1px ${colors.border}`
          : `0 4px 12px -2px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}, 0 0 0 1px ${colors.border}`
        : isDark 
          ? '0 4px 12px -2px rgba(0, 0, 0, 0.3)' 
          : '0 4px 12px -2px rgba(0, 0, 0, 0.1)'
    };
  }, [isCompact, colors, mounted, isDark, isHovered]);

  if (!mounted) {
    return (
      <div 
        className={cn(
          'group relative cursor-pointer flex flex-col justify-between',
          cardStyles.height,
          'rounded-xl border-1 transition-all duration-300 overflow-hidden',
          className
        )}
        style={{
          backgroundColor: cardStyles.background,
          boxShadow: cardStyles.boxShadow
        }}
      />
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!isRead && (
          <NewsCardWrapper
            article={article}
            cardStyles={cardStyles}
            isRead={isRead}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            dismissType={dismissType}
            setDismissType={setDismissType}
            setIsRead={setIsRead}
            onRead={onRead}
            handleMouseClick={handleMouseClick}
            handleRightClick={handleRightClick}
            handleTouchTap={handleTouchTap}
            handleSwipeRight={handleSwipeRight}
            className={className}
            isDark={isDark}
          >
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
          </NewsCardWrapper>
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