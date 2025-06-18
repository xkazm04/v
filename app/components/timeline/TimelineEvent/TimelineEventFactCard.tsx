import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { Eye, EyeOff, Hash, FileText } from 'lucide-react';
import {motion} from 'framer-motion';
import { EventType } from '@/app/types/timeline';

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
    >
        {/* Subtle Gradient Overlay */}
        <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
                background: isActive
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
                borderColor: isActive ? colors.primary : neutralColors.border,
                color: isActive ? colors.primary : neutralColors.accent
            }}
            animate={{
                scale: isActive ? [1, 1.05, 1] : 1,
                borderColor: isActive ? colors.primary : neutralColors.border
            }}
            transition={{
                duration: isActive ? 1.5 : 0,
                repeat: isActive ? Infinity : 0,
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
                color: isActive ? colors.primary : neutralColors.text
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {event.title}
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
                style={{ backgroundColor: isActive ? colors.primary : neutralColors.accent }}
                animate={{
                    scale: isActive ? [1, 1.3, 1] : 1,
                    opacity: isActive ? [0.7, 1, 0.7] : 0.8
                }}
                transition={{
                    duration: isActive ? 1.5 : 0,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut"
                }}
            />
            <FileText
                className={`${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}`}
                style={{ color: isActive ? colors.primary : neutralColors.accent }}
            />
            <span
                className={`font-medium uppercase tracking-wide ${isMobile ? 'text-xs' : 'text-xs'
                    }`}
                style={{ color: isActive ? colors.primary : neutralColors.accent }}
            >
                Factual
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

        {/* Opinions Count Badge - Redesigned */}
        {!showAllOpinions && event.all_opinions.length > 0 && (
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