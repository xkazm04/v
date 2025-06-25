import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useCommonTranslations, useNewsTranslations } from "@/app/hooks/useSmartTranslations";
import { useNewsFilters } from "@/app/stores/filterStore";
import { useReadArticlesStore } from "@/app/stores/useReadArticlesStore";
import { ResearchResult } from "@/app/types/article";
import { RefreshCcw } from "lucide-react";
import { useMemo } from "react";

type Props = {
    loading: boolean;
    validResearchResults: ResearchResult[]; 
    handleRefresh: () => void;
}

const FeaturedNewsHead = ({loading,validResearchResults, handleRefresh }: Props) => {
    const { colors } = useLayoutTheme();
    const { getExcludeIds } = useReadArticlesStore();

    const newsFilters = useNewsFilters();

    const { t: tn, isTranslationActive, userPreferredLanguage } = useNewsTranslations();
    const { t: tc } = useCommonTranslations();

    const showTranslationIndicator = useMemo(() => {
        return isTranslationActive && userPreferredLanguage !== 'en';
    }, [isTranslationActive, userPreferredLanguage]);
    const excludedCount = getExcludeIds().length;

    const activeFiltersDisplay = useMemo(() => {
        const activeFilters = [];
        if (newsFilters.categoryFilter) {
            const categoryLabel = tn(`categories.${newsFilters.categoryFilter}`, newsFilters.categoryFilter);
            activeFilters.push(`📂 ${categoryLabel}`);
        }
        if (newsFilters.countryFilter) {
            const countryLabel = tn(`countries.${newsFilters.countryFilter}`, newsFilters.countryFilter);
            activeFilters.push(`🌍 ${countryLabel}`);
        }
        if (newsFilters.searchText) {
            activeFilters.push(`🔍 "${newsFilters.searchText}"`);
        }
        if (newsFilters.topicFilter) {
            const topicLabel = tn(`topics.${newsFilters.topicFilter}`, `Topic: ${newsFilters.topicFilter}`);
            activeFilters.push(`🔥 ${topicLabel}`);
        }
        return activeFilters;
    }, [newsFilters.categoryFilter, newsFilters.countryFilter, newsFilters.searchText, newsFilters.topicFilter, tn]);
    return <>
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <h2
                    className="text-2xl font-bold"
                    style={{ color: colors.foreground }}
                >
                    {tn('featured_news', 'Featured News')}
                </h2>

                {showTranslationIndicator && (
                    <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        <span className="text-xs font-medium">
                            🌐 {userPreferredLanguage.toUpperCase()}
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-4 text-sm" style={{ color: colors.mutedForeground }}>
                    {loading ? (
                        <span>{tc('loading', 'Loading')}...</span>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span>{tn('articles_count', '{count} articles', { count: validResearchResults.length })}</span>
                            {excludedCount > 0 && (
                                <span className="text-xs opacity-70">
                                    ({tn('excluded_count', '{count} read', { count: excludedCount })})
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    style={{ color: colors.foreground }}
                >
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {tc('refresh', 'Refresh')}
                </button>
            </div>
        </div>

        {activeFiltersDisplay.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm font-medium" style={{ color: colors.foreground }}>
                    {tn('active_filters', 'Active filters')}:
                </span>
                {activeFiltersDisplay.map((filter, index) => (
                    <span
                        key={index}
                        className="text-sm px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                    >
                        {filter}
                    </span>
                ))}
            </div>
        )}
    </>
}

export default FeaturedNewsHead