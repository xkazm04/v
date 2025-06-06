'use client';

import { motion } from 'framer-motion';
import { getVerdictStyling } from '@/app/config/verdictStyling';

interface ConfidenceProgressBarProps {
  factCheckInfo: { status: string; truthPercentage: number };
  colors: any;
  isDark: boolean;
}

export function ConfidenceProgressBar({ 
  factCheckInfo, 
  colors, 
  isDark 
}: ConfidenceProgressBarProps) {
  const verdictStyle = getVerdictStyling(factCheckInfo.status, isDark);

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: '100%', opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="mt-3 h-1 rounded-full overflow-hidden"
      style={{
        background: isDark 
          ? 'rgba(71, 85, 105, 0.3)' 
          : 'rgba(226, 232, 240, 0.5)'
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${factCheckInfo.truthPercentage}%` }}
        transition={{ delay: 1, duration: 1, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{
          background: verdictStyle 
            ? `linear-gradient(90deg, ${verdictStyle.bgColor.split(' ')[1]}, ${verdictStyle.bgColor.split(' ')[2]})`
            : `linear-gradient(90deg, ${colors.primary}, ${colors.primary})`
        }}
      />
    </motion.div>
  );
}