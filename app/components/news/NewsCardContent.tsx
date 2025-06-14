'use client';

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { NewsArticle } from '@/app/types/article';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { Divider } from '../ui/divider';

interface NewsCardContentProps {
  isCompact?: boolean;
  article: NewsArticle;
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
  article,
}: NewsCardContentProps) {
  const { mounted } = useLayoutTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = isCompact ? 120 : 200;
  const shouldTruncate = article.headline.length > maxLength;
  const displayText = isExpanded || !shouldTruncate
    ? article.headline
    : `${article.headline.slice(0, maxLength)}...`;


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
        <div>
          <blockquote
            className={cn(
              "font-medium leading-relaxed transition-all duration-300 cursor-pointer line-clamp-5",
              isCompact ? 'text-sm' : 'md:text-sm lg:text-base 2xl:text-lg',
            )}
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif" // Newspaper-like font
            }}
            onClick={() => shouldTruncate && setIsExpanded(!isExpanded)}
          >
            <motion.span
              className="relative"
            >
              "{displayText}"
            </motion.span>
          </blockquote>

        </div>
      </motion.div>

      <Divider 
        variant='glow' />

      {/* Bottom Section */}
      {article.factCheck.verdict && <motion.div
        className="text-xs font-thin line-clamp-2"
        variants={itemVariants}
      >
        {article.factCheck.verdict}
      </motion.div>}
    </motion.div>
  );
});

export default NewsCardContent;