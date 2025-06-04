'use client';

import { useNews } from '@/app/hooks/useNews';
import { NewsGrid } from '../feed/NewsGrid';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface FeaturedNewsProps {
  limit?: number;
  showBreaking?: boolean;
  autoRefresh?: boolean;
  selectedCategory?: string;
}

const FeaturedNews = ({ 
  limit = 20, 
  showBreaking = false,
  autoRefresh = true,
  selectedCategory = 'all'
}: FeaturedNewsProps) => {
  const { 
    articles, 
    loading, 
    error, 
    refreshNews, 
    hasMore
  } = useNews({
    limit,
    breaking: showBreaking,
    onlyFactChecked: true,
    autoRefresh,
    categoryFilter: selectedCategory === 'all' ? undefined : selectedCategory,
  });
  console.log('FeaturedNews articles:', articles);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="animate-pulse"
        >
          <div className="bg-slate-200 dark:bg-slate-800 rounded-lg h-48 mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Error state
  const ErrorState = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        Failed to load news
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mb-4">
        {error || 'Something went wrong while fetching news.'}
      </p>
      <motion.button
        onClick={() => refreshNews()}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </motion.button>
    </motion.div>
  );

  // Empty state
  const EmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
        <div className="w-6 h-6 bg-slate-400 dark:bg-slate-600 rounded" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {selectedCategory === 'all' ? 'No fact-checks available' : `No ${selectedCategory} fact-checks available`}
      </h3>
      <p className="text-slate-600 dark:text-slate-400">
        {selectedCategory === 'all' 
          ? 'Check back later for the latest fact-checks.'
          : `Try selecting a different category or check back later for ${selectedCategory} fact-checks.`
        }
      </p>
    </motion.div>
  );

  if (loading && articles.length === 0) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState />;
  }

  if (articles.length === 0) {
    return <EmptyState />;
  }

  // Get category display name
  const getCategoryDisplayName = () => {
    if (selectedCategory === 'all') return 'Recent Fact Checks';
    const categoryLabels: Record<string, string> = {
      politics: 'Politics',
      economy: 'Economy', 
      environment: 'Environment',
      military: 'Military',
      healthcare: 'Healthcare',
      education: 'Education',
      technology: 'Technology',
      social: 'Social',
      international: 'International',
      other: 'Other'
    };
    return `${categoryLabels[selectedCategory] || selectedCategory} Fact Checks`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {showBreaking ? 'Breaking Fact Checks' : getCategoryDisplayName()}
          </h2>
          {selectedCategory !== 'all' && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Showing fact-checks from the {selectedCategory} category
            </p>
          )}
        </div>
      </div>

      {/* News Grid */}
      <NewsGrid 
        articles={articles}
        onArticleRead={(articleId) => {
          console.log('Article read:', articleId);
          // Could implement read tracking here
        }}
      />

      {/* Loading indicator for auto-refresh */}
      {loading && articles.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Updating...
          </div>
        </div>
      )}

      {/* No articles message during loading */}
      {articles.length === 0 && !loading && (
        <EmptyState />
      )}
    </div>
  );
};

export default FeaturedNews;