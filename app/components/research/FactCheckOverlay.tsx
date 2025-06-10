"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoDetail, VideoTimestamp } from "@/app/types/video_api";
import { CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Clock } from "lucide-react";
import { FactCheckCard } from "./FactCheckCard";
import { FactCheckSummary } from "./FactCheckSummary";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";

interface FactCheckOverlayProps {
  video: VideoDetail;
  isVideoPlaying: boolean;
  videoCurrentTime: number;
  className?: string;
}

export function FactCheckOverlay({ 
  video, 
  isVideoPlaying, 
  videoCurrentTime,
  className 
}: FactCheckOverlayProps) {
  const { colors, isDark } = useLayoutTheme();
  
  const [showCard, setShowCard] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [previousTimestamp, setPreviousTimestamp] = useState<VideoTimestamp | null>(null);

  // Find current active timestamp
  const currentTimestamp = useMemo(() => {
    return video.timestamps.find(ts => 
      videoCurrentTime >= ts.startTime && videoCurrentTime <= ts.endTime
    );
  }, [video.timestamps, videoCurrentTime]);

  // Detect when we enter a new fact-checked statement
  useEffect(() => {
    if (currentTimestamp && currentTimestamp !== previousTimestamp && currentTimestamp.factCheck) {
      // New fact-checked statement detected
      setShowCard(true);
      setPreviousTimestamp(currentTimestamp);
    } else if (!currentTimestamp) {
      setShowCard(false);
      setPreviousTimestamp(null);
    }
  }, [currentTimestamp, previousTimestamp]);

  // Show summary when video is paused and we have fact-checks
  useEffect(() => {
    const hasFactChecks = video.timestamps.some(ts => ts.factCheck);
    if (!isVideoPlaying && hasFactChecks) {
      setShowSummary(true);
    } else {
      setShowSummary(false);
    }
  }, [isVideoPlaying, video.timestamps]);

  // Theme-aware colors
  const themeColors = {
    emptyBackground: isDark 
      ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(30, 41, 59, 0.6) 100%)'
      : 'linear-gradient(135deg, rgba(248, 250, 252, 0.4) 0%, rgba(241, 245, 249, 0.6) 100%)',
    emptyBorder: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)',
    emptyText: colors.foreground,
    emptySubtext: isDark ? 'rgba(148, 163, 184, 0.7)' : 'rgba(100, 116, 139, 0.7)',
    pendingBackground: isDark 
      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
    pendingBorder: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
    pendingAccent: isDark ? '#60a5fa' : '#2563eb'
  };


  // Convert to format expected by legacy components
  const convertToLegacyFormat = (timestamp: VideoTimestamp) => {
    if (!timestamp.factCheck) return null;
    
    return {
      statement: timestamp.statement,
      status: timestamp.factCheck.status,
      verdict: timestamp.factCheck.verdict,
      category: timestamp.category || 'GENERAL',
      valid_sources: timestamp.factCheck.confidence,
      country: 'us', // Default
      correction: timestamp.factCheck.correction,
      resources_agreed: timestamp.factCheck.sources.agreed,
      resources_disagreed: timestamp.factCheck.sources.disagreed,
      experts: timestamp.factCheck.expertAnalysis,
      research_method: 'comprehensive_analysis',
      profile_id: 'current_user'
    };
  };

  return (
    <div className={`relative ${className} min-h-screen`}>
      {/* Content Container - Full size */}
      <div className="absolute inset-0 flex flex-col">
        {/* Main Content Area - Full height, no position changes */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {currentTimestamp && showCard ? (
              // Fact-check card - fills full container
              <motion.div
                key="fact-check-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  type: "spring", 
                  damping: 25, 
                  stiffness: 300,
                  duration: 0.3
                }}
                className="absolute inset-4" // Small padding from edges
              >
                {currentTimestamp.factCheck ? (
                  <FactCheckCard 
                    //@ts-expect-error Ignore
                    factCheck={convertToLegacyFormat(currentTimestamp)!}
                    onDismiss={() => setShowCard(false)}
                    onExpertToggle={() => {}}
                    animationPhase="card"
                  />
                ) : (
                  // Pending statement card
                  <motion.div
                    className="w-full h-full flex flex-col backdrop-blur-xl rounded-xl border"
                    style={{
                      background: themeColors.pendingBackground,
                      borderColor: themeColors.pendingBorder
                    }}
                    layout
                  >
                    <CardHeader className="pb-3 flex-shrink-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4" style={{ color: themeColors.pendingAccent }} />
                        <span className="text-sm font-mono" style={{ color: themeColors.emptySubtext }}>
                          {Math.floor(currentTimestamp.startTime / 60)}:{(currentTimestamp.startTime % 60).toString().padStart(2, '0')} - 
                          {Math.floor(currentTimestamp.endTime / 60)}:{(currentTimestamp.endTime % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      <CardTitle className="text-lg" style={{ color: themeColors.emptyText }}>
                        Current Statement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      <p className="text-sm leading-relaxed" style={{ color: themeColors.emptyText }}>
                        "{currentTimestamp.statement}"
                      </p>
                      <Badge 
                        variant="outline" 
                        className="inline-flex items-center gap-1"
                        style={{ 
                          backgroundColor: `${themeColors.pendingAccent}20`,
                          color: themeColors.pendingAccent,
                          borderColor: `${themeColors.pendingAccent}40`
                        }}
                      >
                        <motion.div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: themeColors.pendingAccent }}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                        />
                        Fact-check in progress...
                      </Badge>
                    </CardContent>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              // Empty state - centered
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 h-full"
              >
                <motion.div
                  className="text-center backdrop-blur-sm rounded-2xl p-8 border h-full flex flex-col justify-center"
                  style={{
                    background: themeColors.emptyBackground,
                    borderColor: themeColors.emptyBorder
                  }}
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <motion.div
                    animate={{
                      rotateZ: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  >
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-40" style={{ color: themeColors.emptyText }} />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.emptyText }}>
                    No Active Statement
                  </h3>
                  <p className="text-sm max-w-sm" style={{ color: themeColors.emptySubtext }}>
                    Fact-checks will appear here when statements are detected during video playback
                  </p>
                  
                  {/* Stats indicator */}
                  <div className="mt-6 pt-4 border-t" style={{ borderColor: themeColors.emptyBorder }}>
                    <div className="flex justify-center gap-4 text-xs">
                      <span style={{ color: themeColors.emptySubtext }}>
                        {video.researchedStatements} of {video.totalStatements} statements checked
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <FactCheckSummary 
          //@ts-expect-error Ignore
            factChecks={video.timestamps
              .filter(ts => ts.factCheck)
              .map(ts => convertToLegacyFormat(ts)!)
              .filter(Boolean)
            }
            onDismiss={() => setShowSummary(false)}
            onClear={() => {}}
          />
        )}
      </AnimatePresence>
    </div>
  );
}