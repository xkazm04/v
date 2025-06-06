'use client';

import { motion } from 'framer-motion';
import { useSmartTimeTracking } from '@/app/hooks/useSmartTimeTracking';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { FactCheckResult } from '@/app/types/video';

interface ListenOnlyTimelineProps {
  videoId: string;
  duration: number;
  factCheck?: FactCheckResult;
  claims: Array<{
    startTime: number;
    endTime: number;
    text: string;
    veracity: 'true' | 'false' | 'neutral';
  }>;
}

export function ListenOnlyTimeline({ 
  videoId, 
  duration, 
  factCheck, 
  claims 
}: ListenOnlyTimelineProps) {
  const { colors, isDark } = useLayoutTheme();
  const { currentTime, accuracy, confidence } = useSmartTimeTracking(videoId, duration);
  
  const progressPercentage = (currentTime / duration) * 100;

  // Find active claims at current time
  const activeClaims = claims.filter(
    claim => currentTime >= claim.startTime && currentTime <= claim.endTime
  );

  return (
    <div className="space-y-4">
      {/* Accuracy indicator */}
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: colors.mutedForeground }}>
          Tracking: {accuracy} ({confidence}% confidence)
        </span>
        <span style={{ color: colors.mutedForeground }}>
          {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
        </span>
      </div>

      {/* Enhanced timeline bar */}
      <div className="relative h-4 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.5)' }}>
        {/* Progress bar */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${progressPercentage}%`,
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.primary}90)`
          }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.1 }}
        />

        {/* Claim segments */}
        {claims.map((claim, index) => {
          const segmentStart = (claim.startTime / duration) * 100;
          const segmentWidth = ((claim.endTime - claim.startTime) / duration) * 100;
          const isActive = activeClaims.includes(claim);
          
          return (
            <motion.div
              key={index}
              className={`absolute h-full ${
                claim.veracity === 'true' ? 'bg-green-500' :
                claim.veracity === 'false' ? 'bg-red-500' : 'bg-yellow-500'
              }`}
              style={{
                left: `${segmentStart}%`,
                width: `${segmentWidth}%`,
                opacity: isActive ? 0.9 : 0.6
              }}
              animate={{
                opacity: isActive ? 0.9 : 0.6,
                scaleY: isActive ? 1.2 : 1
              }}
              transition={{ duration: 0.2 }}
            />
          );
        })}

        {/* Current time indicator */}
        <motion.div
          className="absolute top-0 w-1 h-full rounded-full"
          style={{
            left: `${progressPercentage}%`,
            background: colors.foreground,
            boxShadow: `0 0 8px ${colors.primary}50`
          }}
          animate={{ left: `${progressPercentage}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Active claims display */}
      {activeClaims.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3 rounded-lg border"
          style={{
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(248, 250, 252, 0.8)',
            borderColor: colors.border
          }}
        >
          <div className="text-sm font-medium mb-1" style={{ color: colors.foreground }}>
            Active Claims:
          </div>
          {activeClaims.map((claim, index) => (
            <div key={index} className="text-xs mb-1" style={{ color: colors.mutedForeground }}>
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                claim.veracity === 'true' ? 'bg-green-500' :
                claim.veracity === 'false' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              {claim.text}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}