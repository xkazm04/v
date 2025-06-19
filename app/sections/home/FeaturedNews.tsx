
import { useCallback, useMemo, memo } from 'react';
import { useNews } from '@/app/hooks/useNews';
import { NewsGrid } from '../feed/NewsGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Button } from '@/app/components/ui/button';
import { useNewsFilters } from '@/app/stores/filterStore';
import { countryLabels } from '@/app/helpers/countries';

interface FeaturedNewsProps {
  limit?: number;
  showBreaking?: boolean;
  autoRefresh?: boolean;
}


const FeaturedNews = memo(({ 
  limit = 20, 
  showBreaking = false,
  autoRefresh = true,
}: FeaturedNewsProps) => {
  const { colors, isDark } = useLayoutTheme();
  const newsFilters = useNewsFilters();

  // Stable filters to prevent unnecessary re-renders
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

  // ✅ **FIX: Fetch research results directly**
  const { 
    articles: researchResults, // This is already ResearchResult[]
    loading, 
    error, 
    refreshNews,
    dataSource
  } = useNews(enhancedFilters);

  // Stable handlers
  const handleRefresh = useCallback(() => {
    refreshNews();
  }, [refreshNews]);

  // ✅ **FIX: Add validation for research results**
  const validResearchResults = useMemo(() => {
    if (!Array.isArray(researchResults)) {
      console.warn('FeaturedNews: researchResults is not an array', researchResults);
      return [];
    }

    const filtered = researchResults.filter(result => 
      result && 
      typeof result === 'object' && 
      result.id && 
      result.statement
    );

    if (filtered.length < researchResults.length) {
      console.warn(`FeaturedNews: Filtered out ${researchResults.length - filtered.length} invalid results`);
    }

    return filtered;
  }, [researchResults]);


  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <motion.h2 
            className="text-2xl font-bold"
            style={{ color: colors.foreground }}
            key={'featured-news-title'}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            Researched statements
          </motion.h2>
        </div>

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
        {error ? (
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
              Failed to load research
            </h3>
            <p 
              className="mb-4"
              style={{ color: colors.mutedForeground }}
            >
              {error || 'Something went wrong while fetching research.'}
            </p>
            <Button onClick={handleRefresh} variant="default">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </motion.div>
        ) : validResearchResults.length === 0 && !loading ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
            style={{ color: colors.mutedForeground }}
          >
            No research results found.
          </motion.div>
        ) : (
          <motion.div
            key={`research-news-${validResearchResults.length}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* ✅ **FIX: Pass ResearchResult[] directly to NewsGrid** */}
            <NewsGrid 
              articles={validResearchResults}
              onArticleRead={(researchId) => {
                // Handle research read tracking if needed
                console.log('Research read:', researchId);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {loading && validResearchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center py-4"
        >
          <div className="inline-flex items-center gap-2 text-sm" style={{ color: colors.mutedForeground }}>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Updating research...
          </div>
        </motion.div>
      )}
    </div>
  );
});

FeaturedNews.displayName = 'FeaturedNews';

export default FeaturedNews;