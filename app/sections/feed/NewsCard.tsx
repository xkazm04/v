import { memo, useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResearchResult } from '@/app/types/article';
import { FactCheckModal } from '@/app/components/modals/FactCheck/FactCheckModal';
import NewsCardContent from '@/app/components/news/NewsCardContent';
import { VintageVerdictStamp } from '@/app/components/news/VintageVerdictStamp';
import { VintageTopicBanner } from '@/app/components/news/VintageTopicBanner';
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
    if (isDesktop && !isDragging && !hasDraggedRef.current) {
      e.preventDefault();
    }
  }, [isDesktop, isDragging]);

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
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

  const cardStyles = useMemo(() => {
    const baseHeight = isCompact ? 'h-36' : 'h-[300px]';

    return {
      height: baseHeight,
      background: mounted ? colors.card.background : (isDark ? '#1e293b' : '#ffffff'),
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
            <VintageTopicBanner
              research={research}
              className="relative z-30"
            />

            <VintageVerdictStamp
              status={research.status}
              className="absolute -top-1 -right-2 z-50"
              size={'md'}
            />

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

              <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden opacity-8">
                <div className="absolute top-12 bottom-4 left-0 w-px bg-gradient-to-b from-transparent via-amber-800 to-transparent" />
                <div className="absolute top-12 bottom-4 right-0 w-px bg-gradient-to-b from-transparent via-amber-700 to-transparent" />
              </div>
          </NewsCardWrapper>
        )}
      </AnimatePresence>
      <FactCheckModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        research={research}
      />
    </>
  );
});

export { NewsCard };