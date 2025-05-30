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
  return (
    <div className={`flex items-center gap-2 ${compact ? 'mt-1' : 'mt-2'}`}>
      <div className={`flex-1 bg-border/30 rounded-full ${height} overflow-hidden`}>
        <div className={`flex ${height}`}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${factCheck.truthPercentage}%` }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className={`bg-chart-3`}
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
            className="bg-chart-5"
          />
        </div>
      </div>
      
      {showLabel && !compact && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-1"
        >
          {getEvaluationIcon(factCheck.evaluation, 'sm')}
          <span className={`text-xs font-medium ${getEvaluationColor(factCheck.evaluation)}`}>
            {factCheck.evaluation}
          </span>
        </motion.div>
      )}
      
      {compact && (
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {factCheck.truthPercentage}%
        </span>
      )}
    </div>
  );
};

export default VideoTruthBar;