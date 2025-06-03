"use client";

import { motion } from "framer-motion";
import { Globe, BookOpen, Building, Heart, ExternalLink, ThumbsUp, ThumbsDown, TrendingUp, TrendingDown } from "lucide-react";
import { LLMResearchResponse } from "@/app/types/research";

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

// Mock resources generator (same as before)
const generateMockResources = (isSupporting: boolean, count: number) => {
  const supportingResources = [
    { title: "NASA Climate Evidence", url: "https://climate.nasa.gov", category: "governance", credibility: "high" },
    { title: "Nature Climate Study", url: "https://nature.com/climate", category: "academic", credibility: "high" },
    { title: "Reuters Analysis", url: "https://reuters.com/climate", category: "mainstream", credibility: "high" },
    { title: "WHO Health Report", url: "https://who.int/report", category: "medical", credibility: "high" },
    { title: "MIT Research Paper", url: "https://mit.edu/research", category: "academic", credibility: "high" }
  ];

  const opposingResources = [
    { title: "Climate Skeptic Blog", url: "https://skeptic-blog.com", category: "other", credibility: "low" },
    { title: "Industry Report", url: "https://industry-report.com", category: "other", credibility: "medium" },
    { title: "Alternative Analysis", url: "https://alt-science.com", category: "other", credibility: "low" }
  ];

  return (isSupporting ? supportingResources : opposingResources).slice(0, count);
};

