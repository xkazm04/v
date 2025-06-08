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
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  swipeDirection: 'left' | 'right' | null;
  setSwipeDirection: (direction: 'left' | 'right' | null) => void;
  setIsRead: (read: boolean) => void;
  onRead?: (articleId: string) => void;
  handleLeftClick: () => void;
  handleRightClick: (e: React.MouseEvent) => void;
  handleTap: () => void;
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
  isHovered,
  setIsHovered,
  swipeDirection, 
  setSwipeDirection,
  setIsRead,
  onRead,
  handleLeftClick,
  handleRightClick,
  handleTap,
  className = '',
  isDark
}: NewsCardWrapperProps) => {
  
  const dragStartTimeRef = useRef<number>(0);
  
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
    setIsDragging(true);
    dragStartTimeRef.current = Date.now();
  }, [setIsDragging]);

  const handlePanEnd = useCallback((event: any, info: PanInfo) => {
    const dragDuration = Date.now() - dragStartTimeRef.current;
    const velocity = Math.abs(info.velocity.x);
    const offset = Math.abs(info.offset.x);

    // Determine if it's a swipe based on velocity and distance
    const isSwipe = velocity > 500 || offset > 100;

    if (isSwipe && info.offset.x > 50) {
      // Swipe right - dismiss article
      setSwipeDirection('right');
      setIsRead(true);
      setTimeout(() => {
        onRead?.(article.id);
      }, 500);
    } else if (isSwipe && info.offset.x < -50) {
      // Swipe left - could be used for other actions (mark as favorite, etc.)
      // For now, just spring back
      x.set(0);
    } else {
      // Not a swipe, spring back to center
      x.set(0);
    }

    setIsDragging(false);
  }, [article.id, onRead, x, setSwipeDirection, setIsRead, setIsDragging]);

  if (isRead) {
    return null;
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit={swipeDirection === 'right' ? swipeRightVariants.exit : dismissVariants.exit}
      whileHover="hover"
      whileTap="tap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
      // Touch/Pan gesture handlers
      onTap={handleTap}
      onPanStart={handlePanStart}
      onPanEnd={handlePanEnd}
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.2}
      style={{
        x,
        opacity,
        scale,
        rotateZ,
        backgroundColor
      }}
      className={cn(
        'group relative cursor-pointer flex flex-col justify-between',
        cardStyles.height,
        'rounded-xl border-2 transition-all duration-300 overflow-hidden transform-gpu',
        'touch-manipulation select-none', // Optimize for touch
        className
      )}
    >
      {children}


      {/* Swipe Indicators */}
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
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/90 text-white text-sm font-medium">
                <span>✓</span>
                <span>Dismiss</span>
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
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-red-500/90 text-white text-sm font-medium">
                <span>✕</span>
                <span>Cancel</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Drag feedback overlay */}
      {isDragging && (
        <motion.div
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
          animate={{
            opacity: Math.abs(x.get()) > 20 ? 0.8 : 0.3
          }}
        />
      )}
    </motion.div>
  );
};

export default NewsCardWrapper;