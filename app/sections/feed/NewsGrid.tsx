import { memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup, Variants } from 'framer-motion';
import { ResearchResult } from '@/app/types/article';
import { NewsCard } from './NewsCard';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import LoaderComponent from '@/app/components/animations/LoaderComponent';

interface NewsGridProps {
  articles: ResearchResult[];
  onArticleRead?: (articleId: string) => void;
  layout?: 'grid' | 'compact';
  className?: string;
  loading?: boolean; 
}

// ✅ OPTIMIZED: Enhanced animation variants for smooth transitions
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

const itemVariants: Variants = {
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
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// ✅ OPTIMIZED: Replacement animation variants
const replacementVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    rotateY: -90
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      delay: 0.2
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    rotateY: 90,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const NewsGrid = memo(function NewsGrid({
  articles,
  onArticleRead,
  layout = 'grid',
  className = '',
  loading = false 
}: NewsGridProps) {
  const { colors } = useLayoutTheme();

  // ✅ OPTIMIZED: Stable article list with proper keys
  const stableArticles = useMemo(() => {
    if (!Array.isArray(articles)) {
      console.warn('NewsGrid: articles is not an array', articles);
      return [];
    }

    return articles.filter(article => 
      article && 
      typeof article === 'object' && 
      article.id && 
      article.statement
    );
  }, [articles]);

  // ✅ OPTIMIZED: Memoized callback to prevent unnecessary re-renders
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

  if (stableArticles.length === 0) {
    return (
      <div className="text-center py-8">
        <p style={{ color: colors.mutedForeground }}>
          No articles available
        </p>
      </div>
    );
  }

  return (
    <LayoutGroup>
      <motion.div
        className={`grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {stableArticles.map((research) => (
            <motion.div
              key={research.id}
              layoutId={research.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex"
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
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
    </LayoutGroup>
  );
});

export { NewsGrid };