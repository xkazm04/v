import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { Eye, EyeOff, Hash, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventType } from '@/app/types/timeline';
import { useTimelineAudioStore } from '@/app/stores/useTimelineAudioStore';
import { FloatingVerdictIcon } from '@/app/components/ui/Decorative/FloatingVerdictIcon';
import { useEffect } from 'react';

type Props = {
    className?: string;
    isActive: boolean;
    showAllOpinions: boolean;
    setShowAllOpinions: (value: boolean) => void;
    event: EventType;
    eventIndex: number;
}

const TimelineEventFactCard = ({ className = "", isActive, showAllOpinions, setShowAllOpinions, event, eventIndex }: Props) => {
    const { colors, isDark } = useLayoutTheme();
    const { isMobile, isTablet } = useViewport();
    const { 
        currentTrack, 
        isPlaying, 
        currentTime, 
        duration, 
        getTrackByProgressId 
    } = useTimelineAudioStore();
    
    // Get the track for this event using the proper lookup
    const eventTrack = getTrackByProgressId(event.id);
    
    // Check if this event is currently playing
    const isEventPlaying = eventTrack && currentTrack?.id === eventTrack.id && isPlaying;
    const audioProgress = duration > 0 ? (currentTime / duration) * 100 : 0;
    
    // Debug logging for track transitions
    useEffect(() => {
        if (isEventPlaying) {
            console.log(`Event ${event.id} is now playing:`, {
                eventTrack,
                currentTrack: currentTrack?.id,
                isPlaying,
                audioProgress: Math.round(audioProgress)
            });
        }
    }, [isEventPlaying, event.id, eventTrack, currentTrack, isPlaying, audioProgress]);
    
    const neutralColors = {
        background: isDark ? 'rgba(30, 35, 42, 0.95)' : 'rgba(248, 250, 252, 0.95)',
        border: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(156, 163, 175, 0.3)',
        text: isDark ? 'rgba(229, 231, 235, 0.95)' : 'rgba(55, 65, 81, 0.95)',
        accent: isDark ? 'rgba(156, 163, 175, 0.6)' : 'rgba(107, 114, 128, 0.6)'
    };
    
    return <motion.div
        className={`relative rounded-2xl border backdrop-blur-md transition-all duration-500 ${isMobile ? 'p-4' : isTablet ? 'p-5' : 'p-6'
            } ${className}`}
        style={{
            backgroundColor: isActive
                ? `${neutralColors.background}dd`
                : neutralColors.background,
            borderColor: isActive ? colors.primary + '60' : neutralColors.border,
            borderWidth: '2px',
            boxShadow: isActive
                ? `0 20px 40px ${colors.primary}15, 0 0 0 1px ${colors.primary}20, inset 0 1px 0 rgba(255,255,255,0.1)`
                : `0 8px 24px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}, inset 0 1px 0 rgba(255,255,255,0.05)`,
            zIndex: 20
        }}
        animate={{
            borderColor: isEventPlaying ? colors.primary : (isActive ? colors.primary + '60' : neutralColors.border),
            boxShadow: isEventPlaying 
                ? `0 20px 40px ${colors.primary}25, 0 0 0 2px ${colors.primary}40, inset 0 1px 0 rgba(255,255,255,0.1)`
                : isActive
                    ? `0 20px 40px ${colors.primary}15, 0 0 0 1px ${colors.primary}20, inset 0 1px 0 rgba(255,255,255,0.1)`
                    : `0 8px 24px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}, inset 0 1px 0 rgba(255,255,255,0.05)`
        }}
        transition={{ duration: 0.3 }}
    >
        {/* Subtle Gradient Overlay */}
        <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
                background: isEventPlaying
                    ? `linear-gradient(135deg, ${colors.primary}15, transparent, ${colors.primary}15)`
                    : isActive
                        ? `linear-gradient(135deg, ${colors.primary}08, transparent, ${colors.primary}08)`
                        : 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent, rgba(255,255,255,0.03))'
            }}
        />

        {/* Event Number Badge */}
        <motion.div
            className={`absolute -top-2.5 left-5 rounded-full border-2 flex items-center justify-center font-bold ${isMobile ? 'w-6 h-6 text-xs' : 'w-7 h-7 text-sm'
                }`}
            style={{
                backgroundColor: neutralColors.background,
                borderColor: isEventPlaying ? colors.primary : (isActive ? colors.primary : neutralColors.border),
                color: isEventPlaying ? colors.primary : (isActive ? colors.primary : neutralColors.accent)
            }}
            animate={{
                scale: isEventPlaying ? [1, 1.1, 1] : (isActive ? [1, 1.05, 1] : 1),
                borderColor: isEventPlaying ? colors.primary : (isActive ? colors.primary : neutralColors.border)
            }}
            transition={{
                duration: isEventPlaying ? 1.2 : (isActive ? 1.5 : 0),
                repeat: isEventPlaying ? Infinity : (isActive ? Infinity : 0),
                ease: "easeInOut"
            }}
        >
            <Hash className={isMobile ? "w-2.5 h-2.5" : "w-3 h-3"} />
        </motion.div>

        {/* Event Title - Compact Typography */}
        <motion.h3
            className={`font-semibold mb-3 pr-8 leading-snug ${isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'
                }`}
            style={{ color: neutralColors.text }}
            animate={{
                color: isEventPlaying ? colors.primary : (isActive ? colors.primary : neutralColors.text)
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {event.title}
            {isEventPlaying && (
                <motion.span
                    className="ml-2 text-sm"
                    style={{ color: colors.primary }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    ♪
                </motion.span>
            )}
        </motion.h3>

        {/* Facts Badge - Minimal */}
        <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: eventIndex * 0.08 + 0.2, duration: 0.4 }}
        >
            <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: isEventPlaying ? colors.primary : (isActive ? colors.primary : neutralColors.accent) }}
                animate={{
                    scale: isEventPlaying ? [1, 1.4, 1] : (isActive ? [1, 1.3, 1] : 1),
                    opacity: isEventPlaying ? [0.7, 1, 0.7] : (isActive ? [0.7, 1, 0.7] : 0.8)
                }}
                transition={{
                    duration: isEventPlaying ? 1.2 : (isActive ? 1.5 : 0),
                    repeat: isEventPlaying ? Infinity : (isActive ? Infinity : 0),
                    ease: "easeInOut"
                }}
            />
            <FileText
                className={`${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}`}
                style={{ color: isEventPlaying ? colors.primary : (isActive ? colors.primary : neutralColors.accent) }}
            />
            <span
                className={`font-medium uppercase tracking-wide ${isMobile ? 'text-xs' : 'text-xs'
                    }`}
                style={{ color: isEventPlaying ? colors.primary : (isActive ? colors.primary : neutralColors.accent) }}
            >
                {isEventPlaying ? 'Playing' : 'Factual'}
            </span>
        </motion.div>

        {/* Toggle Button - Enhanced */}
        <motion.button
            className={`absolute top-3 right-3 rounded-full border backdrop-blur-sm transition-all duration-300 ${isMobile ? 'p-1.5' : 'p-2'
                }`}
            style={{
                backgroundColor: showAllOpinions ? colors.primary + '20' : neutralColors.background,
                borderColor: showAllOpinions ? colors.primary : neutralColors.border
            }}
            onClick={() => setShowAllOpinions && setShowAllOpinions(!showAllOpinions)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={'Expert opinions'}
        >
            {showAllOpinions ? (
                <EyeOff className={isMobile ? "w-3 h-3" : "w-3.5 h-3.5"} style={{ color: colors.primary }} />
            ) : (
                <Eye className={isMobile ? "w-3 h-3" : "w-3.5 h-3.5"} style={{ color: neutralColors.accent }} />
            )}
        </motion.button>

        {/* FloatingVerdictIcon - Show when event is playing */}
        <AnimatePresence>
            {isEventPlaying && (
                <motion.div
                    className="absolute -bottom-2 -right-2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 200, 
                        damping: 20 
                    }}
                >
                    <FloatingVerdictIcon
                        size="xs"
                        confidence={Math.round(audioProgress)}
                        showConfidenceRing={true}
                        autoAnimate={true}
                        colors={{
                            glowColor: colors.primary,
                            ringColor: colors.primary,
                            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(248, 250, 252, 0.9)'
                        }}
                        className="z-30"
                    />
                </motion.div>
            )}
        </AnimatePresence>

        {/* Opinions Count Badge - Redesigned */}
        {!showAllOpinions && event.all_opinions.length > 0 && !isEventPlaying && (
            <motion.div
                className={`absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 px-2.5 py-1 rounded-full font-medium border ${isMobile ? 'text-xs' : 'text-xs'
                    }`}
                style={{
                    backgroundColor: neutralColors.background,
                    borderColor: neutralColors.border,
                    color: neutralColors.accent
                }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3, ease: "backOut" }}
                whileHover={{
                    scale: 1.05,
                    borderColor: colors.primary,
                    color: colors.primary
                }}
            >
                +{event.all_opinions.length} expert opinions
            </motion.div>
        )}
    </motion.div>
}

export default TimelineEventFactCard