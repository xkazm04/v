"use client";

import { motion } from "framer-motion";
import { Globe, BookOpen, Building, Heart, ExternalLink, TrendingUp, TrendingDown, Shield, AlertTriangle } from "lucide-react";
import { LLMResearchResponse } from "@/app/types/research";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";

interface FactCheckSourcesProps {
  factCheck: LLMResearchResponse;
  config: any;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Category icon mapping
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'mainstream': return Globe;
    case 'academic': return BookOpen;
    case 'governance': return Building;
    case 'medical': return Heart;
    default: return ExternalLink;
  }
};

// Credibility color mapping
const getCredibilityColor = (credibility: string, isDark: boolean) => {
  switch (credibility.toLowerCase()) {
    case 'high': return isDark ? '#22c55e' : '#16a34a';
    case 'medium': return isDark ? '#f59e0b' : '#d97706';
    case 'low': return isDark ? '#ef4444' : '#dc2626';
    default: return isDark ? '#6b7280' : '#9ca3af';
  }
};

export function FactCheckSources({ factCheck, config }: FactCheckSourcesProps) {
  const { isDark } = useLayoutTheme();
  
  if (!factCheck.resources_agreed && !factCheck.resources_disagreed) {
    return (
      <motion.div variants={sectionVariants} className="h-full flex flex-col items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
        <p className="text-sm text-muted-foreground text-center">No source data available</p>
      </motion.div>
    );
  }

  const supportingData = factCheck.resources_agreed;
  const opposingData = factCheck.resources_disagreed;
  
  const supportingCount = supportingData?.count || 0;
  const opposingCount = opposingData?.count || 0;
  const totalCount = supportingCount + opposingCount;
  
  const supportingPercentage = totalCount > 0 ? (supportingCount / totalCount * 100) : 0;
  const opposingPercentage = totalCount > 0 ? (opposingCount / totalCount * 100) : 0;

  // Use real references if available, otherwise show summary
  const supportingResources = supportingData?.references?.slice(0, 3) || [];
  const opposingResources = opposingData?.references?.slice(0, 3) || [];

  const themeColors = {
    supporting: {
      bg: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)',
      border: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)',
      text: isDark ? '#4ade80' : '#16a34a',
      hover: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)'
    },
    opposing: {
      bg: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
      border: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
      text: isDark ? '#f87171' : '#dc2626',
      hover: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)'
    },
    neutral: {
      bg: isDark ? 'rgba(71, 85, 105, 0.1)' : 'rgba(248, 250, 252, 0.8)',
      border: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.5)',
      text: isDark ? '#94a3b8' : '#64748b'
    }
  };

  return (
    <motion.div variants={sectionVariants} className="h-full flex flex-col">
      {/* Header with Overall Stats */}
      <div className="flex-shrink-0 mb-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">Source Analysis</h4>
      
        {/* Source Type Breakdown */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { 
              label: "Media", 
              count: (supportingData?.mainstream || 0) + (opposingData?.mainstream || 0), 
              icon: Globe 
            },
            { 
              label: "Academic", 
              count: (supportingData?.academic || 0) + (opposingData?.academic || 0), 
              icon: BookOpen 
            },
            { 
              label: "Gov", 
              count: (supportingData?.governance || 0) + (opposingData?.governance || 0), 
              icon: Building 
            },
            { 
              label: "Medical", 
              count: (supportingData?.medical || 0) + (opposingData?.medical || 0), 
              icon: Heart 
            }
          ].map((source, index) => (
            <motion.div
              key={source.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6 + index * 0.1 }}
              className="flex flex-col items-center p-2 rounded-lg border"
              style={{
                background: themeColors.neutral.bg,
                borderColor: themeColors.neutral.border
              }}
            >
              <source.icon className="w-3 h-3 mb-1" style={{ color: themeColors.neutral.text }} />
              <div className="text-xs mb-1" style={{ color: themeColors.neutral.text }}>
                {source.label}
              </div>
              <div className="text-lg font-bold text-foreground">{source.count}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Source Lists */}
      <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
        {/* Supporting Sources */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3 h-3" style={{ color: themeColors.supporting.text }} />
            <h5 className="text-xs font-semibold" style={{ color: themeColors.supporting.text }}>
              Supporting Evidence
            </h5>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-32 content-scroll">
            {supportingResources.length > 0 ? (
              supportingResources.map((resource, index) => {
                const CategoryIcon = getCategoryIcon(resource.category);
                return (
                  <motion.a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 + index * 0.2 }}
                    className="group flex items-start gap-2 p-2 rounded-lg border transition-all cursor-pointer"
                    style={{
                      background: themeColors.supporting.bg,
                      borderColor: themeColors.supporting.border
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = themeColors.supporting.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = themeColors.supporting.bg;
                    }}
                  >
                    <CategoryIcon className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: themeColors.supporting.text }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs leading-tight line-clamp-2" style={{ color: themeColors.supporting.text }}>
                        {resource.title}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span 
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            background: `${themeColors.supporting.text}20`,
                            color: themeColors.supporting.text
                          }}
                        >
                          {resource.category}
                        </span>
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: getCredibilityColor(resource.credibility, isDark)
                          }}
                          title={`${resource.credibility} credibility`}
                        />
                      </div>
                    </div>
                  </motion.a>
                );
              })
            ) : (
              <div className="text-xs text-muted-foreground text-center py-4">
                {supportingCount > 0 ? `${supportingCount} sources available` : 'No supporting sources'}
              </div>
            )}
          </div>
        </div>

        {/* Opposing Sources */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-3 h-3" style={{ color: themeColors.opposing.text }} />
            <h5 className="text-xs font-semibold" style={{ color: themeColors.opposing.text }}>
              Opposing Views
            </h5>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-32 content-scroll">
            {opposingResources.length > 0 ? (
              opposingResources.map((resource, index) => {
                const CategoryIcon = getCategoryIcon(resource.category);
                return (
                  <motion.a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.2 + index * 0.2 }}
                    className="group flex items-start gap-2 p-2 rounded-lg border transition-all cursor-pointer"
                    style={{
                      background: themeColors.opposing.bg,
                      borderColor: themeColors.opposing.border
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = themeColors.opposing.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = themeColors.opposing.bg;
                    }}
                  >
                    <CategoryIcon className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: themeColors.opposing.text }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs leading-tight line-clamp-2" style={{ color: themeColors.opposing.text }}>
                        {resource.title}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span 
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            background: `${themeColors.opposing.text}20`,
                            color: themeColors.opposing.text
                          }}
                        >
                          {resource.category}
                        </span>
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: getCredibilityColor(resource.credibility, isDark)
                          }}
                          title={`${resource.credibility} credibility`}
                        />
                      </div>
                    </div>
                  </motion.a>
                );
              })
            ) : (
              <div className="text-xs text-muted-foreground text-center py-4">
                {opposingCount > 0 ? `${opposingCount} sources available` : 'No opposing sources'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overall Consensus Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8 }}
        className="flex-shrink-0 mt-3 p-2 rounded-lg border"
        style={{
          background: themeColors.neutral.bg,
          borderColor: themeColors.neutral.border
        }}
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" style={{ color: themeColors.neutral.text }} />
            <span style={{ color: themeColors.neutral.text }}>Scientific Consensus</span>
          </div>
          <span 
            className="font-bold"
            style={{ 
              color: supportingPercentage > 70 ? themeColors.supporting.text : 
                     supportingPercentage > 50 ? '#d97706' : themeColors.opposing.text
            }}
          >
            {supportingPercentage.toFixed(0)}% Agreement
          </span>
        </div>
        <div className="mt-1 h-2 rounded-full overflow-hidden" style={{ background: `${themeColors.neutral.text}20` }}>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: supportingPercentage / 100 }}
            transition={{ delay: 3, duration: 1 }}
            className="h-full origin-left rounded-full"
            style={{
              background: supportingPercentage > 70 ? 
                `linear-gradient(90deg, ${themeColors.supporting.text}, ${themeColors.supporting.text}cc)` : 
                supportingPercentage > 50 ?
                'linear-gradient(90deg, #d97706, #c2410c)' :
                `linear-gradient(90deg, ${themeColors.opposing.text}, ${themeColors.opposing.text}cc)`
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}