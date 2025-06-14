'use client';

import { motion } from 'framer-motion';
import { Shield, Target, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { VideoMetadata } from '@/app/types/video';
import { getVerdictStyling } from '@/app/config/verdictStyling';
import { cn } from '@/app/lib/utils';
import { contentVariants } from '../../animations/variants/playerVariants';
import { badgeVariants } from '../../animations/variants/cardVariants';
import DynamicBackground from '../../ui/Decorative/DynamicBackground';
import { useTheme } from 'next-themes';

interface FactCheckBadgeProps {
  factCheckInfo: { status: string; evaluation: string; truthPercentage: number } | null;
  video: VideoMetadata;
  isMobile: boolean;
  colors: any;
  isDark: boolean;
}

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'true':
    case 'verified':
      return CheckCircle;
    case 'false':
    case 'misleading':
      return XCircle;
    case 'partially_true':
    case 'mixed':
      return AlertTriangle;
    default:
      return Shield;
  }
};

export function FactCheckBadge({
  factCheckInfo,
  video,
  isMobile,
  colors,
  isDark
}: FactCheckBadgeProps) {
  const verdictStyle = factCheckInfo ? getVerdictStyling(factCheckInfo.status, isDark) : null;
  const VerdictIcon = factCheckInfo ? getStatusIcon(factCheckInfo.status) : Target;
  const { theme } = useTheme();
  const currentTheme = theme === 'light' ? 'light' : 'dark';

  return (
    <motion.div
      variants={contentVariants}
      className="flex items-center space-x-4 flex-1 min-w-0"
    >
      <DynamicBackground
        currentTheme={currentTheme}
        config={{
          color: colors.primary,
          bgGradient: isDark
            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
          stampOpacity: '0.05'
        }}
      />
      
      {factCheckInfo && verdictStyle ? (
        <>
          {/* Enhanced Verdict Badge */}
          <motion.div
            variants={badgeVariants}
            whileHover="hover"
            className="relative flex-shrink-0"
          >
            <div
              className={cn(
                "p-3 rounded-2xl backdrop-blur-sm shadow-xl",
                isMobile ? "p-4" : "p-3"
              )}
              style={{
                background: `linear-gradient(135deg, ${verdictStyle.bgColor.split(' ')[1]} 0%, ${verdictStyle.bgColor.split(' ')[2]} 100%)`,
                border: `2px solid rgba(255, 255, 255, 0.3)`,
                boxShadow: `0 8px 25px ${verdictStyle.bgColor.split(' ')[1]}40`
              }}
            >
              <VerdictIcon
                className={cn(
                  "text-white drop-shadow-lg",
                  isMobile ? "h-7 w-7" : "h-6 w-6"
                )}
              />
            </div>

            {/* Enhanced Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl blur-xl opacity-60"
              style={{
                background: `linear-gradient(135deg, ${verdictStyle.bgColor.split(' ')[1]} 0%, ${verdictStyle.bgColor.split(' ')[2]} 100%)`,
                zIndex: -1
              }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Enhanced Verdict Text */}
          <div className="flex-1 min-w-0">
            <motion.div
              variants={contentVariants}
              className="space-y-2"
            >
              <div className="flex items-center space-x-3">
                <h3
                  className={cn(
                    "font-black tracking-wider uppercase",
                    isMobile ? "text-lg" : "text-base"
                  )}
                  style={{ color: colors.foreground }}
                >
                  {factCheckInfo.status}
                </h3>
                
                {/* Verification Badge */}
                <motion.div
                  className="px-2 py-1 rounded-lg text-xs font-bold uppercase"
                  style={{
                    backgroundColor: `${colors.primary}20`,
                    color: colors.primary,
                    border: `1px solid ${colors.primary}40`
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  VERIFIED
                </motion.div>
              </div>

              <div className="flex items-center space-x-4">
                <p
                  className={cn(
                    "font-semibold",
                    isMobile ? "text-base" : "text-sm"
                  )}
                  style={{ color: colors.mutedForeground }}
                >
                  {factCheckInfo.truthPercentage}% accuracy
                </p>
                
                <div className="w-1 h-4 rounded-full" style={{ backgroundColor: colors.border }} />
                
                <p
                  className={cn(
                    "font-medium",
                    isMobile ? "text-sm" : "text-xs"
                  )}
                  style={{ color: colors.mutedForeground }}
                >
                  {video.factCheck?.totalClaims || 0} claims verified
                </p>
              </div>
            </motion.div>
          </div>
        </>
      ) : (
        /* Enhanced No Fact Check Available */
        <motion.div
          variants={contentVariants}
          className="flex items-center space-x-4"
        >
          <div
            className={cn(
              "p-3 rounded-2xl backdrop-blur-sm shadow-lg",
              isMobile ? "p-4" : "p-3"
            )}
            style={{
              background: isDark
                ? 'rgba(71, 85, 105, 0.7)'
                : 'rgba(148, 163, 184, 0.5)',
              border: `2px solid rgba(255, 255, 255, 0.2)`,
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
            }}
          >
            <Target
              className={cn(
                "opacity-80",
                isMobile ? "h-7 w-7" : "h-6 w-6"
              )}
              style={{ color: colors.mutedForeground }}
            />
          </div>
          
          <div className="flex-1">
            <h3
              className={cn(
                "font-bold",
                isMobile ? "text-lg" : "text-base"
              )}
              style={{ color: colors.foreground }}
            >
              NOT FACT-CHECKED
            </h3>
            <p
              className={cn(
                "font-medium",
                isMobile ? "text-base" : "text-sm"
              )}
              style={{ color: colors.mutedForeground }}
            >
              No verification data available
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}