import { motion } from 'framer-motion';
import { getEvaluationIcon, getEvaluationColor, getProgressBarColors } from '@/app/helpers/factCheck';
import { progressVariants } from '@/app/helpers/animation';
import { FactCheckResult } from '@/app/types/video';

interface VideoTruthBarProps {
  factCheck: FactCheckResult;
  height: string;
  showLabel?: boolean;
  compact?: boolean;
}

const VideoTruthBar = ({ factCheck, height, showLabel = true, compact = false }: VideoTruthBarProps) => {
  const colors = getProgressBarColors();

  return (
    <div className={`flex items-center gap-2 ${compact ? 'mt-1' : 'mt-2'}`}>
      <div className={`flex-1 bg-border/30 rounded-full ${height} overflow-hidden`}>
        <div className={`flex ${height}`}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${factCheck.truthPercentage}%` }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className={`${colors.truth}`}
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${factCheck.neutralPercentage}%` }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="bg-neutral-400"
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${factCheck.misleadingPercentage}%` }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className={`${colors.misleading}`}
          />
        </div>
      </div>
      
      {showLabel && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-1"
        >
          {!compact && getEvaluationIcon(factCheck.evaluation, 'sm')}
          <span className={`text-xs font-medium ${getEvaluationColor(factCheck.evaluation)}`}>
            {compact ? `${factCheck.truthPercentage}%` : factCheck.evaluation}
          </span>
        </motion.div>
      )}
      
      {!showLabel && (
        <span className="text-xs font-medium text-muted-foreground">
          {factCheck.truthPercentage}% truth
        </span>
      )}
    </div>
  );
};

export default VideoTruthBar;