import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoWithTimestamps, VideoTimestamp } from "@/app/types/video_api";
import { FactCheckCard } from "./FactCheckCard";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import FactCheckOverlayEmpty from "./FactCheckOverlayEmpty";
import FactCheckOverlayPending from "./FactCheckOverlayPending";

interface FactCheckOverlayProps {
  video: VideoWithTimestamps;
  isVideoPlaying: boolean;
  videoCurrentTime: number;
  className?: string;
}

// Data type for normalized fact check (for card/sections)
export interface NormalizedFactCheck {
  statement: string;
  status: string;
  verdict: string | null;
  category: string;
  correction?: string | null;
  sources?: {
    agreed?: any;
    disagreed?: any;
  };
  expertAnalysis?: Record<string, string>;
  // Add more fields as needed for UI, but keep minimal for mapping
}

export function FactCheckOverlay({
  video,
  isVideoPlaying,
  videoCurrentTime,
  className
}: FactCheckOverlayProps) {
  const { colors, isDark } = useLayoutTheme();

  const [showCard, setShowCard] = useState(false);
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
      setShowCard(true);
      setPreviousTimestamp(currentTimestamp);
    } else if (!currentTimestamp) {
      setShowCard(false);
      setPreviousTimestamp(null);
    }
  }, [currentTimestamp, previousTimestamp]);

  // Normalize factCheck for FactCheckCard and children
  const normalizeFactCheck = (timestamp: VideoTimestamp): NormalizedFactCheck | null => {
    if (!timestamp.factCheck) return null;
    return {
      statement: timestamp.statement,
      status: timestamp.factCheck.status || 'PENDING',
      verdict: timestamp.factCheck.verdict || null,
      category: timestamp.category || 'GENERAL',
      correction: timestamp.factCheck.correction,
      sources: timestamp.factCheck.sources,
      expertAnalysis: timestamp.factCheck.expertAnalysis
    };
  };

  return (
    <div className={`relative ${className} max-h-[1000px] overflow-y-auto`}>
      <div className="absolute inset-0 flex flex-col">
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
                className="absolute inset-4"
              >
                {currentTimestamp.factCheck ? (
                  <FactCheckCard
                    factCheck={normalizeFactCheck(currentTimestamp)!}
                    onDismiss={() => setShowCard(false)}
                    onExpertToggle={() => { }}
                    animationPhase="card"
                  />
                ) : (
                  <FactCheckOverlayPending
                    themeColors={{
                      emptyText: colors.foreground,
                      emptySubtext: isDark ? 'rgba(148, 163, 184, 0.7)' : 'rgba(100, 116, 139, 0.7)',
                      pendingBackground: isDark
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
                      pendingBorder: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
                      pendingAccent: isDark ? '#60a5fa' : '#2563eb'
                    }}
                    currentTimestamp={currentTimestamp}
                  />
                )}
              </motion.div>
            ) : (
              <FactCheckOverlayEmpty themeColors={{
                emptyBackground: isDark
                  ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(30, 41, 59, 0.6) 100%)'
                  : 'linear-gradient(135deg, rgba(248, 250, 252, 0.4) 0%, rgba(241, 245, 249, 0.6) 100%)',
                emptyBorder: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)',
                emptyText: colors.foreground,
                emptySubtext: isDark ? 'rgba(148, 163, 184, 0.7)' : 'rgba(100, 116, 139, 0.7)'
              }} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}