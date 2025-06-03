"use client";

import { motion } from "framer-motion";

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
    <motion.div
      variants={sectionVariants}
      className="h-full p-3 rounded-lg flex flex-col"
      style={{
        background: 'rgba(34, 197, 94, 0.1)',
        border: '1px solid rgba(34, 197, 94, 0.3)'
      }}
    >
      <h5 className="text-xs font-semibold text-green-400 mb-2 flex-shrink-0">Correction</h5>
      <div className="flex-1 overflow-y-auto">
        <p className="text-sm text-slate-200 leading-relaxed">
          {correction}
        </p>
      </div>
    </motion.div>
  );
}