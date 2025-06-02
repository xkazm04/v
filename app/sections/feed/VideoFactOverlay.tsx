import { motion } from 'framer-motion';
import {  Users, Shield, CheckCircle } from 'lucide-react';
import { FactCheckResult } from '@/app/types/video';
import { getEvaluationIcon, getEvaluationColor, getProgressBarColors } from '@/app/helpers/factCheck';
import { overlayVariants } from '@/app/helpers/animation';

interface VideoFactOverlayProps {
  factCheck: FactCheckResult;
  overlayType: 'full' | 'minimal';
}

const VideoFactOverlay = ({ factCheck, overlayType }: VideoFactOverlayProps) => {
  const colors = getProgressBarColors();

  const StatCard = ({ icon, label, value, accent }: { 
    icon: React.ReactNode; 
    label: string; 
    value: string | number;
    accent?: string;
  }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/50"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className={`p-1.5 rounded-md ${accent || 'bg-muted'}`}>
          {icon}
        </div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-lg font-bold text-foreground">
        {value}
      </div>
    </motion.div>
  );

  const ProgressBar = ({ percentage, color, label }: { 
    percentage: number; 
    color: string; 
    label: string;
  }) => (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-xs font-bold text-foreground">{percentage}%</span>
      </div>
      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  );

  if (overlayType === 'minimal') {
    return (
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent backdrop-blur-sm"
      >
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getEvaluationIcon(factCheck.evaluation || 'Unknown', 'md')}
              <span className={`font-bold ${getEvaluationColor(factCheck.evaluation || 'Unknown')}`}>
                {factCheck.evaluation}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-background/80 rounded-full px-2 py-1">
              <Shield className="h-3 w-3 text-primary" />
              <span className="text-xs font-bold text-foreground">
                {factCheck.confidence}%
              </span>
            </div>
          </div>
          
          {/* Progress Bars */}
          <div className="space-y-2">
            <ProgressBar 
              percentage={factCheck.truthPercentage || 0}
              color={colors.truth}
              label="Truth"
            />
            <ProgressBar 
              percentage={factCheck.misleadingPercentage || 0} 
              color={colors.misleading}
              label="Misleading"
            />
          </div>
          
          {/* Quick Stats */}
          <div className="flex justify-between text-xs">
            <div className="flex items-center gap-1 bg-background/60 rounded px-2 py-1">
              <CheckCircle className="h-3 w-3 text-verified" />
              <span className="text-foreground font-medium">
                {factCheck.verifiedClaims}/{factCheck.totalClaims} verified
              </span>
            </div>
            <div className="flex items-center gap-1 bg-background/60 rounded px-2 py-1">
              <Users className="h-3 w-3 text-primary" />
              <span className="text-foreground font-medium">
                {factCheck.sources} sources
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-md border border-border/30 rounded-lg"
    >
      <div className="p-4 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${factCheck.evaluation === 'Fact' ? 'bg-verified/20' : factCheck.evaluation === 'Mislead' ? 'bg-unverified/20' : 'bg-false/20'}`}>
                {getEvaluationIcon(factCheck.evaluation || 'Unknown', 'lg')}
              </div>
              <div>
                <span className={`text-lg font-bold ${getEvaluationColor(factCheck.evaluation || 'Unknown')}`}>
                  {factCheck.evaluation}
                </span>
                <p className="text-xs text-muted-foreground">
                  Analysis Result
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">
                {factCheck.confidence}%
              </div>
              <p className="text-xs text-muted-foreground">
                Confidence
              </p>
            </div>
          </div>
          
          {/* Progress Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Truth Breakdown</h4>
            <div className="space-y-2">
              <ProgressBar 
                percentage={factCheck.truthPercentage || 0}
                color={colors.truth}
                label="Factual Content"
              />
              <ProgressBar 
                percentage={factCheck.neutralPercentage || 0}
                color="bg-neutral-400"
                label="Neutral/Unclear"
              />
              <ProgressBar 
                percentage={factCheck.misleadingPercentage || 0}
                color={colors.misleading}
                label="Misleading Content"
              />
            </div>
          </div>
        </div>
        
        {/* Bottom Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<CheckCircle className="h-4 w-4 text-verified" />}
            label="Claims"
            value={`${factCheck.verifiedClaims}/${factCheck.totalClaims}`}
            accent="bg-verified/20"
          />
          <StatCard
            icon={<Users className="h-4 w-4 text-primary" />}
            label="Sources"
            value={factCheck.sources || 0}
            accent="bg-primary/20"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default VideoFactOverlay;