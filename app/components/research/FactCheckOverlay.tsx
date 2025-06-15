"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoWithTimestamps, VideoTimestamp } from "@/app/types/video_api";
import { FactCheckCard } from "./FactCheckCard";
import { FactCheckSummary } from "./FactCheckSummary";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import FactCheckOverlayEmpty from "./FactCheckOverlayEmpty";
import FactCheckOverlayPending from "./FactCheckOverlayPending";

interface FactCheckOverlayProps {
  video: VideoWithTimestamps;
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
      //@ts-expect-error Ignore
      resources_agreed: timestamp.factCheck.sources.agreed, resources_disagreed: timestamp.factCheck.sources.disagreed,
      experts: timestamp.factCheck.expertAnalysis,
      research_method: 'comprehensive_analysis',
      profile_id: 'current_user'
    };
  };

  return (
    <div className={`relative ${className} max-h-[1000px]`}>
      {/* Content Container - Full size */}
      <div className="absolute inset-0 flex flex-col">
        {/* Main Content Area - Full height, no position changes */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {currentTimestamp && showCard ? (
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
                    onExpertToggle={() => { }}
                    animationPhase="card"
                  />
                ) : (
                  // Pending statement card
                  <FactCheckOverlayPending
                    themeColors={themeColors}
                    currentTimestamp={currentTimestamp}
                    />
                )}
              </motion.div >
            ) : (
              <FactCheckOverlayEmpty themeColors={themeColors} />
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
            onClear={() => { }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}