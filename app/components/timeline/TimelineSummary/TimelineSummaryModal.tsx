'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { Timeline } from '@/app/types/timeline';
import { Share2 } from 'lucide-react';
import { TwitterShareButton } from '@/app/components/ui/Buttons/TwitterShareButton';
import TimelineSummaryStatements from './TimelineSummaryStatements';
import TimelineSummaryConsequences from './TimelineSummaryConsequences';
import TimelineSummaryHeader from './TimelineSummaryHeader';
import { contentVariants } from '../../animations/variants/placeholderVariants';

interface TimelineSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: Timeline;
}

export default function TimelineSummaryModal({
  isOpen,
  onClose,
  timeline
}: TimelineSummaryModalProps) {
  const { colors, isDark, vintage } = useLayoutTheme();
  const { isMobile, isDesktop } = useViewport();
  const [isLoadingStatements, setIsLoadingStatements] = useState(true);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const shareText = `Timeline Analysis: ${timeline.title} (${timeline.timeSpan}) - Comprehensive historical breakdown with expert insights.`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 backdrop-blur-sm"
            style={{
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className={`relative w-full max-w-7xl max-h-[90vh] overflow-hidden rounded-2xl border ${
              isMobile ? 'mx-2' : 'mx-4'
            }`}
            style={{
              backgroundColor: isDark ? vintage.paper : vintage.paper,
              borderColor: isDark ? colors.border : vintage.sepia,
              boxShadow: `0 25px 50px -12px ${colors.primary}20`
            }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <TimelineSummaryHeader
                timeline={timeline}
                onClose={onClose}
                />
            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <div className={`flex h-full ${isMobile ? 'flex-col' : 'flex-row'}`}>
                {/* Main Content - Consequences */}
                <motion.div
                  className={`flex-1 overflow-y-auto ${isMobile ? 'order-2' : ''}`}
                  variants={contentVariants}
                >
                  <div className="p-6">
                    <TimelineSummaryConsequences timeline={timeline} />
                  </div>
                </motion.div>

                {/* Sidebar - Key Statements (now wider) */}
                <motion.div
                  className={`${
                    isMobile ? 'order-1' : isDesktop ? 'w-[480px]' : 'w-80'
                  } border-l overflow-y-auto`}
                  style={{ borderColor: isDark ? colors.border : vintage.crease }}
                  variants={contentVariants}
                >
                  <div className="p-6">
                    <TimelineSummaryStatements
                      timeline={timeline}
                      isLoading={isLoadingStatements}
                      onLoadingChange={setIsLoadingStatements}
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <motion.div
              className="p-6 border-t flex items-center justify-between"
              style={{ borderColor: isDark ? colors.border : vintage.crease }}
              variants={contentVariants}
            >
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <span
                  className="text-sm opacity-70"
                  style={{ color: isDark ? colors.mutedForeground : vintage.faded }}
                >
                  Share this timeline analysis
                </span>
              </motion.div>

              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <TwitterShareButton
                    url={shareUrl}
                    text={shareText}
                    hashtags={['Timeline', 'History', 'Analysis']}
                  >
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
                      style={{
                        backgroundColor: colors.muted,
                        borderColor: colors.border,
                        color: colors.foreground
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Share</span>
                    </div>
                  </TwitterShareButton>
                </motion.div>

                <motion.button
                  className="px-6 py-2 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: colors.primary,
                    color: 'white'
                  }}
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}