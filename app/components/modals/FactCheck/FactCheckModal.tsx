'use client';

import { memo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ResearchResult } from '@/app/types/article';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { LLMResearchResponse, type ExpertPerspective } from '@/app/types/research';
import ResearchResultsOverview from '@/app/sections/upload/ResearchResultsOverview';
import { ResourceAnalysisCard } from '@/app/sections/upload/ResourceAnalysisCard';
import { ExpertPanel } from '@/app/sections/upload/ExpertPanel';
import FactCheckHero from './FactCheckHero';

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
  let totalSources = supportingTotal + contradictingTotal;

  let expertPerspectives: ExpertPerspective[] = [];
  if (research.expert_perspectives) {
    try {
      if (typeof research.expert_perspectives === 'string') {
        expertPerspectives = JSON.parse(research.expert_perspectives);
      } else if (Array.isArray(research.expert_perspectives)) {
        expertPerspectives = research.expert_perspectives;
      }
    } catch (error) {
      console.error('Failed to parse expert_perspectives:', error);
      expertPerspectives = [];
    }
  }

  return {
    id: research.id,
    status: research.status.toLowerCase() as any,
    verdict: research.verdict,
    correction: research.correction,
    request_statement: research.statement,
    request_context: research.context,
    request_source: research.source,
    request_datetime: research.request_datetime,
    //@ts-expect-error Ignore
    category: research.category || undefined,
    subcategory: undefined,
    country: research.country || 'unknown',
    //@ts-expect-error Ignore
    valid_sources: totalSources,
    resources_agreed: research.resources_agreed,
    resources_disagreed: research.resources_disagreed,
    experts: research.experts || {},
    profile_id: research.profile_id || research.profileId || null,
    statement_date: research.statement_date || null,
    expert_perspectives: expertPerspectives,
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
  const { cardColors, overlayColors, isDark, mounted } = useLayoutTheme();


  const modalShadow = mounted 
    ? (cardColors.shadow || (isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'))
    : (isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)');

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

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPointerEvents = document.body.style.pointerEvents;
    
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';
      
      // Allow pointer events on modal elements
      const modalElements = document.querySelectorAll('[data-modal="fact-check"]');
      modalElements.forEach((el) => {
        (el as HTMLElement).style.pointerEvents = 'auto';
      });
      
      return () => {
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
            style={{ 
              backgroundColor: overlayColors.backdrop || (isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)')
            }}
          />

          <motion.div 
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${!isDark && 'bg-yellow-50'}
              relative w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl z-10`}
            style={{
              boxShadow: `0 25px 50px -12px ${modalShadow}`,
              backgroundImage: 'none',
              backdropFilter: 'none'
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            <FactCheckHero
              onClose={onClose}
              displayResult={displayResult}
              />
            <div
              className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(95vh-100px)] lg:max-h-[calc(95vh-120px)]"
              style={{
                background: isDark
                  ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, rgba(30, 41, 59, 0.2) 100%)'
                  : 'linear-gradient(180deg, rgba(248, 250, 252, 0.3) 0%, rgba(241, 245, 249, 0.2) 100%)',
                scrollbarWidth: 'thin',
                scrollbarColor: isDark ? '#4a5568 #2d3748' : '#cbd5e0 #e2e8f0'
              }}
              onWheel={(e) => e.stopPropagation()} 
              onTouchMove={(e) => e.stopPropagation()} 
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
                    // @ts-expect-error Ignore
                      supportingAnalysis={displayResult.resources_agreed}
                      // @ts-expect-error Ignore
                      contradictingAnalysis={displayResult.resources_disagreed}
                      isLoading={false}
                    />
                  </motion.div>
                )}

                {/* ✅ UPDATED: Expert Panel Component with new data */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ExpertPanel
                    // @ts-expect-error Ignore - legacy support
                    experts={displayResult.experts}
                    expert_perspectives={displayResult.expert_perspectives}
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

const modalVariants: Variants = {
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
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
      ease: [0.55, 0.055, 0.675, 0.19]
    }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};