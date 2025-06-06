'use client';

import { motion } from 'framer-motion';
import { Shield, Target } from 'lucide-react';
import { VideoMetadata } from '@/app/types/video';
import { getVerdictStyling } from '@/app/config/verdictStyling';
import { cn } from '@/app/lib/utils';
import { contentVariants, badgeVariants } from '../../animations/variants/playerVariants';

interface FactCheckBadgeProps {
  factCheckInfo: { status: string; evaluation: string; truthPercentage: number } | null;
  video: VideoMetadata;
  isMobile: boolean;
  colors: any;
  isDark: boolean;
}

export function FactCheckBadge({ 
  factCheckInfo, 
  video, 
  isMobile, 
  colors, 
  isDark 
}: FactCheckBadgeProps) {
  const verdictStyle = factCheckInfo ? getVerdictStyling(factCheckInfo.status, isDark) : null;
  const VerdictIcon = verdictStyle?.icon || Shield;

  return (
    <motion.div 
      variants={contentVariants}
      className="flex items-center space-x-3 flex-1 min-w-0"
    >
      {factCheckInfo && verdictStyle ? (
        <>
          {/* Verdict Badge */}
          <motion.div
            variants={badgeVariants}
            whileHover="hover"
            className="relative flex-shrink-0"
          >
            <div 
              className={cn(
                "p-2 rounded-xl backdrop-blur-sm",
                isMobile ? "p-1.5" : "p-2"
              )}
              style={{
                background: `linear-gradient(135deg, ${verdictStyle.bgColor.split(' ')[1]} 0%, ${verdictStyle.bgColor.split(' ')[2]} 100%)`,
                border: `1px solid rgba(255, 255, 255, 0.2)`
              }}
            >
              <VerdictIcon 
                className={cn(
                  "text-white drop-shadow-sm",
                  isMobile ? "h-4 w-4" : "h-5 w-5"
                )} 
              />
            </div>
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-xl blur-md opacity-50"
              style={{ 
                background: `linear-gradient(135deg, ${verdictStyle.bgColor.split(' ')[1]} 0%, ${verdictStyle.bgColor.split(' ')[2]} 100%)`,
                zIndex: -1
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Verdict Text */}
          <div className="flex-1 min-w-0">
            <motion.div
              variants={contentVariants}
              className="space-y-1"
            >
              <div className="flex items-center space-x-2">
                <h3 
                  className={cn(
                    "font-bold tracking-wide uppercase",
                    isMobile ? "text-xs" : "text-sm"
                  )}
                  style={{ color: colors.foreground }}
                >
                  {factCheckInfo.status}
                </h3>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Shield 
                    className={cn(
                      "opacity-60",
                      isMobile ? "h-3 w-3" : "h-4 w-4"
                    )}
                    style={{ color: colors.primary }}
                  />
                </motion.div>
              </div>
              
              <p 
                className={cn(
                  "font-medium",
                  isMobile ? "text-xs" : "text-sm"
                )}
                style={{ color: colors.mutedForeground }}
              >
                {factCheckInfo.truthPercentage}% accuracy • {video.factCheck?.totalClaims || 0} claims verified
              </p>
            </motion.div>
          </div>
        </>
      ) : (
        /* No Fact Check Available */
        <motion.div
          variants={contentVariants}
          className="flex items-center space-x-3"
        >
          <div 
            className={cn(
              "p-2 rounded-xl backdrop-blur-sm",
              isMobile ? "p-1.5" : "p-2"
            )}
            style={{
              background: isDark 
                ? 'rgba(71, 85, 105, 0.6)' 
                : 'rgba(148, 163, 184, 0.4)',
              border: `1px solid rgba(255, 255, 255, 0.2)`
            }}
          >
            <Target 
              className={cn(
                "opacity-80",
                isMobile ? "h-4 w-4" : "h-5 w-5"
              )}
              style={{ color: colors.mutedForeground }}
            />
          </div>
          <div>
            <h3 
              className={cn(
                "font-bold",
                isMobile ? "text-xs" : "text-sm"
              )}
              style={{ color: colors.foreground }}
            >
              NOT FACT-CHECKED
            </h3>
            <p 
              className={cn(
                "font-medium",
                isMobile ? "text-xs" : "text-sm"
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