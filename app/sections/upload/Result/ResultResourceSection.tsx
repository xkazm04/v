import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { 
  getSourceCategoryIcon, 
  getSourceCategoryLabel,
  SOURCE_CATEGORIES,
  type SourceCategoryType 
} from '@/app/components/research/utils/statusConfig';
import type { ResourceAnalysis } from '../types';

const ResultResourceSection = ({ 
    analysis, 
    type, 
    percentage,
    isLoading
}: { 
    analysis?: ResourceAnalysis; 
    type: 'supporting' | 'contradicting';
    percentage: number;
    isLoading: boolean;
}) => {
    const { colors, isDark } = useLayoutTheme();
    
    if (!analysis) return null;

    const isSupporting = type === 'supporting';
    const Icon = isSupporting ? CheckCircle : XCircle;
    const TrendIcon = isSupporting ? TrendingUp : TrendingDown;

    // ✅ UPDATED: Use centralized source category utilities
    const sourceBreakdown = [
        { key: SOURCE_CATEGORIES.MAINSTREAM, label: getSourceCategoryLabel(SOURCE_CATEGORIES.MAINSTREAM), value: analysis.mainstream },
        { key: SOURCE_CATEGORIES.GOVERNANCE, label: getSourceCategoryLabel(SOURCE_CATEGORIES.GOVERNANCE), value: analysis.governance },
        { key: SOURCE_CATEGORIES.ACADEMIC, label: getSourceCategoryLabel(SOURCE_CATEGORIES.ACADEMIC), value: analysis.academic },
        { key: SOURCE_CATEGORIES.MEDICAL, label: getSourceCategoryLabel(SOURCE_CATEGORIES.MEDICAL), value: analysis.medical },
        { key: SOURCE_CATEGORIES.LEGAL, label: getSourceCategoryLabel(SOURCE_CATEGORIES.LEGAL), value: analysis.legal },
        { key: SOURCE_CATEGORIES.POLICY, label: getSourceCategoryLabel(SOURCE_CATEGORIES.POLICY), value: analysis.policy },
        { key: SOURCE_CATEGORIES.ECONOMIC, label: getSourceCategoryLabel(SOURCE_CATEGORIES.ECONOMIC), value: analysis.economic },
        { key: SOURCE_CATEGORIES.TECHNOLOGY, label: getSourceCategoryLabel(SOURCE_CATEGORIES.TECHNOLOGY), value: analysis.technology },
        { key: SOURCE_CATEGORIES.FACT_CHECKING, label: getSourceCategoryLabel(SOURCE_CATEGORIES.FACT_CHECKING), value: analysis.fact_checking },
        { key: SOURCE_CATEGORIES.INTERNATIONAL, label: getSourceCategoryLabel(SOURCE_CATEGORIES.INTERNATIONAL), value: analysis.international },
        { key: SOURCE_CATEGORIES.OTHER, label: getSourceCategoryLabel(SOURCE_CATEGORIES.OTHER), value: analysis.other }
    ].filter(item => item.value > 0); // Only show categories with sources

    // ✅ NEW: Handle reference URL click
    const handleReferenceClick = (url: string, title: string) => {
        try {
            window.open(url, '_blank', 'noopener,noreferrer');
            console.log('Opened reference:', { title, url });
        } catch (error) {
            console.error('Failed to open reference:', error);
            // Fallback: copy to clipboard or show error
            navigator.clipboard?.writeText(url).then(() => {
                console.log('URL copied to clipboard as fallback');
            });
        }
    };

    return (
        <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div 
                        className="p-2 rounded-xl"
                        style={{
                            background: isSupporting 
                                ? isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)'
                                : isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                            color: isSupporting 
                                ? isDark ? '#4ade80' : '#16a34a'
                                : isDark ? '#f87171' : '#dc2626'
                        }}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 
                            className="font-bold text-lg"
                            style={{ 
                                color: isSupporting 
                                    ? isDark ? '#4ade80' : '#16a34a'
                                    : isDark ? '#f87171' : '#dc2626'
                            }}
                        >
                            {isSupporting ? 'Supporting' : 'Contradicting'}
                        </h4>
                        <p className="text-sm" style={{ color: colors.mutedForeground }}>
                            {analysis.count} sources
                        </p>
                    </div>
                </div>
                
                <div 
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-lg text-white"
                    style={{
                        background: isSupporting 
                            ? isDark ? '#16a34a' : '#22c55e'
                            : isDark ? '#dc2626' : '#ef4444'
                    }}
                >
                    <TrendIcon className="h-4 w-4" />
                    {percentage.toFixed(0)}%
                </div>
            </div>

            {/* Source Type Breakdown */}
            {sourceBreakdown.length > 0 && (
                <div className="space-y-3">
                    <h5 
                        className="font-semibold text-sm uppercase tracking-wide"
                        style={{ color: colors.mutedForeground }}
                    >
                        Source Breakdown
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                        {sourceBreakdown.map(({ key, label, value }) => {
                            const SourceIcon = getSourceCategoryIcon(key);
                            return (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex items-center gap-2 p-2 rounded-lg"
                                    style={{
                                        background: isDark 
                                            ? 'rgba(255, 255, 255, 0.05)' 
                                            : 'rgba(0, 0, 0, 0.03)',
                                        border: `1px solid ${colors.border}`
                                    }}
                                >
                                    <SourceIcon 
                                        className="h-4 w-4 flex-shrink-0"
                                        style={{ color: colors.mutedForeground }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate" style={{ color: colors.foreground }}>
                                            {label}
                                        </p>
                                        <p className="text-xs font-bold" style={{ color: colors.primary }}>
                                            {value}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Countries */}
            {analysis.major_countries && analysis.major_countries.length > 0 && (
                <div>
                    <h5 
                        className="font-semibold text-sm uppercase tracking-wide mb-2"
                        style={{ color: colors.mutedForeground }}
                    >
                        Major Countries
                    </h5>
                    <div className="flex flex-wrap gap-1">
                        {analysis.major_countries.slice(0, 3).map((country, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 rounded-full text-xs font-medium"
                                style={{
                                    background: isDark 
                                        ? 'rgba(255, 255, 255, 0.1)' 
                                        : 'rgba(0, 0, 0, 0.05)',
                                    color: colors.foreground,
                                    border: `1px solid ${colors.border}`
                                }}
                            >
                                {country.toUpperCase()}
                            </span>
                        ))}
                        {analysis.major_countries.length > 3 && (
                            <span
                                className="px-2 py-1 rounded-full text-xs font-medium"
                                style={{
                                    background: colors.muted,
                                    color: colors.mutedForeground
                                }}
                            >
                                +{analysis.major_countries.length - 3} more
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Key Sources Preview */}
            {analysis.references && analysis.references.length > 0 && (
                <div>
                    <h5 
                        className="font-semibold text-sm uppercase tracking-wide mb-2"
                        style={{ color: colors.mutedForeground }}
                    >
                        Key Sources
                    </h5>
                    <div className="space-y-2">
                        {analysis.references.slice(0, 2).map((reference, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="p-3 rounded-lg"
                                style={{
                                    background: isDark 
                                        ? 'rgba(255, 255, 255, 0.05)' 
                                        : 'rgba(0, 0, 0, 0.03)',
                                    border: `1px solid ${colors.border}`
                                }}
                            >
                                <div className="flex items-start gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                                        style={{
                                            background: reference.credibility === 'high' 
                                                ? '#22c55e' 
                                                : reference.credibility === 'medium' 
                                                ? '#f59e0b' 
                                                : '#ef4444'
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        {/* ✅ NEW: Clickable title with external link */}
                                        <button
                                            onClick={() => handleReferenceClick(reference.url, reference.title)}
                                            className="text-sm font-medium truncate hover:underline transition-all duration-200 flex items-center gap-1 group w-full text-left"
                                            style={{ color: colors.foreground }}
                                        >
                                            <span className="truncate">{reference.title}</span>
                                            <ExternalLink 
                                                className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                                                style={{ color: colors.primary }}
                                            />
                                        </button>
                                        
                                        <p className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
                                            {getSourceCategoryLabel(reference.category)} • {reference.country.toUpperCase()}
                                        </p>
                                        
                                        {reference.key_finding && (
                                            <p className="text-xs mt-1 italic" style={{ color: colors.mutedForeground }}>
                                                "{reference.key_finding}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {analysis.references.length > 2 && (
                            <div 
                                className="text-center py-2 text-xs"
                                style={{ color: colors.mutedForeground }}
                            >
                                +{analysis.references.length - 2} more sources
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultResourceSection;