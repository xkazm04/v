'use client';
import { memo, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsCard } from './NewsCard';
import { NewsArticle } from '@/app/types/article';

interface NewsGridProps {
  articles: NewsArticle[];
  layout?: 'grid' | 'compact';
  columns?: 2 | 3 | 4 | 5;
  onArticleRead?: (articleId: string) => void;
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

const NewsGrid = memo(function NewsGrid({ 
  articles, 
  layout = 'grid',
  columns = 4,
  onArticleRead,
  className = ''
}: NewsGridProps) {
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set());

  const handleArticleRead = useCallback((articleId: string) => {
    setReadArticles(prev => new Set(prev).add(articleId));
    onArticleRead?.(articleId);
  }, [onArticleRead]);

  const visibleArticles = useMemo(() => 
    articles.filter(article => !readArticles.has(article.id)),
    [articles, readArticles]
  );

  const getGridCols = () => {
    const colsMap = {
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-7',
      5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9'
    };
    return colsMap[columns] || colsMap[4];
  };

  const gapClass = layout === 'compact' ? 'gap-3' : 'gap-4 md:gap-6';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid ${getGridCols()} ${gapClass} ${className}`}
    >
      <AnimatePresence mode="popLayout">
        {visibleArticles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            layout={layout}
            onRead={handleArticleRead}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
});

export { NewsGrid };