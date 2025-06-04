'use client';

import { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsArticle, ResourceReference } from '@/app/types/article';
import { X, ExternalLink, Globe, Building, GraduationCap, Heart } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';

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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'mainstream': return Globe;
    case 'governance': return Building;
    case 'academic': return GraduationCap;
    case 'medical': return Heart;
    default: return Globe;
  }
};

export const FactCheckModal = memo(function FactCheckModal({
  isOpen,
  onClose,
  article
}: FactCheckModalProps) {
  const { colors, cardColors, overlayColors, mounted, isDark } = useLayoutTheme();

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

  // Theme-aware status colors
  const getStatusColor = (status: string) => {
    const baseColors = {
      TRUE: isDark ? '#22c55e' : '#16a34a',
      FALSE: isDark ? '#ef4444' : '#dc2626',
      MISLEADING: isDark ? '#f59e0b' : '#d97706',
      PARTIALLY_TRUE: isDark ? '#3b82f6' : '#2563eb',
      UNVERIFIABLE: isDark ? '#8b5cf6' : '#7c3aed'
    };

    const backgrounds = {
      TRUE: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 252, 231, 0.8)',
      FALSE: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.8)',
      MISLEADING: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(254, 243, 199, 0.8)',
      PARTIALLY_TRUE: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(219, 234, 254, 0.8)',
      UNVERIFIABLE: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(237, 233, 254, 0.8)'
    };

    const borders = {
      TRUE: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)',
      FALSE: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
      MISLEADING: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.2)',
      PARTIALLY_TRUE: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
      UNVERIFIABLE: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'
    };

    return {
      color: baseColors[status as keyof typeof baseColors] || baseColors.UNVERIFIABLE,
      background: backgrounds[status as keyof typeof backgrounds] || backgrounds.UNVERIFIABLE,
      border: borders[status as keyof typeof borders] || borders.UNVERIFIABLE
    };
  };

  const getCredibilityColor = (credibility: string) => {
    const colors = {
      high: isDark ? { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' } : { color: '#16a34a', bg: 'rgba(34, 197, 94, 0.1)' },
      medium: isDark ? { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' } : { color: '#d97706', bg: 'rgba(245, 158, 11, 0.1)' },
      low: isDark ? { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' } : { color: '#dc2626', bg: 'rgba(239, 68, 68, 0.1)' }
    };
    return colors[credibility as keyof typeof colors] || colors.medium;
  };

  const ResourceList = ({ resources, title }: { 
    resources?: ResourceReference[], 
    title: string 
  }) => {
    if (!resources || resources.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 
          className="font-semibold"
          style={{ color: colors.foreground }}
        >
          {title}
        </h4>
        <div className="space-y-2">
          {resources.map((resource, index) => {
            const IconComponent = getCategoryIcon(resource.category);
            const credibilityColors = getCredibilityColor(resource.credibility);
            
            return (
              <motion.div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: colors.muted,
                  border: `1px solid ${colors.border}`
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ 
                  scale: 1.01,
                  boxShadow: `0 4px 12px ${cardColors.shadow}`
                }}
              >
                <IconComponent 
                  className="w-4 h-4 mt-0.5" 
                  style={{ color: colors.mutedForeground }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium flex items-center space-x-1 transition-colors duration-200 hover:underline"
                      style={{ color: colors.primary }}
                    >
                      <span className="truncate">{resource.title}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span 
                      className="text-xs uppercase"
                      style={{ color: colors.mutedForeground }}
                    >
                      {resource.category}
                    </span>
                    <span 
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: colors.border }}
                    />
                    <span 
                      className="text-xs uppercase"
                      style={{ color: colors.mutedForeground }}
                    >
                      {resource.country}
                    </span>
                    <span 
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: colors.border }}
                    />
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        color: credibilityColors.color,
                        backgroundColor: credibilityColors.bg
                      }}
                    >
                      {resource.credibility}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!mounted) {
    return null;
  }

  const statusColors = getStatusColor(article.factCheck.evaluation);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-scroll"
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
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: overlayColors.backdrop }}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl"
            style={{
              backgroundColor: cardColors.background,
              border: `1px solid ${cardColors.border}`,
              boxShadow: `0 25px 50px -12px ${cardColors.shadow}`
            }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: cardColors.border }}
            >
              <div className="flex items-center space-x-3">
                <h2 
                  className="text-xl font-bold"
                  style={{ color: cardColors.foreground }}
                >
                  Fact Check Details
                </h2>
                <motion.div 
                  className="px-3 py-1 rounded-full text-sm font-semibold border"
                  style={{
                    color: statusColors.color,
                    backgroundColor: statusColors.background,
                    borderColor: statusColors.border
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {article.factCheck.evaluation}
                </motion.div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  color: colors.mutedForeground,
                  backgroundColor: 'transparent'
                }}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: colors.muted,
                  color: colors.foreground
                }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="p-6 space-y-6">
                
                {/* Statement */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 
                    className="font-semibold mb-2"
                    style={{ color: colors.foreground }}
                  >
                    Statement
                  </h3>
                  <blockquote 
                    className="text-lg leading-relaxed p-4 rounded-lg border-l-4"
                    style={{
                      color: cardColors.foreground,
                      backgroundColor: colors.muted,
                      borderLeftColor: colors.primary
                    }}
                  >
                    "{article.headline}"
                  </blockquote>
                </motion.div>

                {/* Source and Date */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div>
                    <h4 
                      className="font-semibold mb-1"
                      style={{ color: colors.foreground }}
                    >
                      Source
                    </h4>
                    <p style={{ color: colors.mutedForeground }}>
                      {article.source.name}
                    </p>
                  </div>
                  <div>
                    <h4 
                      className="font-semibold mb-1"
                      style={{ color: colors.foreground }}
                    >
                      Date
                    </h4>
                    <p style={{ color: colors.mutedForeground }}>
                      {formatSafeDate(article.publishedAt)}
                    </p>
                  </div>
                </motion.div>

                {/* Verdict */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 
                    className="font-semibold mb-2"
                    style={{ color: colors.foreground }}
                  >
                    Verdict
                  </h3>
                  <p style={{ color: cardColors.foreground }}>
                    {article.factCheck.verdict}
                  </p>
                  {article.factCheck.evaluation === 'FALSE' && (
                    <motion.div 
                      className="mt-3 p-3 rounded-lg border"
                      style={{
                        backgroundColor: statusColors.background,
                        borderColor: statusColors.border
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p 
                        className="font-medium"
                        style={{ color: statusColors.color }}
                      >
                        This statement has been fact-checked and found to be false.
                      </p>
                    </motion.div>
                  )}
                </motion.div>

                {/* Expert Opinions */}
                {article.factCheck.experts && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 
                      className="font-semibold mb-4"
                      style={{ color: colors.foreground }}
                    >
                      Expert Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {article.factCheck.experts.critic && (
                        <motion.div 
                          className="p-4 rounded-lg"
                          style={{ backgroundColor: colors.muted }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h4 
                            className="font-medium mb-2"
                            style={{ color: isDark ? '#ef4444' : '#dc2626' }}
                          >
                            🔍 Critical Analysis
                          </h4>
                          <p 
                            className="text-sm"
                            style={{ color: colors.foreground }}
                          >
                            {article.factCheck.experts.critic}
                          </p>
                        </motion.div>
                      )}
                      {article.factCheck.experts.nerd && (
                        <motion.div 
                          className="p-4 rounded-lg"
                          style={{ backgroundColor: colors.muted }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h4 
                            className="font-medium mb-2"
                            style={{ color: isDark ? '#3b82f6' : '#2563eb' }}
                          >
                            📊 Statistical Context
                          </h4>
                          <p 
                            className="text-sm"
                            style={{ color: colors.foreground }}
                          >
                            {article.factCheck.experts.nerd}
                          </p>
                        </motion.div>
                      )}
                      {article.factCheck.experts.devil && (
                        <motion.div 
                          className="p-4 rounded-lg"
                          style={{ backgroundColor: colors.muted }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h4 
                            className="font-medium mb-2"
                            style={{ color: isDark ? '#8b5cf6' : '#7c3aed' }}
                          >
                            😈 Devil's Advocate
                          </h4>
                          <p 
                            className="text-sm"
                            style={{ color: colors.foreground }}
                          >
                            {article.factCheck.experts.devil}
                          </p>
                        </motion.div>
                      )}
                      {article.factCheck.experts.psychic && (
                        <motion.div 
                          className="p-4 rounded-lg"
                          style={{ backgroundColor: colors.muted }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h4 
                            className="font-medium mb-2"
                            style={{ color: isDark ? '#f59e0b' : '#d97706' }}
                          >
                            🧠 Psychological Analysis
                          </h4>
                          <p 
                            className="text-sm"
                            style={{ color: colors.foreground }}
                          >
                            {article.factCheck.experts.psychic}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Resource Analysis */}
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ResourceList 
                    resources={article.factCheck.resources_agreed?.references}
                    title={`Supporting Sources (${article.factCheck.resources_agreed?.total || '0%'})`}
                  />
                  <ResourceList 
                    resources={article.factCheck.resources_disagreed?.references}
                    title={`Contradicting Sources (${article.factCheck.resources_disagreed?.total || '0%'})`}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});