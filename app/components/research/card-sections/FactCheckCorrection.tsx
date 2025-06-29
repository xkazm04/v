import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { sectionVariants } from "../../animations/variants/feedVariants";
import { useResearchTranslations } from "@/app/hooks/useSmartTranslations";

interface FactCheckCorrectionProps {
  correction: string;
}


export function FactCheckCorrection({ correction }: FactCheckCorrectionProps) {
  const { t: tr } = useResearchTranslations();
  return (
    <motion.div variants={sectionVariants} className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-300">{tr('correction', 'Correction')}</h4>
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
          <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100 font-medium">
            {correction}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}