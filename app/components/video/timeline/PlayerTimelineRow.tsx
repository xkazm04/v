import { getSegmentColor } from "@/app/helpers/playerHelp";
import { formatTime } from "@/app/utils/format";
import { motion } from "framer-motion";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { Clock, Play } from "lucide-react";

type Props = {
    segment: {
        timestamp: number;
        claim: string;
        type: 'truth' | 'neutral' | 'lie';
    };
    onSeekToTimestamp?: (timestamp: number) => void;
    index: number;
    isActive?: boolean;
}

const PlayerTimelineRow = ({ 
    segment, 
    onSeekToTimestamp, 
    index, 
    isActive = false 
}: Props) => {
    const { colors, isDark, vintage, isVintage } = useLayoutTheme();

    // Enhanced vintage-aware color scheme
    const getRowColors = () => {
        const baseColors = {
            truth: isDark ? '#22c55e' : '#2d5016',
            lie: isDark ? '#ef4444' : '#8b1538', 
            neutral: isDark ? '#eab308' : '#92400e',
        };

        return {
            accent: baseColors[segment.type],
            background: isVintage 
                ? vintage.paper 
                : isDark 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.8)',
            hover: isVintage 
                ? vintage.highlight 
                : isDark 
                    ? 'rgba(255, 255, 255, 0.10)' 
                    : 'rgba(248, 250, 252, 0.9)',
        };
    };

    const rowColors = getRowColors();

    // Vintage paper texture
    const paperTexture = isVintage ? {
        backgroundImage: `
            radial-gradient(circle at 30% 40%, rgba(139, 69, 19, 0.015) 1px, transparent 1px),
            radial-gradient(circle at 70% 70%, rgba(160, 82, 45, 0.01) 1px, transparent 1px),
            linear-gradient(135deg, transparent 48%, rgba(139, 69, 19, 0.005) 50%, transparent 52%)
        `,
        backgroundSize: '25px 25px, 35px 35px, 100% 100%',
    } : {};

    return (
        <motion.div
            key={`${segment.timestamp}-${index}`}
            initial={{ opacity: 0, x: -25, scale: 0.95 }}
            animate={{ 
                opacity: 1, 
                x: 0, 
                scale: isActive ? 1.02 : 1 
            }}
            transition={{ 
                delay: 0.3 + index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 20
            }}
            whileHover={{ 
                scale: 1.02, 
                y: -3,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            className={`
                group cursor-pointer p-4 rounded-lg border relative overflow-hidden
                transition-all duration-300 select-none
                ${isActive ? 'ring-2 ring-opacity-50' : ''}
            `}
            style={{
                backgroundColor: isActive ? `${rowColors.accent}15` : rowColors.background,
                borderColor: isActive ? rowColors.accent : (isVintage ? vintage.crease : 'rgba(255, 255, 255, 0.1)'),
                ringColor: isActive ? rowColors.accent : 'transparent',
                boxShadow: isVintage 
                    ? `
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        0 2px 4px rgba(139, 69, 19, 0.1),
                        0 1px 2px rgba(139, 69, 19, 0.05)
                      `
                    : isDark 
                        ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                        : '0 2px 4px rgba(0, 0, 0, 0.1)',
                ...paperTexture,
            }}
            onClick={() => onSeekToTimestamp?.(segment.timestamp)}
        >
            {/* Vintage aging overlay */}
            {isVintage && (
                <div 
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                        backgroundImage: `
                            radial-gradient(ellipse at top right, rgba(139, 69, 19, 0.02), transparent 60%),
                            radial-gradient(ellipse at bottom left, rgba(160, 82, 45, 0.015), transparent 50%)
                        `,
                    }}
                />
            )}

            <div className="flex items-start gap-4 relative z-10">
                {/* Enhanced status indicator */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <motion.div
                        className="relative"
                        animate={isActive ? {
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                        } : {}}
                        transition={{
                            duration: 2,
                            repeat: isActive ? Infinity : 0,
                            ease: 'easeInOut'
                        }}
                    >
                        <div
                            className="w-3 h-3 rounded-full border-2"
                            style={{
                                backgroundColor: rowColors.accent,
                                borderColor: isVintage ? vintage.aged : rowColors.accent,
                                boxShadow: isVintage 
                                    ? `0 2px 4px rgba(139, 69, 19, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)`
                                    : `0 0 8px ${rowColors.accent}40`,
                            }}
                        >
                            {/* Vintage metallic shine */}
                            {isVintage && (
                                <div 
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%, rgba(0, 0, 0, 0.1) 100%)'
                                    }}
                                />
                            )}
                        </div>
                        
                        {isActive && (
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 opacity-70"
                                style={{ borderColor: rowColors.accent }}
                                animate={{
                                    scale: [1, 2, 1],
                                    opacity: [0.7, 0, 0.7]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                            />
                        )}
                    </motion.div>

                    {/* Vintage timestamp badge */}
                    <motion.div
                        className="flex items-center gap-2 px-3 py-1 rounded-full border"
                        style={{
                            backgroundColor: isVintage ? vintage.highlight : 'rgba(0, 0, 0, 0.1)',
                            borderColor: isVintage ? vintage.sepia : colors.border,
                            boxShadow: isVintage 
                                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 2px rgba(139, 69, 19, 0.1)'
                                : 'none'
                        }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Clock size={12} style={{ color: isVintage ? vintage.faded : colors.mutedForeground }} />
                        <span 
                            className="text-xs font-mono font-medium"
                            style={{ 
                                color: isVintage ? vintage.faded : colors.mutedForeground,
                                fontFamily: isVintage ? '"Courier New", monospace' : 'inherit'
                            }}
                        >
                            {formatTime(segment.timestamp)}
                        </span>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p 
                        className="text-sm leading-relaxed font-medium group-hover:text-opacity-90 transition-colors"
                        style={{ 
                            color: isVintage ? vintage.ink : colors.foreground,
                            fontFamily: isVintage ? '"Times New Roman", serif' : 'inherit',
                            textShadow: isVintage ? '0 1px 1px rgba(139, 69, 19, 0.1)' : 'none'
                        }}
                    >
                        {segment.claim}
                    </p>
                </div>

                {/* Play button */}
                <motion.div
                    className="flex items-center justify-center w-8 h-8 rounded-full border opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                        backgroundColor: isVintage ? vintage.paper : colors.background,
                        borderColor: rowColors.accent,
                        color: rowColors.accent,
                        boxShadow: isVintage 
                            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 2px 4px rgba(139, 69, 19, 0.1)'
                            : 'none'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Play size={12} />
                </motion.div>
            </div>

            {/* Enhanced hover effect */}
            <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                    background: isVintage 
                        ? `linear-gradient(135deg, ${rowColors.accent}08 0%, ${rowColors.accent}04 100%)`
                        : `linear-gradient(135deg, ${rowColors.accent}15 0%, ${rowColors.accent}05 100%)`
                }}
            />

            {/* Active indicator stripe */}
            {isActive && (
                <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                    style={{ backgroundColor: rowColors.accent }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.3 }}
                />
            )}
        </motion.div>
    );
};

export default PlayerTimelineRow;