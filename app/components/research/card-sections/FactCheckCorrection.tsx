"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";

interface FactCheckCorrectionProps {
  correction: string;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export function FactCheckCorrection({ correction }: FactCheckCorrectionProps) {
  return (
    <motion.div variants={sectionVariants} className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-300">Correction</h4>
      </div>

      {/* Correction Content */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="relative p-4 rounded-lg 
                 bg-gradient-to-r from-amber-50/90 to-orange-50/60 dark:from-amber-500/10 dark:to-orange-500/5 
                 border border-amber-200/60 dark:border-amber-500/30"
      >
        {/* Accent Line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-orange-600 rounded-l-lg" />
        
        <div className="pl-3">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">ACCURATE VERSION</span>
          </div>
          <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100 font-medium">
            {correction}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}