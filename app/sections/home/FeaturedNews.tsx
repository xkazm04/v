'use client';

import { useState, useCallback, useMemo } from 'react';
import { useNews } from '@/app/hooks/useNews';
import { NewsGrid } from '../feed/NewsGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertCircle, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Button } from '@/app/components/ui/button';

interface FeaturedNewsProps {
  limit?: number;
  showBreaking?: boolean;
  autoRefresh?: boolean;
  showCategoryFilter?: boolean;
  allowMultipleCategories?: boolean;
}

const FeaturedNews = ({ 
  limit = 20, 
  showBreaking = false,
  autoRefresh = true,
  showCategoryFilter = true,
  allowMultipleCategories = false
}: FeaturedNewsProps) => {
  const { colors, isDark } = useLayoutTheme();
  
  // State management for categories and UI
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Prepare filter for useNews hook
  const newsFilters = useMemo(() => {
    const filters: any = {
      limit,
      breaking: showBreaking,
      onlyFactChecked: true,
      autoRefresh,
    };

    // Add category filter based on selection
    if (selectedCategories.length > 0) {
      // Use the first selected category for now
      filters.categoryFilter = selectedCategories[0];
    }

    return filters;
  }, [selectedCategories, limit, showBreaking, autoRefresh]);

  // Fetch news with dynamic filters
  const { 
    articles, 
    loading, 
    error, 
    refreshNews
  } = useNews(newsFilters);


  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    refreshNews();
    setRefreshKey(prev => prev + 1);
  }, [refreshNews]);

  // Get category display name
  const getCategoryDisplayName = useCallback(() => {
    if (selectedCategories.length === 0) return 'Media articles';
    if (selectedCategories.length === 1) {
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
      return `${categoryLabels[selectedCategories[0]] || selectedCategories[0]} Fact Checks`;
    }
    return `${selectedCategories.length} Categories Selected`;
  }, [selectedCategories]);

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
          <div 
            className="rounded-lg h-48 mb-4" 
            style={{ 
              background: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.5)' 
            }}
          />
          <div className="space-y-2">
            <div 
              className="h-4 rounded w-3/4" 
              style={{ 
                background: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.5)' 
              }}
            />
            <div 
              className="h-3 rounded w-1/2" 
              style={{ 
                background: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.5)' 
              }}
            />
            <div 
              className="h-3 rounded w-2/3" 
              style={{ 
                background: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.5)' 
              }}
            />
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
      <h3 
        className="text-lg font-semibold mb-2"
        style={{ color: colors.foreground }}
      >
        Failed to load news
      </h3>
      <p 
        className="mb-4"
        style={{ color: colors.mutedForeground }}
      >
        {error || 'Something went wrong while fetching news.'}
      </p>
      <motion.button
        onClick={handleRefresh}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
        style={{
          background: colors.primary,
          color: 'white'
        }}
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
      <div 
        className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center"
        style={{ background: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.5)' }}
      >
        <div 
          className="w-6 h-6 rounded" 
          style={{ background: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(148, 163, 184, 0.4)' }}
        />
      </div>
      <h3 
        className="text-lg font-semibold mb-2"
        style={{ color: colors.foreground }}
      >
        {selectedCategories.length === 0 
          ? 'No fact-checks available' 
          : `No ${getCategoryDisplayName().toLowerCase()} available`
        }
      </h3>
      <p style={{ color: colors.mutedForeground }}>
        {selectedCategories.length === 0 
          ? 'Check back later for the latest fact-checks.'
          : 'Try selecting different categories or check back later.'
        }
      </p>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Category Filter - Only show if successfully loaded */}
      {showCategoryFilter && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Filter Toggle for Mobile */}
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
              className="w-full justify-between"
              style={{
                background: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.6)',
                color: colors.foreground
              }}
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Categories</span>
                {selectedCategories.length > 0 && (
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: colors.primary + '20',
                      color: colors.primary
                    }}
                  >
                    {selectedCategories.length}
                  </span>
                )}
              </div>
              {isFilterCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Rest of the component remains the same... */}
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <motion.h2 
            className="text-2xl font-bold"
            style={{ color: colors.foreground }}
            key={selectedCategories.join('-')} // Re-animate on category change
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {showBreaking ? 'Breaking Fact Checks' : getCategoryDisplayName()}
          </motion.h2>
          {selectedCategories.length > 0 && (
            <motion.p 
              className="text-sm mt-1"
              style={{ color: colors.mutedForeground }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {selectedCategories.length === 1 
                ? `Showing fact-checks from the ${selectedCategories[0]} category`
                : `Showing fact-checks from ${selectedCategories.length} selected categories`
              }
            </motion.p>
          )}
        </div>

        {/* Refresh Button */}
        <motion.button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 rounded-lg transition-all duration-200"
          style={{
            background: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(148, 163, 184, 0.2)',
            border: `1px solid ${isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(148, 163, 184, 0.3)'}`,
            color: colors.mutedForeground
          }}
          whileHover={{
            scale: 1.05,
            background: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(148, 163, 184, 0.3)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading && articles.length === 0 ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSkeleton />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ErrorState />
          </motion.div>
        ) : articles.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState />
          </motion.div>
        ) : (
          <motion.div
            key={`articles-${refreshKey}-${selectedCategories.join('-')}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <NewsGrid 
              articles={articles}
              onArticleRead={(articleId) => {
                console.log('Article read:', articleId);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator for refresh */}
      {loading && articles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center py-4"
        >
          <div className="inline-flex items-center gap-2 text-sm" style={{ color: colors.mutedForeground }}>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Updating news...
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FeaturedNews;