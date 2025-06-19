import { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResearchResult } from '@/app/types/article';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { cn } from '@/app/lib/utils';
import { Divider } from '../ui/divider';
import { NewsCardFooter } from './NewsCardFooter';
import Image from 'next/image';
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

  const maxLength = isCompact ? 120 : 180;
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
      className="relative z-10 flex flex-col h-full justify-between p-4 min-h-[180px] cursor-pointer hover:text-bold"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      onClick={handleQuoteClick}
      onMouseEnter={() => setIsQuoteHovered(true)}
      onMouseLeave={() => setIsQuoteHovered(false)}
    >
      {/* ✅ Clean, readable quote section */}
      <motion.div
        className="flex flex-col items-start justify-between flex-1"
        variants={itemVariants}
      >
        <div 
          className="absolute w-full opacity-40 hover:opacity-100 h-full inset-0 transition-all duration-300 ease-linear" 
          style={{ zIndex: 1 }} 
        >
          <Image
            src={'/countries/country_usa.svg'} 
            alt={`Flag of ${research.country || 'Unknown'}`}
            fill
            className={cn(
              "object-cover pointer-events-none opacity-5",
            )}
            style={{
              filter: isDark ? 'brightness(0.7)' : 'brightness(1.1)'
            }}
          />
        </div>
        <div className="w-full relative">
          <blockquote
            className={cn(
              "font-medium leading-relaxed transition-all duration-300 line-clamp-5",
              isCompact ? 'text-sm' : 'md:text-lg',
              "relative group rounded-lg p-3 -m-3",
              "border border-transparent"
            )}
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              color: colors.foreground,
              zIndex: 15
            }}

          >
            <motion.span
              className="relative block"
              animate={{
                // ✅ Simple color transition - no text shadow effects
                color: isQuoteHovered && !isMobile
                  ? colors.primary
                  : colors.foreground
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              "{displayText}"
            </motion.span>

            {/* ✅ Clean hover background */}
            {!isMobile && (
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, 
                    ${colors.primary}08 0%, 
                    ${colors.primary}04 50%, 
                    ${colors.primary}08 100%
                  )`,
                  border: `1px solid ${colors.primary}20`
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: isQuoteHovered ? 1 : 0,
                  scale: isQuoteHovered ? 1 : 0.95
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            )}
          </blockquote>
        </div>
      </motion.div>

      <div className="my-3">
        <Divider variant='glow' />
      </div>
      {research.verdict && (
        <motion.div
          className="text-sm font-medium line-clamp-2 transition-colors duration-300"
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
      <NewsCardFooter
        research={research}
        layout={'grid'}
        isHovered={false}
      />
    </motion.div>
  );
});

export default NewsCardContent;