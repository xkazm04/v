import { useCallback, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { cn } from '@/app/lib/utils';
import { ResearchResult } from '@/app/types/article';
import { useViewport } from '@/app/hooks/useViewport';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import NewsCardMobileRead from '@/app/components/news/NewsCardMobileRead';

interface NewsCardWrapperProps {
  children: ReactNode;
  research: ResearchResult;
  cardStyles: {
    height: string;
    background: string | undefined;
    borderColor: string;
    boxShadow: string;
  };
  isRead: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  dismissType: 'fade' | 'swipe-right' | null;
  setDismissType: (type: 'fade' | 'swipe-right' | null) => void;
  setIsRead: (read: boolean) => void;
  onRead?: (researchId: string) => void;
  handleMouseClick: (e: React.MouseEvent) => void;
  handleRightClick: (e: React.MouseEvent) => void;
  handleTouchTap: () => void;
  handleSwipeRight: () => void;
  className?: string;
  isDark: boolean;
}

// ✅ **ENHANCED: Card animations with subtle hover glow**
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

const fadeOutVariants = {
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(2px)',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const swipeRightVariants = {
  exit: {
    opacity: 0,
    x: 400,
    scale: 0.8,
    rotateZ: 15,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const NewsCardWrapper = ({ 
  children, 
  research,
  cardStyles, 
  isRead, 
  isDragging, 
  setIsDragging,
  onDragStart,
  onDragEnd,
  isHovered,
  setIsHovered,
  dismissType,
  setDismissType,
  setIsRead,
  onRead,
  handleMouseClick,
  handleRightClick,
  handleTouchTap,
  handleSwipeRight,
  className = '',
  isDark
}: NewsCardWrapperProps) => {
  
  const { isMobile, isTablet, isDesktop } = useViewport();
  const { colors } = useLayoutTheme();
  const dragStartTimeRef = useRef<number>(0);
  const dragThresholdRef = useRef<boolean>(false);
  
  // Motion values for swipe animation (mobile only)
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);
  const rotateZ = useTransform(x, [-200, 0, 200], [-5, 0, 15]);

  // Background color for swipe feedback
  const backgroundColor = useTransform(
    x,
    [-200, -50, 0, 50, 200],
    [
      isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(220, 38, 38, 0.2)',
      isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)',
      cardStyles.background,
      isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(22, 163, 74, 0.1)',
      isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(22, 163, 74, 0.2)'
    ]
  );

  const handleMobileRead = useCallback(() => {
    setDismissType('fade');
    setIsRead(true);
    setTimeout(() => {
      onRead?.(research.id);
    }, 300);
  }, [research.id, onRead, setDismissType, setIsRead]);

  const handleMouseEnter = useCallback(() => {
    if (isDesktop) {
      setIsHovered(true);
    }
  }, [setIsHovered, isDesktop]);

  const handleMouseLeave = useCallback(() => {
    if (isDesktop) {
      setIsHovered(false);
    }
  }, [setIsHovered, isDesktop]);

  const handlePanStart = useCallback(() => {
    if (isMobile || isTablet) {
      onDragStart();
      dragStartTimeRef.current = Date.now();
      dragThresholdRef.current = false;
    }
  }, [onDragStart, isMobile, isTablet]);

  const handlePan = useCallback((event: any, info: PanInfo) => {
    if (isMobile || isTablet) {
      // Track if we've moved beyond a small threshold (to distinguish from taps)
      if (Math.abs(info.offset.x) > 10) {
        dragThresholdRef.current = true;
      }
    }
  }, [isMobile, isTablet]);

  const handlePanEnd = useCallback((event: any, info: PanInfo) => {
    if (isMobile || isTablet) {
      const velocity = Math.abs(info.velocity.x);
      const offset = Math.abs(info.offset.x);
      const isSwipe = velocity > 500 || offset > 100;

      if (isSwipe && info.offset.x > 50) {
        handleSwipeRight();
      } else {
        x.set(0);
      }

      onDragEnd();
    }
  }, [handleSwipeRight, x, onDragEnd, isMobile, isTablet]);

  const getExitVariant = () => {
    switch (dismissType) {
      case 'fade':
        return fadeOutVariants.exit;
      case 'swipe-right':
        return swipeRightVariants.exit;
      default:
        return fadeOutVariants.exit;
    }
  };

  if (isRead) {
    return null;
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit={getExitVariant()}
      whileTap={!isDragging ? "tap" : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={isDesktop ? handleMouseClick : undefined}
      onContextMenu={isDesktop ? handleRightClick : undefined}
      onTap={isMobile || isTablet ? handleTouchTap : undefined}
      onPanStart={handlePanStart}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      drag={isMobile || isTablet ? "x" : false}
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.2}
      style={{
        x: isMobile || isTablet ? x : 0,
        opacity: isDragging ? opacity : 1,
        scale: isDragging ? scale : 1,
        rotateZ: isDragging ? rotateZ : 0,
        backgroundColor: isDragging ? backgroundColor : cardStyles.background,
        border: `1px solid ${cardStyles.borderColor}`
      }}

      transition={{
        boxShadow: { duration: 0.3, ease: "easeOut" },
        borderColor: { duration: 0.3, ease: "easeOut" }
      }}
      className={cn(
        'group relative flex flex-col justify-between',
        cardStyles.height,
        'rounded-xl transition-all duration-300 overflow-hidden transform-gpu',
        'touch-manipulation select-none',
        className
      )}
    >
      {children}


      {/* Mobile read button */}
      {isMobile && (
        <NewsCardMobileRead
          onMarkRead={handleMobileRead}
          className="opacity-80 hover:opacity-100"
        />
      )}

      {/* Mobile swipe indicators */}
      <AnimatePresence>
        {isDragging && (isMobile || isTablet) && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: x.get() > 50 ? 1 : 0.3,
                scale: x.get() > 50 ? 1 : 0.8
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 pointer-events-none"
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/90 text-white text-sm font-medium shadow-lg">
                <span>✓</span>
                <span>Read</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: x.get() < -50 ? 1 : 0.3,
                scale: x.get() < -50 ? 1 : 0.8
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 pointer-events-none"
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-red-500/90 text-white text-sm font-medium shadow-lg">
                <span>✕</span>
                <span>Keep</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile drag feedback overlay */}
      <AnimatePresence>
        {isDragging && (isMobile || isTablet) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: Math.abs(x.get()) > 20 ? 0.8 : 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-xl pointer-events-none z-25"
            style={{
              background: `linear-gradient(90deg, 
                ${x.get() > 0 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : 'rgba(239, 68, 68, 0.1)'
                } 0%, 
                transparent 50%, 
                transparent 100%
              )`
            }}
          />
        )}
      </AnimatePresence>

      {/* Mobile interaction hint */}
      {(isMobile || isTablet) && isHovered && !isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-2 left-2 z-30 pointer-events-none"
        >
          <div className="flex gap-1 text-xs text-slate-400">
            <span>Swipe → or tap ✓</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NewsCardWrapper;