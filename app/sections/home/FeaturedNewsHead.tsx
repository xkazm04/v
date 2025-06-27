import { NavbarSearchBar } from "@/app/components/search/NavbarSearchBar";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useCommonTranslations, useNewsTranslations } from "@/app/hooks/useSmartTranslations";
import { useNewsFilters } from "@/app/stores/filterStore";
import { useReadArticlesStore } from "@/app/stores/useReadArticlesStore";
import { ResearchResult } from "@/app/types/article";
import { RefreshCcw, Filter } from "lucide-react";
import { useMemo } from "react";

type Props = {
    loading: boolean;
    validResearchResults: ResearchResult[]; 
    handleRefresh: () => void;
    reservePoolSize?: number;
}

const FeaturedNewsHead = ({loading, validResearchResults, handleRefresh, reservePoolSize = 0 }: Props) => {
    const { colors, isDark } = useLayoutTheme();
    const { getExcludeIds } = useReadArticlesStore();

    const newsFilters = useNewsFilters();

    const { t: tn, isTranslationActive, userPreferredLanguage } = useNewsTranslations();
    const { t: tc } = useCommonTranslations();

    const showTranslationIndicator = useMemo(() => {
        return isTranslationActive && userPreferredLanguage !== 'en';
    }, [isTranslationActive, userPreferredLanguage]);
    
    const excludedCount = getExcludeIds().length;

    const activeFiltersData = useMemo(() => {
        const filters = [];
        if (newsFilters.categoryFilter) {
            const categoryLabel = tn(`categories.${newsFilters.categoryFilter}`, newsFilters.categoryFilter);
            filters.push({ 
                type: 'category',
                icon: '📂', 
                label: categoryLabel,
                value: newsFilters.categoryFilter
            });
        }
        if (newsFilters.countryFilter) {
            const countryLabel = tn(`countries.${newsFilters.countryFilter}`, newsFilters.countryFilter);
            filters.push({ 
                type: 'country',
                icon: '🌍', 
                label: countryLabel,
                value: newsFilters.countryFilter
            });
        }
        if (newsFilters.searchText) {
            filters.push({ 
                type: 'search',
                icon: '🔍', 
                label: `"${newsFilters.searchText}"`,
                value: newsFilters.searchText
            });
        }
        if (newsFilters.topicFilter) {
            const topicLabel = tn(`topics.${newsFilters.topicFilter}`, `Topic: ${newsFilters.topicFilter}`);
            filters.push({ 
                type: 'topic',
                icon: '🔥', 
                label: topicLabel,
                value: newsFilters.topicFilter
            });
        }
        return filters;
    }, [newsFilters.categoryFilter, newsFilters.countryFilter, newsFilters.searchText, newsFilters.topicFilter, tn]);

    const hasActiveFilters = activeFiltersData.length > 0;

    return (
        <>
            <div className="flex justify-between items-start gap-4">
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
                </div>

                <div className="flex items-center gap-2">
                    <NavbarSearchBar placeholder='Search news' />
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors"
                        style={{ 
                            color: colors.foreground,
                            borderColor: isDark ? colors.border : '#e5e7eb',
                            backgroundColor: loading ? (isDark ? '#374151' : '#f3f4f6') : 'transparent'
                        }}
                    >
                        <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {tc('refresh', 'Refresh')}
                    </button>
                </div>
            </div>

            {/* Articles count with inline filters and reserve pool info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm" style={{ color: colors.mutedForeground }}>
                    {loading ? (
                        <span>{tc('loading', 'Loading')}...</span>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span>{tn('articles_count', '{count} articles', { count: validResearchResults.length })}</span>
                                {excludedCount > 0 && (
                                    <span className="text-xs opacity-70">
                                        ({tn('excluded_count', '{count} read', { count: excludedCount })})
                                    </span>
                                )}
                            </div>
                            {reservePoolSize > 0 && (
                                <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                    <span>🏊</span>
                                    <span>{reservePoolSize} ready</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Inline Active Filters */}
                {hasActiveFilters && (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs" style={{ color: colors.mutedForeground }}>
                            <Filter className="w-3 h-3" />
                            <span>{activeFiltersData.length}</span>
                        </div>
                        <div className="flex items-center gap-1 max-w-md overflow-hidden">
                            {activeFiltersData.slice(0, 3).map((filter, index) => (
                                <div
                                    key={`${filter.type}-${index}`}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all hover:scale-105"
                                    style={{
                                        backgroundColor: isDark 
                                            ? `${colors.primary}15` 
                                            : `${colors.primary}10`,
                                        color: colors.primary,
                                        border: `1px solid ${colors.primary}20`
                                    }}
                                    title={`${filter.icon} ${filter.label}`}
                                >
                                    <span className="text-[10px]">{filter.icon}</span>
                                    <span className="truncate max-w-20">{filter.label}</span>
                                </div>
                            ))}
                            {activeFiltersData.length > 3 && (
                                <div
                                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium"
                                    style={{
                                        backgroundColor: isDark 
                                            ? `${colors.mutedForeground}20` 
                                            : `${colors.mutedForeground}15`,
                                        color: colors.mutedForeground
                                    }}
                                    title={`+${activeFiltersData.length - 3} more filters`}
                                >
                                    +{activeFiltersData.length - 3}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default FeaturedNewsHead