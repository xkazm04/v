"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { LLMResearchResponse } from "@/app/types/research";
import { FactCheckHeader } from "./card-sections/FactCheckHeader";
import { FactCheckAnalysis } from "./card-sections/FactCheckAnalysis";
import { FactCheckCorrection } from "./card-sections/FactCheckCorrection";
import { FactCheckSources } from "./card-sections/FactCheckSources";
import { FactCheckExperts } from "./card-sections/FactCheckExperts";
import { getStatusConfig } from "./utils/statusConfig";

interface FactCheckCardProps {
  factCheck: LLMResearchResponse;
  onDismiss: () => void;
  onExpertToggle: () => void;
  animationPhase: 'notification' | 'card' | 'complete' | 'idle';
}

// Updated animation variants with longer stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 1.0, // Increased from 0.4 to 1.0 seconds
      delayChildren: 0.3
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3 }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export function FactCheckCard({ factCheck, onDismiss, onExpertToggle, animationPhase }: FactCheckCardProps) {
  const config = getStatusConfig(factCheck.status);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full h-full"
    >
      <motion.div
        className="rounded-xl border backdrop-blur-md h-full flex flex-col"
        style={{
          background: `linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95) 0%,
            rgba(30, 41, 59, 0.98) 100%
          )`,
          borderColor: config.borderColor,
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 30px ${config.color}30
          `
        }}
        layoutId="fact-check-card"
      >
        {/* Header - Appears first */}
        <motion.div variants={sectionVariants} className="flex-shrink-0">
          <FactCheckHeader 
            factCheck={factCheck}
            config={config}
            onDismiss={onDismiss}
          />
        </motion.div>

        {/* Content - Each section appears with 1s delay */}
        <div className="flex flex-col gap-2 p-5 min-h-0">
          {/* Analysis Section - Appears second (1s after header) */}
          <motion.div variants={sectionVariants} className="row-span-1">
            <FactCheckAnalysis factCheck={factCheck} config={config} />
          </motion.div>

          {/* Correction Section - Appears third (2s after header) */}
          {factCheck.correction && (
            <motion.div variants={sectionVariants} className="row-span-1">
              <FactCheckCorrection correction={factCheck.correction} />
            </motion.div>
          )}

          {/* Sources Section - Appears fourth (3s after header) */}
          <motion.div 
            variants={sectionVariants} 
            className={factCheck.correction ? "row-span-1" : "row-span-2"}
          >
            <FactCheckSources factCheck={factCheck} config={config} />
          </motion.div>

          {/* Experts Section - Appears last (4s after header) */}
          <motion.div variants={sectionVariants} className="row-span-1">
            <FactCheckExperts factCheck={factCheck} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}