import { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResearchResult } from '@/app/types/article';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { Divider } from '../ui/divider';

interface NewsCardContentProps {
  isCompact?: boolean;
  research: ResearchResult;
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
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
}: NewsCardContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { colors } = useLayoutTheme();
  
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

  return (
    <motion.div
      className="relative z-10 flex flex-col h-full justify-between p-4"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Quote/Statement with enhanced typography */}
      <motion.div
        className="flex flex-col items-start justify-between flex-1"
        variants={itemVariants}
      >
        <div className="w-full">
          <blockquote
            className={cn(
              "font-medium leading-relaxed transition-all duration-300 line-clamp-5",
              isCompact ? 'text-sm' : 'md:text-sm lg:text-base 2xl:text-lg',
              shouldTruncate ? 'cursor-pointer hover:text-opacity-80' : ''
            )}
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              color: colors.foreground
            }}
            onClick={() => shouldTruncate && setIsExpanded(!isExpanded)}
          >
            <motion.span className="relative">
              "{displayText}"
            </motion.span>
          </blockquote>
        </div>
      </motion.div>

      <Divider variant='glow' />

      {/* Bottom Section - Verdict */}
      {research.verdict && (
        <motion.div
          className="text-xs font-thin line-clamp-2 mt-2"
          variants={itemVariants}
          style={{ color: colors.mutedForeground }}
        >
          {research.verdict}
        </motion.div>
      )}
    </motion.div>
  );
});

export default NewsCardContent;