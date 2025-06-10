'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, FileText, Video, Clock, ExternalLink } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/lib/utils';
import { NewsArticle } from '@/app/types/article';

interface SearchResultsProps {
  isOpen: boolean;
  query: string;
  debouncedQuery: string;
  newsResults: NewsArticle[];
  videoResults: any[];
  isLoading: boolean;
  hasResults: boolean;
  onResultClick: (result: any, type: 'news' | 'video') => void;
  minQueryLength?: number; // Added for dynamic messaging
  className?: string;
}

const resultVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 0.8
    }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  })
};

export function SearchResults({
  isOpen,
  query,
  debouncedQuery,
  newsResults,
  videoResults,
  isLoading,
  hasResults,
  onResultClick,
  minQueryLength = 2,
  className
}: SearchResultsProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const getReliabilityColor = (score?: number) => {
    if (!score) return 'bg-slate-100 text-slate-600';
    if (score >= 0.8) return 'bg-green-100 text-green-700';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getReliabilityLabel = (score?: number) => {
    if (!score) return 'Unverified';
    if (score >= 0.8) return 'High';
    if (score >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <AnimatePresence>
      {isOpen && query.length > 0 && (
        <motion.div
          variants={resultVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            'absolute top-full left-0 right-0 mt-2 z-50',
            className
          )}
        >
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
            {/* Header with search query */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isLoading ? 'Searching...' : `Results for "${debouncedQuery}"`}
                </span>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {/* Loading State */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-12"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                      <div className="absolute inset-0 h-8 w-8 border-2 border-blue-200 dark:border-blue-800 rounded-full animate-pulse" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Searching through articles and videos...
                    </p>
                  </div>
                </motion.div>
              )}

              {/* No Results */}
              {!isLoading && !hasResults && debouncedQuery.length >= minQueryLength && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        No results found
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Try adjusting your search terms
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Results */}
              {!isLoading && hasResults && (
                <div className="p-4 space-y-6">
                  {/* News Results */}
                  {newsResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          News Articles ({newsResults.length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {newsResults.slice(0, 5).map((item, index) => (
                          <motion.div
                            key={item.id}
                            custom={index}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="group p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                            onClick={() => onResultClick(item, 'news')}
                          >
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Video Results */}
                  {videoResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: newsResults.length > 0 ? 0.2 : 0.1 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Video className="h-4 w-4 text-red-500" />
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Videos ({videoResults.length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {videoResults.slice(0, 5).map((item, index) => (
                          <motion.div
                            key={item.id || `video-${index}`}
                            custom={index + newsResults.length}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="group p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                            onClick={() => onResultClick(item, 'video')}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                  {truncateText(item.title || item.statement || 'Untitled')}
                                </h5>
                                
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  {item.speaker_name && (
                                    <Badge 
                                      variant="outline" 
                                      className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600"
                                    >
                                      {item.speaker_name}
                                    </Badge>
                                  )}
                                  
                                  {item.source && (
                                    <Badge 
                                      variant="secondary" 
                                      className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                    >
                                      {item.source}
                                    </Badge>
                                  )}
                                  
                                  {item.publishedAt && (
                                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                      <Clock className="h-3 w-3" />
                                      <span>{formatTimeAgo(item.publishedAt)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex-shrink-0">
                                <Video className="h-4 w-4 text-slate-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Show more results hint */}
                  {(newsResults.length > 5 || videoResults.length > 5) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-center py-2 border-t border-slate-200 dark:border-slate-700"
                    >
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Showing first {Math.min(5, newsResults.length + videoResults.length)} results
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}