export function FactCheckSources({ factCheck, config }: FactCheckSourcesProps) {
  if (!factCheck.resources_agreed && !factCheck.resources_disagreed) return null;

  const supportingCount = factCheck.resources_agreed?.count || 0;
  const opposingCount = factCheck.resources_disagreed?.count || 0;
  const totalCount = supportingCount + opposingCount;
  
  const supportingPercentage = totalCount > 0 ? (supportingCount / totalCount * 100) : 0;
  const opposingPercentage = totalCount > 0 ? (opposingCount / totalCount * 100) : 0;

  const supportingResources = generateMockResources(true, Math.min(3, supportingCount));
  const opposingResources = generateMockResources(false, Math.min(3, opposingCount));

  return (
    <motion.div variants={sectionVariants} className="h-full flex flex-col">
      {/* Header with Overall Stats */}
      <div className="flex-shrink-0 mb-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Source Analysis</h4>
        
        {/* Support vs Opposition Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Supporting Sources */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="relative p-3 rounded-lg 
                     bg-gradient-to-br from-green-50/90 to-emerald-100/50 dark:from-green-500/10 dark:to-emerald-600/5 
                     border border-green-200/60 dark:border-green-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">Supporting</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-green-700 dark:text-green-400">{supportingCount}</span>
              <span className="text-xs text-green-600 dark:text-green-300">sources</span>
            </div>
            <div className="text-xs text-green-700 dark:text-green-400 font-medium">
              {supportingPercentage.toFixed(0)}%
            </div>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-200/40 dark:bg-green-500/20 rounded-b-lg">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: supportingPercentage / 100 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="h-full bg-green-600 dark:bg-green-500 rounded-b-lg origin-left"
              />
            </div>
          </motion.div>

          {/* Opposing Sources */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3 }}
            className="relative p-3 rounded-lg 
                     bg-gradient-to-br from-red-50/90 to-rose-100/50 dark:from-red-500/10 dark:to-rose-600/5 
                     border border-red-200/60 dark:border-red-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <ThumbsDown className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-xs font-medium text-red-700 dark:text-red-300">Opposing</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-red-700 dark:text-red-400">{opposingCount}</span>
              <span className="text-xs text-red-600 dark:text-red-300">sources</span>
            </div>
            <div className="text-xs text-red-700 dark:text-red-400 font-medium">
              {opposingPercentage.toFixed(0)}%
            </div>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-200/40 dark:bg-red-500/20 rounded-b-lg">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: opposingPercentage / 100 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="h-full bg-red-600 dark:bg-red-500 rounded-b-lg origin-left"
              />
            </div>
          </motion.div>
        </div>

        {/* Source Type Breakdown */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Media", count: (factCheck.resources_agreed?.mainstream || 0) + (factCheck.resources_disagreed?.mainstream || 0), icon: Globe },
            { label: "Academic", count: (factCheck.resources_agreed?.academic || 0) + (factCheck.resources_disagreed?.academic || 0), icon: BookOpen },
            { label: "Gov", count: (factCheck.resources_agreed?.governance || 0) + (factCheck.resources_disagreed?.governance || 0), icon: Building },
            { label: "Medical", count: (factCheck.resources_agreed?.medical || 0) + (factCheck.resources_disagreed?.medical || 0), icon: Heart }
          ].map((source, index) => (
            <motion.div
              key={source.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6 + index * 0.1 }}
              className="flex flex-col items-center p-2 rounded-lg 
                       bg-white/80 dark:bg-slate-800/30 
                       border border-slate-200/60 dark:border-slate-700/50"
            >
              <source.icon className="w-3 h-3 text-slate-500 dark:text-slate-400 mb-1" />
              <div className="text-xs text-slate-600 dark:text-slate-300 mb-1">{source.label}</div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-200">{source.count}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Two Column Source Lists */}
      <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
        {/* Supporting Sources */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
            <h5 className="text-xs font-semibold text-green-700 dark:text-green-300">Supporting Evidence</h5>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-32">
            {supportingResources.map((resource, index) => (
              <motion.a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 + index * 0.2 }}
                className="group flex items-start gap-2 p-2 rounded-lg 
                         bg-green-50/60 hover:bg-green-100/80 dark:bg-green-500/5 dark:hover:bg-green-500/10 
                         border border-green-200/40 hover:border-green-300/60 dark:border-green-500/20 dark:hover:border-green-500/40 
                         transition-all cursor-pointer"
              >
                <ExternalLink className="w-3 h-3 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-green-800 dark:text-green-200 group-hover:text-green-900 dark:group-hover:text-green-100 transition-colors line-clamp-2 leading-tight">
                    {resource.title}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-green-200/60 dark:bg-green-500/20 text-green-800 dark:text-green-300">
                      {resource.category}
                    </span>
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: resource.credibility === 'high' ? '#22c55e' : 
                                       resource.credibility === 'medium' ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Opposing Sources */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
            <h5 className="text-xs font-semibold text-red-700 dark:text-red-300">Opposing Views</h5>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-32">
            {opposingResources.map((resource, index) => (
              <motion.a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.2 + index * 0.2 }}
                className="group flex items-start gap-2 p-2 rounded-lg 
                         bg-red-50/60 hover:bg-red-100/80 dark:bg-red-500/5 dark:hover:bg-red-500/10 
                         border border-red-200/40 hover:border-red-300/60 dark:border-red-500/20 dark:hover:border-red-500/40 
                         transition-all cursor-pointer"
              >
                <ExternalLink className="w-3 h-3 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-red-800 dark:text-red-200 group-hover:text-red-900 dark:group-hover:text-red-100 transition-colors line-clamp-2 leading-tight">
                    {resource.title}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-red-200/60 dark:bg-red-500/20 text-red-800 dark:text-red-300">
                      {resource.category}
                    </span>
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: resource.credibility === 'high' ? '#22c55e' : 
                                       resource.credibility === 'medium' ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Overall Consensus Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8 }}
        className="flex-shrink-0 mt-3 p-2 rounded-lg 
                 bg-white/80 dark:bg-slate-800/30 
                 border border-slate-200/60 dark:border-slate-700/50"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400">Scientific Consensus</span>
          <span 
            className="font-bold"
            style={{ 
              color: supportingPercentage > 70 ? '#16a34a' : 
                     supportingPercentage > 50 ? '#d97706' : '#dc2626'
            }}
          >
            {supportingPercentage.toFixed(0)}% Agreement
          </span>
        </div>
        <div className="mt-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: supportingPercentage / 100 }}
            transition={{ delay: 3, duration: 1 }}
            className="h-full origin-left rounded-full"
            style={{
              background: supportingPercentage > 70 ? 
                'linear-gradient(90deg, #16a34a, #15803d)' : 
                supportingPercentage > 50 ?
                'linear-gradient(90deg, #d97706, #c2410c)' :
                'linear-gradient(90deg, #dc2626, #b91c1c)'
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}