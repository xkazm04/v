'use client';

import { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsArticle, ResourceReference } from '@/app/types/article';
import { X, ExternalLink, Globe, Building, GraduationCap, Heart } from 'lucide-react';

interface FactCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: NewsArticle;
}

// Safe date formatting function
const formatSafeDate = (dateString: string): string => {
  if (!dateString) return 'No date';
  
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleDateString();
  } catch (error) {
    return 'Invalid date';
  }
};

const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'TRUE': return 'text-green-600 bg-green-50 border-green-200';
    case 'FALSE': return 'text-red-600 bg-red-50 border-red-200';
    case 'MISLEADING': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'PARTIALLY_TRUE': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'UNVERIFIABLE': return 'text-gray-600 bg-gray-50 border-gray-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'mainstream': return Globe;
    case 'governance': return Building;
    case 'academic': return GraduationCap;
    case 'medical': return Heart;
    default: return Globe;
  }
};

const getCredibilityColor = (credibility: string) => {
  switch (credibility) {
    case 'high': return 'text-green-600 bg-green-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const FactCheckModal = memo(function FactCheckModal({
  isOpen,
  onClose,
  article
}: FactCheckModalProps) {
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const ResourceList = ({ resources, title }: { 
    resources?: ResourceReference[], 
    title: string 
  }) => {
    if (!resources || resources.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-700 dark:text-slate-300">{title}</h4>
        <div className="space-y-2">
          {resources.map((resource, index) => {
            const IconComponent = getCategoryIcon(resource.category);
            return (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <IconComponent className="w-4 h-4 mt-0.5 text-slate-500" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <span className="truncate">{resource.title}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 uppercase">
                      {resource.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-xs text-slate-500 uppercase">
                      {resource.country}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className={`
                      text-xs px-2 py-0.5 rounded-full font-medium
                      ${getCredibilityColor(resource.credibility)}
                    `}>
                      {resource.credibility}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleBackdropClick}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
              relative w-full max-w-4xl max-h-[90vh] overflow-hidden
              bg-white dark:bg-slate-900 rounded-xl shadow-2xl
              border border-slate-200 dark:border-slate-700
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Fact Check Details
                </h2>
                <div className={`
                  px-3 py-1 rounded-full text-sm font-semibold border
                  ${getStatusColor(article.factCheck.evaluation)}
                `}>
                  {article.factCheck.evaluation}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="p-6 space-y-6">
                
                {/* Statement */}
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Statement
                  </h3>
                  <blockquote className="text-lg text-slate-900 dark:text-slate-100 leading-relaxed p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
                    "{article.headline}"
                  </blockquote>
                </div>

                {/* Source and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Source</h4>
                    <p className="text-slate-600 dark:text-slate-400">{article.source.name}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      {formatSafeDate(article.publishedAt)}
                    </p>
                  </div>
                </div>

                {/* Verdict */}
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Verdict
                  </h3>
                  <p className="text-slate-900 dark:text-slate-100">
                    {article.factCheck.verdict}
                  </p>
                  {article.factCheck.evaluation === 'FALSE' && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-red-800 dark:text-red-200 font-medium">
                        This statement has been fact-checked and found to be false.
                      </p>
                    </div>
                  )}
                </div>

                {/* Expert Opinions */}
                {article.factCheck.experts && (
                  <div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">
                      Expert Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {article.factCheck.experts.critic && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">
                            🔍 Critical Analysis
                          </h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {article.factCheck.experts.critic}
                          </p>
                        </div>
                      )}
                      {article.factCheck.experts.nerd && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">
                            📊 Statistical Context
                          </h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {article.factCheck.experts.nerd}
                          </p>
                        </div>
                      )}
                      {article.factCheck.experts.devil && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <h4 className="font-medium text-purple-600 dark:text-purple-400 mb-2">
                            😈 Devil's Advocate
                          </h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {article.factCheck.experts.devil}
                          </p>
                        </div>
                      )}
                      {article.factCheck.experts.psychic && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <h4 className="font-medium text-orange-600 dark:text-orange-400 mb-2">
                            🧠 Psychological Analysis
                          </h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {article.factCheck.experts.psychic}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Resource Analysis */}
                <div className="space-y-6">
                  <ResourceList 
                    resources={article.factCheck.resources_agreed?.references}
                    title={`Supporting Sources (${article.factCheck.resources_agreed?.total || '0%'})`}
                  />
                  <ResourceList 
                    resources={article.factCheck.resources_disagreed?.references}
                    title={`Contradicting Sources (${article.factCheck.resources_disagreed?.total || '0%'})`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});