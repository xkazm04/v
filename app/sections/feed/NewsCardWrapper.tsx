'use client';

import { useCallback, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { cn } from '@/app/lib/utils';
import { NewsArticle } from '@/app/types/article';

interface NewsCardWrapperProps {
  children: ReactNode;
  article: NewsArticle;
  cardStyles: {
    height: string;
    background: string;
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
  onRead?: (articleId: string) => void;
  handleMouseClick: (e: React.MouseEvent) => void;
  handleRightClick: (e: React.MouseEvent) => void;
  handleTouchTap: () => void;
  handleSwipeRight: () => void;
  className?: string;
  isDark: boolean;
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

// SEPARATED: Mouse click fade animation - no movement
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

// SEPARATED: Swipe right animation - slides to the right
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
  article, 
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
  
  const dragStartTimeRef = useRef<number>(0);
  const dragThresholdRef = useRef<boolean>(false);
  
  // Motion values for swipe animation
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);
  const rotateZ = useTransform(x, [-200, 0, 200], [-5, 0, 15]);

  // Background color for swipe feedback
  const backgroundColor = useTransform(
    x,
    [-200, -50, 0, 50, 200],
    [
      isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(220, 38, 38, 0.2)', // Left swipe (cancel)
      isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)',
      cardStyles.background, // Center
      isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(22, 163, 74, 0.1)',
      isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(22, 163, 74, 0.2)' // Right swipe (dismiss)
    ]
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), [setIsHovered]);
  const handleMouseLeave = useCallback(() => setIsHovered(false), [setIsHovered]);

  const handlePanStart = useCallback(() => {
    onDragStart();
    dragStartTimeRef.current = Date.now();
    dragThresholdRef.current = false;
  }, [onDragStart]);

  const handlePan = useCallback((event: any, info: PanInfo) => {
    // Track if we've moved beyond a small threshold (to distinguish from taps)
    if (Math.abs(info.offset.x) > 10) {
      dragThresholdRef.current = true;
    }
  }, []);

  const handlePanEnd = useCallback((event: any, info: PanInfo) => {
    const dragDuration = Date.now() - dragStartTimeRef.current;
    const velocity = Math.abs(info.velocity.x);
    const offset = Math.abs(info.offset.x);

    // Determine if it's a swipe based on velocity and distance
    const isSwipe = velocity > 500 || offset > 100;
    const hasMoved = dragThresholdRef.current;

    if (isSwipe && info.offset.x > 50) {
      // Swipe right - dismiss article with slide animation
      handleSwipeRight();
    } else if (isSwipe && info.offset.x < -50) {
      // Swipe left - could be used for other actions (mark as favorite, etc.)
      // For now, just spring back
      x.set(0);
    } else {
      // Not a swipe, spring back to center
      x.set(0);
    }

    onDragEnd();
  }, [handleSwipeRight, x, onDragEnd]);

  // Determine exit animation based on dismiss type
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
      whileHover={!isDragging ? "hover" : undefined}
      whileTap={!isDragging ? "tap" : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleMouseClick}
      onContextMenu={handleRightClick}
      // Touch/Pan gesture handlers
      onTap={handleTouchTap}
      onPanStart={handlePanStart}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.2}
      style={{
        x,
        opacity: isDragging ? opacity : 1,
        scale: isDragging ? scale : 1,
        rotateZ: isDragging ? rotateZ : 0,
        backgroundColor: isDragging ? backgroundColor : cardStyles.background,
        boxShadow: cardStyles.boxShadow,
        border: `1px solid ${cardStyles.borderColor}`
      }}
      className={cn(
        'group relative cursor-pointer flex flex-col justify-between',
        cardStyles.height,
        'rounded-xl transition-all duration-300 overflow-hidden transform-gpu',
        'touch-manipulation select-none', 
        className
      )}
    >
      {children}

      {/* Swipe Indicators - Only show during drag */}
      <AnimatePresence>
        {isDragging && (
          <>
            {/* Right swipe indicator (dismiss) */}
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

            {/* Left swipe indicator (cancel) */}
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

      {/* Drag feedback overlay - Only visible during drag */}
      <AnimatePresence>
        {isDragging && (
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

      {/* Visual hint for interaction methods */}
      {isHovered && !isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-2 right-2 z-30 pointer-events-none"
        >
          <div className="flex gap-1 text-xs text-slate-400">
            <span className="hidden sm:inline">Click</span>
            <span className="sm:hidden">Swipe →</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NewsCardWrapper;