'use client';

import { useCallback, useMemo } from 'react';
import { useNews } from '@/app/hooks/useNews';
import { NewsGrid } from '../feed/NewsGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Button } from '@/app/components/ui/button';
import { useNewsFilters } from '@/app/stores/filterStore';

interface FeaturedNewsProps {
  limit?: number;
  showBreaking?: boolean;
  autoRefresh?: boolean;
}

const FeaturedNews = ({ 
  limit = 20, 
  showBreaking = false,
  autoRefresh = true,
}: FeaturedNewsProps) => {
  const { colors, isDark } = useLayoutTheme();
  
  // Get filter state from Zustand store
  const newsFilters = useNewsFilters();

  // Prepare stable filters for useNews hook
  const enhancedFilters = useMemo(() => ({
    limit,
    autoRefresh,
    categoryFilter: newsFilters.categoryFilter,
    countryFilter: newsFilters.countryFilter,
    searchText: newsFilters.searchText,
    statusFilter: newsFilters.statusFilter,
    sourceFilter: newsFilters.sourceFilter,
    breaking: showBreaking || newsFilters.breaking,
    onlyFactChecked: newsFilters.onlyFactChecked,
  }), [newsFilters, limit, autoRefresh, showBreaking]);

  // Fetch news with dynamic filters
  const { 
    articles, 
    loading, 
    error, 
    refreshNews
  } = useNews(enhancedFilters);

  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    refreshNews();
  }, [refreshNews]);

  // Get display title based on filters
  const getDisplayTitle = useCallback(() => {
    if (showBreaking || newsFilters.breaking) return 'Breaking Fact Checks';
    if (newsFilters.categoryFilter && newsFilters.categoryFilter !== 'all') {
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
      return `${categoryLabels[newsFilters.categoryFilter] || newsFilters.categoryFilter} News`;
    }
    if (newsFilters.countryFilter && newsFilters.countryFilter !== 'worldwide' && newsFilters.countryFilter !== 'all') {
      const countryLabels: Record<string, string> = {
        'US': 'United States',
        'GB': 'United Kingdom',
        'FR': 'France',
        'DE': 'Germany',
        'CA': 'Canada',
        'AU': 'Australia',
        'JP': 'Japan',
        'CN': 'China',
        'IN': 'India',
        'BR': 'Brazil',
        'RU': 'Russia',
        'ZA': 'South Africa',
        'KR': 'South Korea',
        'MX': 'Mexico',
        'IT': 'Italy',
        'ES': 'Spain',
        'NL': 'Netherlands',
        'SE': 'Sweden',
        'NO': 'Norway',
      };
      return `News from ${countryLabels[newsFilters.countryFilter] || newsFilters.countryFilter}`;
    }
    return 'Latest Fact Checks';
  }, [newsFilters, showBreaking]);

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
      <Button onClick={handleRefresh} variant="default">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </motion.div>
  );

  // Empty state
  const EmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <h3 
        className="text-lg font-semibold mb-2"
        style={{ color: colors.foreground }}
      >
        No articles found
      </h3>
      <p className="mb-4" style={{ color: colors.mutedForeground }}>
        Try adjusting your filters or check back later for new content.
      </p>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <motion.h2 
            className="text-2xl font-bold"
            style={{ color: colors.foreground }}
            key={getDisplayTitle()}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {getDisplayTitle()}
          </motion.h2>
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
            key={`articles-${getDisplayTitle()}-${articles.length}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <NewsGrid 
              articles={articles}
              onArticleRead={(articleId) => {
                // Handle article read tracking if needed
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