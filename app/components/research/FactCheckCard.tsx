"use client";

import { motion } from "framer-motion";
import { LLMResearchResponse } from "@/app/types/research";
import { FactCheckHeader } from "./card-sections/FactCheckHeader";
import { FactCheckCorrection } from "./card-sections/FactCheckCorrection";
import { FactCheckSources } from "./card-sections/FactCheckSources";
import { FactCheckExperts } from "./card-sections/FactCheckExperts";
import { getStatusConfig } from "./utils/statusConfig";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { containerVariants } from "../animations/variants/votingVariants";
import { sectionVariants } from "../animations/variants/feedVariants";

interface FactCheckCardProps {
  factCheck: LLMResearchResponse;
  onDismiss: () => void;
  onExpertToggle: () => void;
  animationPhase: 'notification' | 'card' | 'complete' | 'idle';
}

export function FactCheckCard({ factCheck }: FactCheckCardProps) {
  const { isDark } = useLayoutTheme();
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
        {/* Header - Appears first */}
        <motion.div variants={sectionVariants} className="">
          <FactCheckHeader
            factCheck={factCheck}
            config={config}
            onDismiss={() => {}} 
          />
        </motion.div>

        {/* Content - Each section appears with stagger */}
        <div className="flex flex-col gap-3 p-6 pt-2 min-h-0 flex-1">

          {/* Correction Section */}
          {factCheck.correction && (
            <motion.div variants={sectionVariants} className="">
              <FactCheckCorrection correction={factCheck.correction} />
            </motion.div>
          )}
          <motion.div 
            variants={sectionVariants} >
            <FactCheckExperts factCheck={factCheck} />
          </motion.div>
          <motion.div
            variants={sectionVariants}
            className="flex-1 min-h-0"
          >
            <FactCheckSources factCheck={factCheck}/>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}