import { memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useNewsFilters } from '@/app/stores/filterStore';
import { useNewsWithExchange } from '@/app/hooks/useNews';
import { useNewsTranslations, useCommonTranslations } from '@/app/hooks/useSmartTranslations';
import { NewsGrid } from '../feed/NewsGrid';
import FeaturedNewsHead from './FeaturedNewsHead';

interface FeaturedNewsProps {
  limit?: number;
  showBreaking?: boolean;
  autoRefresh?: boolean;
}

const FeaturedNews = memo(({ 
  limit = 10,
  showBreaking = false,
  autoRefresh = true,
}: FeaturedNewsProps) => {
  const { colors } = useLayoutTheme();
  const newsFilters = useNewsFilters();
  
  const { t: tn } = useNewsTranslations();
  const { t: tc } = useCommonTranslations();

  const enhancedFilters = useMemo(() => {
    const filters = {
      limit,
      autoRefresh,
      ...(newsFilters.categoryFilter && { categoryFilter: newsFilters.categoryFilter }),
      ...(newsFilters.countryFilter && { countryFilter: newsFilters.countryFilter }),
      ...(newsFilters.searchText && { searchText: newsFilters.searchText }),
      ...(newsFilters.statusFilter && { statusFilter: newsFilters.statusFilter }),
      ...(newsFilters.sourceFilter && { sourceFilter: newsFilters.sourceFilter }),
      ...(newsFilters.topicFilter && { topicId: newsFilters.topicFilter }),
      ...(showBreaking && { breaking: true }),
      ...(newsFilters.breaking && { breaking: newsFilters.breaking }),
      ...(newsFilters.onlyFactChecked && { onlyFactChecked: newsFilters.onlyFactChecked }),
    };
    
    console.log('🔍 FeaturedNews stable filters created:', filters);
    return filters;
  }, [
    limit, 
    autoRefresh, 
    showBreaking,
    newsFilters.categoryFilter,
    newsFilters.countryFilter,
    newsFilters.searchText,
    newsFilters.statusFilter,
    newsFilters.sourceFilter,
    newsFilters.topicFilter,
    newsFilters.breaking,
    newsFilters.onlyFactChecked
  ]);

  const { 
    articles: researchResults, 
    loading, 
    error, 
    refreshNews,
    replaceReadArticle,
    hasMoreArticles
  } = useNewsWithExchange(enhancedFilters);

  const handleArticleRead = useCallback((articleId: string) => {
    console.log(`📖 Article read: ${articleId}`);
    replaceReadArticle(articleId);
  }, [replaceReadArticle]);

  const handleRefresh = useCallback(() => {
    refreshNews();
  }, [refreshNews]);

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
      <FeaturedNewsHead
        loading={loading}
        validResearchResults={validResearchResults}
        handleRefresh={handleRefresh}
      />
      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
              {tn('error_title', 'Unable to Load News')}
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.mutedForeground }}>
              {tn('error_message', 'There was a problem loading the latest news. Please try again.')}
            </p>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {tc('try_again', 'Try Again')}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <NewsGrid
              articles={validResearchResults}
              onArticleRead={handleArticleRead}
              layout="grid"
              className="mb-8"
              loading={loading} 
            />
            
            {loading && validResearchResults.length > 0 && (
              <div className="text-center py-4">
                <span style={{ color: colors.mutedForeground }}>
                  {tn('loading_more', 'Loading more articles')}...
                </span>
              </div>
            )}
            
            {!hasMoreArticles && validResearchResults.length > 0 && !loading && (
              <div className="text-center py-4">
                <span style={{ color: colors.mutedForeground }}>
                  {tn('no_more_articles', 'No more articles to load')}
                </span>
              </div>
            )}

            {validResearchResults.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📰</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
                  {tn('no_articles_title', 'No Articles Found')}
                </h3>
                <p className="text-sm" style={{ color: colors.mutedForeground }}>
                  {tn('no_articles_message', 'Try adjusting your filters or check back later for new content.')}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

FeaturedNews.displayName = 'FeaturedNews';

export default FeaturedNews;