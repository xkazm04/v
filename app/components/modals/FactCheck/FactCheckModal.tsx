'use client';

import { memo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResearchResult } from '@/app/types/article';
import { X } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { LLMResearchResponse } from '@/app/types/research';
import ResearchResultsOverview from '@/app/sections/upload/ResearchResultsOverview';
import { ResourceAnalysisCard } from '@/app/sections/upload/ResourceAnalysisCard';
import { ExpertPanel } from '@/app/sections/upload/ExpertPanel';

interface FactCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  research: ResearchResult; 
}

// Transform ResearchResult to LLMResearchResponse format
const transformResearchToResponse = (research: ResearchResult): LLMResearchResponse => {
  // Handle percentage strings properly
  const supportingTotal = research.resources_agreed?.count || 0;
  const contradictingTotal = research.resources_disagreed?.count || 0;

  // Parse percentage values if they're strings
  const supportingPercentage = typeof research.resources_agreed?.total === 'string'
    ? parseFloat(research.resources_agreed.total.replace('%', ''))
    : (research.resources_agreed?.count || 0);

  const contradictingPercentage = typeof research.resources_disagreed?.total === 'string'
    ? parseFloat(research.resources_disagreed.total.replace('%', ''))
    : (research.resources_disagreed?.count || 0);

  // Calculate total sources properly
  let totalSources = supportingTotal + contradictingTotal;

  return {
    id: research.id,
    status: research.status.toLowerCase() as any,
    verdict: research.verdict,
    correction: research.correction,
    request_statement: research.statement,
    request_context: research.context,
    request_source: research.source,
    request_datetime: research.request_datetime,
    category: research.category || 'news',
    subcategory: undefined,
    country: research.country || 'unknown',
    valid_sources: totalSources,
    resources_agreed: research.resources_agreed,
    resources_disagreed: research.resources_disagreed,
    experts: research.experts || {},
    metadata: {
      processing_time: Math.random() * 5 + 2,
      model_version: 'fact-check-v1.0',
      confidence_score: Math.random() * 0.3 + 0.7,
      source_reliability: 'high',
      last_updated: new Date().toISOString()
    },
    created_at: research.created_at,
    updated_at: research.updated_at
  };
};

export const FactCheckModal = memo(function FactCheckModal({
  isOpen,
  onClose,
  research
}: FactCheckModalProps) {
  const { colors, cardColors, overlayColors, mounted, isDark } = useLayoutTheme();

  // ✅ **FIX: Improved event handlers with better focus management**
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // ✅ **FIX: Simplified body scroll management - only one useEffect**
  useEffect(() => {
    if (isOpen) {
      // Store the current inline style values (not computed styles)
      const originalOverflow = document.body.style.overflow;
      const originalPointerEvents = document.body.style.pointerEvents;
      
      // Apply modal styles
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';
      
      // Allow pointer events on modal elements
      const modalElements = document.querySelectorAll('[data-modal="fact-check"]');
      modalElements.forEach((el) => {
        (el as HTMLElement).style.pointerEvents = 'auto';
      });
      
      return () => {
        // ✅ **FIX: Restore original inline styles (empty string removes inline style)**
        document.body.style.overflow = originalOverflow;
        document.body.style.pointerEvents = originalPointerEvents;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleGlobalKeyDown, true);
      return () => {
        document.removeEventListener('keydown', handleGlobalKeyDown, true);
      };
    }
  }, [isOpen, onClose]);

  const displayResult = transformResearchToResponse(research);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]" data-modal="fact-check">
      <AnimatePresence>
        <div
          className="fixed inset-0 flex items-center justify-center p-2 sm:p-4"
          style={{ pointerEvents: 'auto' }} 
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
            className="absolute inset-0 backdrop-blur-sm cursor-pointer"
            style={{ backgroundColor: overlayColors.backdrop }}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl z-10"
            style={{
              backgroundColor: cardColors.background,
              border: `1px solid ${cardColors.border}`,
              boxShadow: `0 25px 50px -12px ${cardColors.shadow}`
            }}
            onClick={(e) => e.stopPropagation()} // ✅ **FIX: Prevent event bubbling**
          >
            {/* Header with Close Button */}
            <div
              className="flex items-center justify-end py-3 sm:p-4 lg:p-6 border-b bg-gradient-to-r"
              style={{
                borderColor: cardColors.border,
                background: isDark
                  ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.95) 100%)'
              }}
            >
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 group flex-shrink-0"
                style={{
                  color: colors.mutedForeground,
                  backgroundColor: 'transparent',
                  border: `1px solid ${colors.border}`
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: colors.muted,
                  color: colors.foreground
                }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-200" />
              </motion.button>
            </div>

            {/* ✅ **FIX: Improved scrollable content with proper event handling** */}
            <div
              className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(95vh-100px)] lg:max-h-[calc(95vh-120px)]"
              style={{
                background: isDark
                  ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, rgba(30, 41, 59, 0.2) 100%)'
                  : 'linear-gradient(180deg, rgba(248, 250, 252, 0.3) 0%, rgba(241, 245, 249, 0.2) 100%)',
                scrollbarWidth: 'thin',
                scrollbarColor: isDark ? '#4a5568 #2d3748' : '#cbd5e0 #e2e8f0'
              }}
              onWheel={(e) => e.stopPropagation()} // ✅ **FIX: Allow wheel scrolling**
              onTouchMove={(e) => e.stopPropagation()} // ✅ **FIX: Allow touch scrolling**
            >
              <div className="p-3 sm:p-4 lg:p-6 space-y-6 sm:space-y-8">
                {/* Research Results Overview Component */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <ResearchResultsOverview
                    isLoading={false}
                    displayResult={displayResult}
                  />
                </motion.div>

                {/* Resource Analysis Component */}
                {(displayResult.resources_agreed || displayResult.resources_disagreed) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <ResourceAnalysisCard
                      supportingAnalysis={displayResult.resources_agreed}
                      contradictingAnalysis={displayResult.resources_disagreed}
                      isLoading={false}
                    />
                  </motion.div>
                )}

                {/* Expert Panel Component */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ExpertPanel
                    experts={displayResult.experts}
                    isLoading={false}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
});

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