'use client';

import { motion } from 'framer-motion';
import { Speaker } from '@/app/constants/speakers';

interface ReliabilityScoreProps {
  speaker: Speaker;
}

const DashScore = ({ speaker }: ReliabilityScoreProps) => {
  const score = speaker.reliabilityScore;
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm text-center"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Reliability Score</h3>
      
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--border))"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={getScoreColor(score)}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">{score}</div>
            <div className="text-xs text-muted-foreground">/ 100</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div
          className="text-lg font-semibold"
          style={{ color: getScoreColor(score) }}
        >
          {getScoreLabel(score)}
        </div>
        <p className="text-sm text-muted-foreground">
          Based on fact-checking accuracy, source quality, and statement verification
        </p>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-medium text-foreground">Consistency</div>
          <div className="text-muted-foreground">{score - 5}%</div>
        </div>
        <div>
          <div className="font-medium text-foreground">Transparency</div>
          <div className="text-muted-foreground">{score + 3}%</div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashScore;