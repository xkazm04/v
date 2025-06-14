import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { ResourceAnalysis } from "../types";
import { CheckCircle, XCircle, TrendingUp, TrendingDown, Users, Building, GraduationCap, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/app/components/ui/badge";
import { getCredibilityColor, getMediaCategoryIcon } from "@/app/helpers/researchResultHelpers";
import { Button } from "@/app/components/ui/button";
import { getCountryFlag } from "@/app/helpers/countries";

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

      const getSourceTypeIcon = (type: string) => {
        switch (type) {
          case 'mainstream': return Users;
          case 'governance': return Building;
          case 'academic': return GraduationCap;
          case 'medical': return Heart;
          default: return Users;
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
                {analysis.total} sources
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
        <div className="space-y-3">
          <h5 
            className="font-semibold text-sm uppercase tracking-wide"
            style={{ color: colors.mutedForeground }}
          >
            Source Breakdown
          </h5>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'mainstream', label: 'Mainstream', value: analysis.mainstream },
              { key: 'governance', label: 'Government', value: analysis.governance },
              { key: 'academic', label: 'Academic', value: analysis.academic },
              { key: 'medical', label: 'Medical', value: analysis.medical }
            ].map(({ key, label, value }) => {
              const SourceIcon = getSourceTypeIcon(key);
              return (
                <div 
                  key={key} 
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{
                    background: isDark ? 'rgba(71, 85, 105, 0.2)' : 'rgba(248, 250, 252, 0.8)',
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <div className="flex items-center gap-2">
                    <SourceIcon className="h-4 w-4" style={{ color: colors.mutedForeground }} />
                    <span className="text-sm font-medium" style={{ color: colors.foreground }}>
                      {label}
                    </span>
                  </div>
                  <span 
                    className="font-bold"
                    style={{ 
                      color: value > 0 
                        ? isSupporting 
                          ? isDark ? '#4ade80' : '#16a34a'
                          : isDark ? '#f87171' : '#dc2626'
                        : colors.mutedForeground
                    }}
                  >
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Countries */}
        {analysis.major_countries.length > 0 && (
          <div>
            <h5 
              className="font-semibold text-sm uppercase tracking-wide mb-2"
              style={{ color: colors.mutedForeground }}
            >
              Major Countries
            </h5>
            <div className="flex flex-wrap gap-1">
              {analysis.major_countries.slice(0, 3).map((country, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs"
                  style={{
                    background: isDark ? 'rgba(71, 85, 105, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                    color: colors.foreground,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  {getCountryFlag(country)} {country.toUpperCase()}
                </Badge>
              ))}
              {analysis.major_countries.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{
                    background: isDark ? 'rgba(71, 85, 105, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                    color: colors.foreground,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  +{analysis.major_countries.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Key Sources Preview */}
        {analysis.references.length > 0 && (
          <div>
            <h5 
              className="font-semibold text-sm uppercase tracking-wide mb-2"
              style={{ color: colors.mutedForeground }}
            >
              Key Sources
            </h5>
            <div className="space-y-2">
              {analysis.references.slice(0, 2).map((reference, index) => {
                const CategoryIcon = getMediaCategoryIcon(reference.category);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-3 hover:shadow-sm transition-all"
                    style={{
                      background: isDark ? 'rgba(71, 85, 105, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <CategoryIcon className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: colors.mutedForeground }} />
                      <div className="flex-1 min-w-0">
                        <Button
                          variant="link"
                          className="h-auto p-0 text-left font-medium text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => window.open(reference.url, '_blank')}
                          disabled={isLoading}
                        >
                          <span className="line-clamp-2">{reference.title}</span>
                        </Button>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getCredibilityColor(reference.credibility)}`}>
                            {reference.credibility}
                          </Badge>
                          <span className="text-xs capitalize" style={{ color: colors.mutedForeground }}>
                            {reference.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {analysis.references.length > 2 && (
                <p className="text-xs text-center py-1" style={{ color: colors.mutedForeground }}>
                  +{analysis.references.length - 2} more sources
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  export default ResultResourceSection