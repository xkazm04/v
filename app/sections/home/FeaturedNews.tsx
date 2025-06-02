'use client';
import { useNews } from '@/app/hooks/useNews';
import { NewsGrid } from '../feed/NewsGrid';
import { motion } from 'framer-motion';

interface FeaturedNewsProps {
  limit?: number;
  showBreaking?: boolean;
  autoRefresh?: boolean;
}

const FeaturedNews = ({ 
  limit = 20, 
  showBreaking = false,
  autoRefresh = true 
}: FeaturedNewsProps) => {
  const { 
    articles, 
    loading, 
    error, 
    refreshNews, 
    hasMore, 
    loadMore 
  } = useNews({
    limit,
    breaking: showBreaking,
    onlyFactChecked: true,
    autoRefresh,
  });

  if (loading && articles.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error loading news: {error}</div>
        <button
          onClick={refreshNews}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {showBreaking ? 'Breaking Fact Checks' : 'Recent Fact Checks'}
        </h2>
        <button
          onClick={refreshNews}
          disabled={loading}
          className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* News Grid */}
      <NewsGrid 
        articles={articles}
        onArticleRead={(articleId) => {
          console.log('Article read:', articleId);
          // Could implement read tracking here
        }}
      />

      {/* Load More */}
      {hasMore && (
        <div className="text-center py-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* No articles message */}
      {articles.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No fact-checks available at the moment.
        </div>
      )}
    </div>
  );
};

export default FeaturedNews;