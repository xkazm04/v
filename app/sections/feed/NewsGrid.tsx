import { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResearchResult } from '@/app/types/article';
import { NewsCard } from './NewsCard';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { containerVariants, itemVariants } from '@/app/components/animations/variants/votingVariants';
import LoaderComponent from '@/app/components/animations/LoaderComponent';

interface NewsGridProps {
  articles: ResearchResult[];
  onArticleRead?: (articleId: string) => void;
  layout?: 'grid' | 'compact';
  className?: string;
  loading?: boolean; 
}

const NewsGrid = memo(function NewsGrid({
  articles,
  onArticleRead,
  layout = 'grid',
  className = '',
  loading = false 
}: NewsGridProps) {
  const { colors } = useLayoutTheme();

  const handleArticleRead = useCallback((articleId: string) => {
    onArticleRead?.(articleId);
  }, [onArticleRead]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <LoaderComponent 
          loading={true} 
          text="Loading news articles..."
          variant="default"
        />
      </div>
    );
  }

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
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4">
            <div 
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.muted}30` }}
            >
              <span className="text-2xl">📰</span>
            </div>
          </div>
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: colors.foreground }}
          >
            No articles found
          </h3>
          <p 
            className="text-sm"
            style={{ color: colors.mutedForeground }}
          >
            Try adjusting your filters or search terms
          </p>
        </motion.div>
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
      className={`grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3
       ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {validArticles.map((research, index) => (
          <motion.div
            key={`${research.id}-${index}`}
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