import { memo, useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResearchResult } from '@/app/types/article';
import { NewsCardHeader } from '@/app/components/news/NewsCardHeader';
import { FactCheckModal } from '@/app/components/modals/FactCheck/FactCheckModal';
import NewsCardContent from '@/app/components/news/NewsCardContent';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import NewsCardWrapper from './NewsCardWrapper';

interface NewsCardProps {
  research: ResearchResult;
  layout?: 'grid' | 'compact';
  onRead?: (researchId: string) => void;
  className?: string;
}

const NewsCard = memo(function NewsCard({ 
  research, 
  layout = 'grid',
  onRead,
  className = ''
}: NewsCardProps) {
  const { colors, mounted, isDark } = useLayoutTheme();
  const { isMobile, isDesktop } = useViewport();
  
  if (!research || !research.id) {
    console.warn('NewsCard: research data is missing or invalid', research);
    return null;
  }

  const [isRead, setIsRead] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dismissType, setDismissType] = useState<'fade' | 'swipe-right' | null>(null);
  
  const lastTapRef = useRef<number>(0);
  const tapCountRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);

  const handleMouseClick = useCallback((e: React.MouseEvent) => {
    // Only handle mouse clicks on desktop, and only if not dragging
    if (isDesktop && !isDragging && !hasDraggedRef.current) {
      // No action on card click - individual elements handle their own clicks
      e.preventDefault();
    }
  }, [isDesktop, isDragging]);

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Right click functionality removed
  }, []);

  const handleQuoteClick = useCallback(() => {
    if (!isMobile) {
      setShowModal(true);
    }
  }, [isMobile]);

  const handleTouchTap = useCallback(() => {
    if (!isMobile) return;
    
    if (isDragging || hasDraggedRef.current) return;
    
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;
    
    if (timeDiff < 300) {
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

    setTimeout(() => {
      if (tapCountRef.current === 1 && (Date.now() - lastTapRef.current) >= 300) {
        tapCountRef.current = 0;
      }
    }, 350);
  }, [isDragging, isMobile]);

  const handleSwipeRight = useCallback(() => {
    setDismissType('swipe-right');
    setIsRead(true);
    setTimeout(() => {
      onRead?.(research.id);
    }, 500);
  }, [research.id, onRead]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 100);
  }, []);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    hasDraggedRef.current = true;
  }, []);

  const isCompact = layout === 'compact';

  // ✅ **UPDATED: Subtle card styling - no hover movement effects**
  const cardStyles = useMemo(() => {
    const baseHeight = isCompact ? 'h-32' : 'h-48';
    
    return {
      height: baseHeight,
      background: mounted 
        ? colors.card.background
        : isDark ? '#1e293b' : '#ffffff',
      borderColor: mounted ? colors.border : (isDark ? '#374151' : '#e5e7eb'),
      boxShadow: mounted
        ? `0 4px 12px -2px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}, 0 0 0 1px ${colors.border}`
        : isDark 
          ? '0 4px 12px -2px rgba(0, 0, 0, 0.3)' 
          : '0 4px 12px -2px rgba(0, 0, 0, 0.1)'
    };
  }, [isCompact, colors, mounted, isDark]);

  return (
    <>
      <AnimatePresence mode="wait">
        {!isRead && (
          <NewsCardWrapper
            research={research}
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
            {/* Header with clickable source */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative z-20"
            >
              <NewsCardHeader 
                research={research} 
                layout={layout} 
                isHovered={isHovered} 
              />
            </motion.div>

            {/* Main Content Area with clickable quote */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="relative z-10 flex-1"
            >
              <NewsCardContent
                research={research}
                isCompact={isCompact}
                onQuoteClick={handleQuoteClick}
              />
            </motion.div>

            {/* ✅ **REMOVED: Hover effect overlay for whole card** */}

            {/* Status-based subtle border glow - static, not animated */}
            {(research.status === 'FALSE' || research.status === 'MISLEADING') && (
              <div
                className="absolute inset-0 rounded-xl pointer-events-none opacity-30"
                style={{
                  background: `linear-gradient(45deg, 
                    ${research.status === 'FALSE' 
                      ? isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)'
                      : isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(217, 119, 6, 0.1)'
                    } 0%, 
                    transparent 50%, 
                    ${research.status === 'FALSE' 
                      ? isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)'
                      : isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(217, 119, 6, 0.1)'
                    } 100%
                  )`,
                  zIndex: 1
                }}
              />
            )}
          </NewsCardWrapper>
        )}
      </AnimatePresence>

      {/* Enhanced Fact Check Modal */}
      <FactCheckModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        research={research}
      />
    </>
  );
});

export { NewsCard };