
import { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResearchResult } from '@/app/types/article';
import { NewsCard } from './NewsCard';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface NewsGridProps {
  articles: ResearchResult[]; // Fix: Use ResearchResult
  onArticleRead?: (articleId: string) => void;
  layout?: 'grid' | 'compact';
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

const NewsGrid = memo(function NewsGrid({
  articles,
  onArticleRead,
  layout = 'grid',
  className = ''
}: NewsGridProps) {
  const { colors } = useLayoutTheme();

  const handleArticleRead = useCallback((articleId: string) => {
    onArticleRead?.(articleId);
  }, [onArticleRead]);

  // ✅ **FIX: Add proper data validation**
  if (!Array.isArray(articles)) {
    console.warn('NewsGrid: articles is not an array', articles);
    return (
      <div className="text-center py-8">
        <p style={{ color: colors.mutedForeground }}>
          Invalid data format received
        </p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p style={{ color: colors.mutedForeground }}>
          No research results found
        </p>
      </div>
    );
  }

  // ✅ **FIX: Filter out invalid research data**
  const validArticles = articles.filter(article => 
    article && 
    typeof article === 'object' && 
    article.id && 
    article.statement
  );

  if (validArticles.length === 0) {
    console.warn('NewsGrid: No valid articles found', articles);
    return (
      <div className="text-center py-8">
        <p style={{ color: colors.mutedForeground }}>
          No valid research results available
        </p>
      </div>
    );
  }

  if (validArticles.length < articles.length) {
    console.warn(`NewsGrid: Filtered out ${articles.length - validArticles.length} invalid articles`);
  }

  return (
    <motion.div
      className={`grid gap-4 sm:gap-6 ${
        layout === 'compact' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
      } ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {validArticles.map((research, index) => (
          <motion.div
            key={`${research.id}-${index}`} // Use index as fallback for uniqueness
            variants={itemVariants}
            layout
            className="flex"
          >
            <NewsCard
              research={research}
              layout={layout}
              onRead={handleArticleRead}
              className="w-full"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
});

export { NewsGrid };