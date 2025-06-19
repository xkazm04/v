"use client";

import { motion, Variants } from "framer-motion";
import { X } from "lucide-react";
import { LLMResearchResponse } from "@/app/types/research";
import { FactCheckHeader } from "./card-sections/FactCheckHeader";
import { FactCheckAnalysis } from "./card-sections/FactCheckAnalysis";
import { FactCheckCorrection } from "./card-sections/FactCheckCorrection";
import { FactCheckSources } from "./card-sections/FactCheckSources";
import { FactCheckExperts } from "./card-sections/FactCheckExperts";
import { getStatusConfig } from "./utils/statusConfig";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import StampText from "../ui/Decorative/StampText";

interface FactCheckCardProps {
  factCheck: LLMResearchResponse;
  onDismiss: () => void;
  onExpertToggle: () => void;
  animationPhase: 'notification' | 'card' | 'complete' | 'idle';
}

// Smoother animation variants with proper stagger
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.6, // Reduced for smoother flow
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.2 }
  }
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export function FactCheckCard({ factCheck, onDismiss, onExpertToggle, animationPhase }: FactCheckCardProps) {
  const { colors, isDark } = useLayoutTheme();
  const config = getStatusConfig(factCheck.status);

  // Theme-aware colors
  const themeColors = {
    background: isDark
      ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
    border: config.borderColor,
    shadow: isDark
      ? `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px ${config.color}30`
      : `0 20px 40px rgba(0, 0, 0, 0.1), 0 0 20px ${config.color}20`,
    closeButton: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(241, 245, 249, 0.8)',
    closeButtonHover: isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.9)',
    closeButtonText: isDark ? 'rgba(148, 163, 184, 0.9)' : 'rgba(100, 116, 139, 0.9)'
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full h-full"
    >
      <motion.div
        className="rounded-xl border backdrop-blur-xl h-full flex flex-col relative overflow-hidden"
        style={{
          background: themeColors.background,
          borderColor: themeColors.border,
          boxShadow: themeColors.shadow
        }}
        layoutId="fact-check-card"
      >
        {/* Close button - positioned absolute for no layout shift */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onDismiss}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{
            background: themeColors.closeButton,
            color: themeColors.closeButtonText
          }}
          whileHover={{ 
            scale: 1.1,
            backgroundColor: themeColors.closeButtonHover,
            color: colors.foreground
          }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-4 h-4" />
        </motion.button>

        {/* Header - Appears first */}
        <motion.div variants={sectionVariants} className="flex-shrink-0">
          <FactCheckHeader
            factCheck={factCheck}
            config={config}
            onDismiss={() => {}} // Handled by absolute button
          />
        </motion.div>

        {/* Content - Each section appears with stagger */}
        <div className="flex flex-col gap-3 p-6 pt-2 min-h-0 flex-1">
          {/* Analysis Section with Stamp */}
          <motion.div variants={sectionVariants} className="relative flex-shrink-0">
            <FactCheckAnalysis factCheck={factCheck} config={config} />
            <StampText
              stampText={factCheck.status}
              config={config}
            />
          </motion.div>

          {/* Correction Section */}
          {factCheck.correction && (
            <motion.div variants={sectionVariants} className="flex-shrink-0">
              <FactCheckCorrection correction={factCheck.correction} />
            </motion.div>
          )}

          {/* Sources Section - Takes remaining space */}
          <motion.div
            variants={sectionVariants}
            className="flex-1 min-h-0"
          >
            <FactCheckSources factCheck={factCheck} config={config} />
          </motion.div>

          {/* Experts Section */}
          <motion.div 
            variants={sectionVariants} 
            className="flex-shrink-0 min-h-[300px]">
            <FactCheckExperts factCheck={factCheck} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}