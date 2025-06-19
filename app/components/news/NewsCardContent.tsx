import { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResearchResult } from '@/app/types/article';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { cn } from '@/app/lib/utils';
import { Divider } from '../ui/divider';
import { MousePointer2, Expand, Info } from 'lucide-react';

interface NewsCardContentProps {
  isCompact?: boolean;
  research: ResearchResult;
  onQuoteClick?: () => void;
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

const NewsCardContent = memo(function NewsCardContent({
  isCompact = false,
  research,
  onQuoteClick
}: NewsCardContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isQuoteHovered, setIsQuoteHovered] = useState(false);
  const { colors, isDark } = useLayoutTheme();
  const { isMobile } = useViewport();
  
  const maxLength = isCompact ? 120 : 200;
  const shouldTruncate = useMemo(() => {
    return (research.statement?.length || 0) > maxLength;
  }, [research.statement, maxLength]);

  const displayText = useMemo(() => {
    if (!research.statement) return 'No statement available';
    
    if (isExpanded || !shouldTruncate) {
      return research.statement;
    }
    
    return `${research.statement.slice(0, maxLength)}...`;
  }, [research.statement, isExpanded, shouldTruncate, maxLength]);

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (shouldTruncate && !isExpanded) {
      setIsExpanded(true);
    } else {
      if (!isMobile) {
        onQuoteClick?.();
      }
    }
  };

  return (
    <motion.div
      className="relative z-10 flex flex-col h-full justify-between p-4"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Quote/Statement with enhanced hover effects */}
      <motion.div
        className="flex flex-col items-start justify-between flex-1"
        variants={itemVariants}
      >
        <div className="w-full relative">
          <blockquote
            className={cn(
              "font-medium leading-relaxed transition-all duration-300 line-clamp-5",
              isCompact ? 'text-sm' : 'md:text-sm lg:text-base 2xl:text-lg',
              "cursor-pointer relative group rounded-lg p-3 -m-3", // Add padding and negative margin for better click area
              "border border-transparent" // Invisible border for consistent sizing
            )}
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              color: colors.foreground,
              zIndex: 15 // Ensure quote is clickable
            }}
            onClick={handleQuoteClick}
            onMouseEnter={() => setIsQuoteHovered(true)}
            onMouseLeave={() => setIsQuoteHovered(false)}
          >
            <motion.span 
              className="relative block"
              animate={{
                // ✅ **ENHANCED: Better glow and color transition**
                textShadow: isQuoteHovered && !isMobile
                  ? `0 0 12px ${colors.primary}60, 0 0 24px ${colors.primary}30, 0 0 36px ${colors.primary}15`
                  : 'none',
                color: isQuoteHovered && !isMobile
                  ? colors.primary
                  : colors.foreground
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              "{displayText}"
            </motion.span>

            {/* ✅ **ENHANCED: Animated background with border** */}
            {!isMobile && (
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, 
                    ${colors.primary}12 0%, 
                    ${colors.primary}06 50%, 
                    ${colors.primary}12 100%
                  )`,
                  border: `1px solid ${colors.primary}40`
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: isQuoteHovered ? 1 : 0,
                  scale: isQuoteHovered ? 1 : 0.95
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            )}

            {/* ✅ **NEW: Corner indicator for clickable content** */}
            {!isMobile && (
              <motion.div
                className="absolute top-1 right-1 pointer-events-none"
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{
                  opacity: isQuoteHovered ? 1 : 0.3,
                  scale: isQuoteHovered ? 1 : 0.8,
                  rotate: isQuoteHovered ? 0 : -10
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {shouldTruncate && !isExpanded ? (
                  <Expand className="w-3 h-3" style={{ color: colors.primary }} />
                ) : (
                  <Info className="w-3 h-3" style={{ color: colors.primary }} />
                )}
              </motion.div>
            )}

            {/* ✅ **ENHANCED: Better interaction hint with icon** */}
            <AnimatePresence>
              {!isMobile && isQuoteHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute -bottom-8 left-0 flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg shadow-lg"
                  style={{
                    background: isDark 
                      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                    color: colors.foreground,
                    border: `1px solid ${colors.border}`,
                    backdropFilter: 'blur(8px)'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <MousePointer2 className="w-3 h-3" style={{ color: colors.primary }} />
                  <span>
                    {shouldTruncate && !isExpanded ? 'Click to expand' : 'Click for fact-check details'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ✅ **NEW: Subtle pulse animation for important content** */}
            {(research.status === 'FALSE' || research.status === 'MISLEADING') && !isMobile && (
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, 
                    ${research.status === 'FALSE' 
                      ? 'rgba(239, 68, 68, 0.1)' 
                      : 'rgba(245, 158, 11, 0.1)'
                    } 0%, 
                    transparent 70%
                  )`
                }}
                animate={{
                  opacity: isQuoteHovered ? [0.3, 0.6, 0.3] : 0.2,
                  scale: isQuoteHovered ? [1, 1.02, 1] : 1
                }}
                transition={{
                  duration: isQuoteHovered ? 2 : 0.3,
                  repeat: isQuoteHovered ? Infinity : 0,
                  ease: "easeInOut"
                }}
              />
            )}
          </blockquote>
        </div>
      </motion.div>

      <Divider variant='glow' />

      {/* Bottom Section - Verdict with subtle hover effect */}
      {research.verdict && (
        <motion.div
          className="text-xs font-thin line-clamp-2 mt-2 transition-colors duration-300"
          variants={itemVariants}
          style={{ 
            color: isQuoteHovered && !isMobile 
              ? colors.mutedForeground 
              : `${colors.mutedForeground}cc`
          }}
        >
          {research.verdict}
        </motion.div>
      )}
    </motion.div>
  );
});

export default NewsCardContent;