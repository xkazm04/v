"use client";

import { motion } from "framer-motion";
import { FactCheckHeader } from "./card-sections/FactCheckHeader";
import { FactCheckCorrection } from "./card-sections/FactCheckCorrection";
import { FactCheckSources } from "./card-sections/FactCheckSources";
import { FactCheckExperts } from "./card-sections/FactCheckExperts";
import { getStatusConfig, normalizeAnalysisStatus } from "./utils/statusConfig";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { containerVariants } from "../animations/variants/votingVariants";
import { sectionVariants } from "../animations/variants/feedVariants";
import { NormalizedFactCheck } from "./FactCheckOverlay";

interface FactCheckCardProps {
  factCheck: NormalizedFactCheck;
  onDismiss: () => void;
  onExpertToggle: () => void;
  animationPhase: 'notification' | 'card' | 'complete' | 'idle';
}

export function FactCheckCard({ factCheck, onDismiss, onExpertToggle, animationPhase }: FactCheckCardProps) {
  const { isDark } = useLayoutTheme();
  const config = getStatusConfig(normalizeAnalysisStatus(factCheck.status));

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
          background: isDark
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
          borderColor: config.borderColor,
          boxShadow: isDark
            ? `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px ${config.color}30`
            : `0 20px 40px rgba(0, 0, 0, 0.1), 0 0 20px ${config.color}20`
        }}
        layoutId="fact-check-card"
      >
        <motion.div variants={sectionVariants}>
          <FactCheckHeader
            factCheck={factCheck}
            config={config}
            onDismiss={onDismiss}
          />
        </motion.div>
        <div className="flex flex-col gap-3 p-6 pt-2 min-h-0 flex-1">
            <motion.div variants={sectionVariants}>
              <FactCheckCorrection correction={factCheck.correction} />
            </motion.div>
          <motion.div variants={sectionVariants} className="my-5 min-h-0">
            <FactCheckSources factCheck={factCheck} />
          </motion.div>
          <motion.div variants={sectionVariants}>
            <FactCheckExperts factCheck={factCheck} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}