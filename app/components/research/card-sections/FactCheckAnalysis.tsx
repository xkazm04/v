"use client";

import { motion } from "framer-motion";
import { LLMResearchResponse } from "@/app/types/research";

interface FactCheckAnalysisProps {
  factCheck: LLMResearchResponse;
  config: any;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export function FactCheckAnalysis({ factCheck, config }: FactCheckAnalysisProps) {
  return (
    <motion.div variants={sectionVariants} className="h-full flex flex-col">
      <h4 className="text-sm font-semibold text-slate-300 mb-2 flex-shrink-0">Analysis</h4>
      <div className="flex-1 overflow-y-auto">
        <p className="text-sm text-slate-200 leading-relaxed">
          {factCheck.verdict}
        </p>
      </div>
    </motion.div>
  );
}