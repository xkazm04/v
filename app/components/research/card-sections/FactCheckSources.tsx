"use client";

import { motion } from "framer-motion";
import { Globe, BookOpen, Building, Heart, ExternalLink } from "lucide-react";
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

// Mock resource URLs for demonstration
const getMockResources = (category: string) => [
  {
    url: "https://climate.nasa.gov/evidence/",
    title: "NASA Climate Change Evidence",
    category: "governance" as const,
    credibility: "high" as const
  },
  {
    url: "https://www.nature.com/articles/climate-study",
    title: "Nature Climate Research",
    category: "academic" as const,
    credibility: "high" as const
  },
  {
    url: "https://www.reuters.com/climate-report",
    title: "Reuters Climate Analysis",
    category: "mainstream" as const,
    credibility: "high" as const
  }
];

export function FactCheckSources({ factCheck, config }: FactCheckSourcesProps) {
  if (!factCheck.resources_agreed) return null;

  const sources = [
    { label: "Mainstream", count: factCheck.resources_agreed.mainstream, icon: Globe },
    { label: "Academic", count: factCheck.resources_agreed.academic, icon: BookOpen },
    { label: "Government", count: factCheck.resources_agreed.governance, icon: Building },
    { label: "Medical", count: factCheck.resources_agreed.medical, icon: Heart }
  ];

  const mockResources = getMockResources(factCheck.category || "");

  return (
    <motion.div variants={sectionVariants} className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-3">
        <h4 className="text-sm font-semibold text-slate-300">Source Analysis</h4>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-slate-400">Supporting Sources</span>
          <span 
            className="text-sm font-bold"
            style={{ color: config.color }}
          >
            {factCheck.resources_agreed.total}
          </span>
        </div>
      </div>
      
      {/* Sources in a single row */}
      <div className="flex-shrink-0 mb-3">
        <div className="flex gap-2 overflow-x-auto">
          {sources.map((source, index) => (
            <motion.div
              key={source.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 min-w-0 flex-shrink-0"
              style={{ minWidth: '80px' }}
            >
              <source.icon className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <div className="text-center">
                <div className="text-xs text-slate-300 truncate">{source.label}</div>
                <div className="text-lg font-bold text-slate-200">
                  {source.count}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Resource URLs */}
      <div className="flex-1 overflow-y-auto">
        <h5 className="text-xs font-semibold text-slate-400 mb-2">Reference Sources</h5>
        <div className="space-y-2">
          {mockResources.map((resource, index) => (
            <motion.a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 + index * 0.2 }}
              className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 transition-colors group cursor-pointer"
            >
              <ExternalLink className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-300 group-hover:text-white transition-colors line-clamp-1">
                  {resource.title}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: resource.category === 'governance' ? 'rgba(59, 130, 246, 0.2)' :
                                resource.category === 'academic' ? 'rgba(16, 185, 129, 0.2)' :
                                'rgba(245, 158, 11, 0.2)',
                      color: resource.category === 'governance' ? '#3b82f6' :
                             resource.category === 'academic' ? '#10b981' :
                             '#f59e0b'
                    }}
                  >
                    {resource.category}
                  </span>
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: resource.credibility === 'high' ? '#22c55e' : '#f59e0b'
                    }}
                  />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}