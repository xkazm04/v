"use client";
import { motion } from "framer-motion";
import { LLMResearchResponse } from "@/app/types/research";
import { getVerdictIcon } from "../utils/statusConfig";
import { sectionVariants } from "../../animations/variants/feedVariants";
import { useResearchTranslations } from "@/app/hooks/useSmartTranslations";

interface FactCheckAnalysisProps {
  factCheck: LLMResearchResponse;
  config: any;
}

export function FactCheckAnalysis({ factCheck, config }: FactCheckAnalysisProps) {
  const { t: tr } = useResearchTranslations();
  const VerdictIcon = getVerdictIcon(factCheck.status);

  return (
    <motion.div variants={sectionVariants} className="space-y-3">
      {/* Analysis Header */}
      <div className="flex items-center gap-2">
        <VerdictIcon 
          className="w-4 h-4" 
          style={{ color: config.color }}
        />
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {tr('analysis', 'Analysis')}
        </h4>
      </div>

      {/* Verdict with Better Typography */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-lg 
                 bg-gradient-to-br from-white/95 to-slate-50/90 dark:from-slate-800/40 dark:to-slate-900/40 
                 border border-slate-200/60 dark:border-slate-700/50"
      >
        <div className="space-y-2">
          {/* Verdict Label */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {tr('verdict', 'VERDICT')}
            </span>
            <div 
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{
                background: `${config.color}15`,
                color: config.color,
                border: `1px solid ${config.color}30`
              }}
            >
              {factCheck.status}
            </div>
          </div>
          
          {/* Verdict Text - Enhanced Readability */}
          <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
            {factCheck.verdict}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}