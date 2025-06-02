'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  ExternalLink, 
  Calendar, 
  User, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle2,
  Search
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ExpertPanel } from './ExpertPanel';
import { ResourceAnalysisCard } from './ResourceAnalysisCard';
import type { ResearchResponse } from './types';
import { PLACEHOLDER_RESULT } from '@/app/constants/research_placeholder';
import { getCategoryColor, getCategoryIcon, getCountryName } from '@/app/helpers/researchResultHelpers';

interface ResearchResultsProps {
  result: ResearchResponse | null;
  isLoading: boolean;
}


export function ResearchResults({ result, isLoading }: ResearchResultsProps) {
  // Show placeholder message when no research has been initiated
  if (!result && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-neutral-500"
      >
        <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">Submit a statement above to see fact-check results</p>
      </motion.div>
    );
  }

  // Use actual result or placeholder data when loading
  const displayResult = result || PLACEHOLDER_RESULT;
  const CategoryIcon = getCategoryIcon(displayResult.category);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Result Card */}
      <div className={`border shadow-lg bg-secondary rounded-xl border-gray-400/50 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl flex-1">
              {isLoading ? 'Processing Fact-Check...' : 'Fact-Check Results'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <StatusBadge status={displayResult.status} />
              {displayResult.is_duplicate && (
                <Badge variant="outline" className="text-xs">
                  Cached Result
                </Badge>
              )}
            </div>
          </div>
          
          {/* Request Metadata with Enhanced Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {/* Primary metadata row */}
            <div className="flex flex-wrap gap-4 text-sm text-neutral-300">
              {displayResult.request.source && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className={isLoading ? 'animate-pulse' : ''}>
                    {displayResult.request.source}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(displayResult.request.datetime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span className={isLoading ? 'animate-pulse' : ''}>
                  {displayResult.valid_sources}
                </span>
              </div>
            </div>

            {/* Enhanced metadata row */}
            <div className="flex flex-wrap gap-3">
              {displayResult.country && (
                <Badge variant="outline" className="text-xs">
                  {getCountryName(displayResult.country)}
                </Badge>
              )}
              {displayResult.category && (
                <Badge className={`text-xs ${getCategoryColor(displayResult.category)}`}>
                  <CategoryIcon className="h-3 w-3 mr-1" />
                  {displayResult.category.charAt(0).toUpperCase() + displayResult.category.slice(1)}
                </Badge>
              )}
              {displayResult.research_method && !isLoading && (
                <Badge variant="outline" className="text-xs">
                  <Search className="h-3 w-3 mr-1" />
                  {displayResult.research_method}
                </Badge>
              )}
            </div>
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Original Statement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-neutral-50 p-4 rounded-lg border-l-4 border-neutral-300"
          >
            <p className="font-medium text-sm text-neutral-600 mb-1">Original Statement:</p>
            <p className={`text-neutral-800 italic ${isLoading ? 'animate-pulse' : ''}`}>
              "{displayResult.request.statement}"
            </p>
            {displayResult.request.context && (
              <p className={`text-sm text-neutral-600 mt-2 ${isLoading ? 'animate-pulse' : ''}`}>
                <strong>Context:</strong> {displayResult.request.context}
              </p>
            )}
          </motion.div>

          {/* Verdict */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <h4 className="font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Verdict
            </h4>
            <p className={`text-lg leading-relaxed ${isLoading ? 'animate-pulse' : ''}`}>
              {displayResult.verdict}
            </p>
          </motion.div>

          {/* Correction if available */}
          {displayResult.correction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400"
            >
              <p className="font-medium text-sm text-blue-800 mb-1">Corrected Statement:</p>
              <p className={`text-blue-900 ${isLoading ? 'animate-pulse' : ''}`}>
                {displayResult.correction}
              </p>
            </motion.div>
          )}

          {/* Enhanced Resource Analysis */}
          {(displayResult.resources_agreed || displayResult.resources_disagreed) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <h4 className="font-semibold">Source Analysis</h4>
              <div className="grid gap-4 md:grid-cols-2">
                {displayResult.resources_agreed && (
                  <ResourceAnalysisCard
                    title="Supporting Sources"
                    resourceAnalysis={displayResult.resources_agreed}
                    type="supporting"
                    isLoading={isLoading}
                  />
                )}
                {displayResult.resources_disagreed && (
                  <ResourceAnalysisCard
                    title="Contradicting Sources"
                    resourceAnalysis={displayResult.resources_disagreed}
                    type="contradicting"
                    isLoading={isLoading}
                  />
                )}
              </div>
            </motion.div>
          )}

          {/* Legacy Resources (if new structure not available) */}
          {(!displayResult.resources_agreed && !displayResult.resources_disagreed && displayResult.resources) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <h4 className="font-semibold">Verification Sources</h4>
              <div className="grid gap-2">
                {displayResult.resources.map((resource, index) => (
                  <motion.div
                    key={`${resource}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className={`w-full justify-start h-auto p-3 text-left ${isLoading ? 'opacity-60 cursor-not-allowed animate-pulse' : ''}`}
                      onClick={isLoading ? undefined : () => {
                        if (resource.startsWith('http')) {
                          window.open(resource, '_blank');
                        }
                      }}
                      disabled={isLoading}
                    >
                      <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{resource}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </div>

      {/* Expert Opinions */}
      <div className={isLoading ? 'opacity-60 pointer-events-none' : ''}>
        <ExpertPanel experts={displayResult.experts} isLoading={isLoading} />
      </div>
      
      {/* Loading Overlay Indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
            <span className="text-sm font-medium">Analyzing statement...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}