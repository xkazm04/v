import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { formatTime } from '@/app/utils/format';
import { motion } from 'framer-motion';

type Props = {
    claim: {
        id: string;
        claim: string;
        type: 'truth' | 'lie' | 'neutral';
        confidence: number;
        timestamp: number;
    };
    timelineColors: {
        border: string;
    };
    index: number;
    isActive?: boolean;
    onSeek?: (timestamp: number) => void;
}

const TimelineClaimItem = ({ 
    claim, 
    timelineColors, 
    index, 
    isActive = false,
    onSeek
}: Props) => {
    const { colors, isDark, vintage, isVintage } = useLayoutTheme();

    // Enhanced vintage-aware color scheme
    const getClaimColors = () => {
        const baseColors = {
            truth: isDark ? '#22c55e' : '#2d5016', // Dark green for vintage
            lie: isDark ? '#ef4444' : '#8b1538', // Deep red for vintage
            neutral: isDark ? '#eab308' : '#92400e', // Amber brown for vintage
        };

        const backgrounds = {
            truth: isDark 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(240, 253, 244, 0.8)', // Soft green paper
            lie: isDark 
                ? 'rgba(239, 68, 68, 0.1)' 
                : 'rgba(254, 242, 242, 0.8)', // Soft red paper
            neutral: isDark 
                ? 'rgba(234, 179, 8, 0.1)' 
                : 'rgba(255, 251, 235, 0.8)', // Soft amber paper
        };

        return {
            color: baseColors[claim.type],
            background: backgrounds[claim.type],
            dotColor: baseColors[claim.type],
        };
    };

    const claimColors = getClaimColors();

    // Vintage paper-like styling
    const paperEffects = isVintage ? {
        backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.015) 1px, transparent 1px),
            linear-gradient(135deg, transparent 48%, rgba(139, 69, 19, 0.01) 50%, transparent 52%)
        `,
        backgroundSize: '20px 20px, 30px 30px, 100% 100%',
        filter: 'sepia(0.05) contrast(1.02)',
        boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            0 2px 4px rgba(139, 69, 19, 0.1),
            0 1px 2px rgba(139, 69, 19, 0.05)
        `,
    } : {};

    const handleClick = () => {
        if (onSeek && typeof claim.timestamp === 'number') {
            onSeek(claim.timestamp);
        }
    };

    return (
        <motion.div
            key={claim.id}
            initial={{ opacity: 0, x: -15, scale: 0.95 }}
            animate={{ 
                opacity: 1, 
                x: 0, 
                scale: isActive ? 1.02 : 1,
            }}
            transition={{ 
                delay: index * 0.08,
                type: "spring",
                stiffness: 300,
                damping: 25
            }}
            whileHover={{ 
                scale: 1.02, 
                y: -2,
                transition: { duration: 0.2 }
            }}
            onClick={handleClick}
            className={`
                flex items-start space-x-3 p-3 rounded-lg border transition-all duration-300 
                cursor-pointer group relative overflow-hidden
            `}
            style={{
                backgroundColor: isActive 
                    ? claimColors.background 
                    : isDark 
                        ? 'rgba(51, 65, 85, 0.3)' 
                        : vintage.paper,
                borderColor: isActive 
                    ? claimColors.color 
                    : timelineColors.border,
                ...paperEffects,
            }}
        >
            {/* Vintage paper aging effect for light mode */}
            {isVintage && (
                <div 
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                        backgroundImage: `
                            radial-gradient(ellipse at top left, rgba(139, 69, 19, 0.03), transparent 50%),
                            radial-gradient(ellipse at bottom right, rgba(160, 82, 45, 0.02), transparent 60%)
                        `,
                    }}
                />
            )}

            {/* Enhanced status indicator */}
            <motion.div
                className="flex-shrink-0 mt-1 relative"
                animate={isActive ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                } : {}}
                transition={{
                    duration: 2,
                    repeat: isActive ? Infinity : 0,
                    ease: 'easeInOut'
                }}
            >
                <div
                    className="w-3 h-3 rounded-full border-2 relative overflow-hidden"
                    style={{
                        backgroundColor: claimColors.dotColor,
                        borderColor: isDark ? claimColors.dotColor : vintage.aged,
                        boxShadow: isVintage 
                            ? `0 2px 4px rgba(139, 69, 19, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)`
                            : `0 0 8px ${claimColors.dotColor}40`,
                    }}
                >
                    {/* Vintage metallic shine effect */}
                    {isVintage && (
                        <div 
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%, rgba(0, 0, 0, 0.1) 100%)'
                            }}
                        />
                    )}
                </div>

                {/* Active pulse effect */}
                {isActive && (
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 opacity-70"
                        style={{ borderColor: claimColors.dotColor }}
                        animate={{
                            scale: [1, 1.8, 1],
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

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p
                    className="text-sm leading-relaxed font-medium mb-2 group-hover:text-opacity-90 transition-colors"
                    style={{ 
                        color: isVintage ? vintage.ink : colors.foreground,
                        fontFamily: isVintage ? '"Times New Roman", serif' : 'inherit',
                        textShadow: isVintage ? '0 1px 1px rgba(139, 69, 19, 0.1)' : 'none'
                    }}
                >
                    {claim.claim}
                </p>
                
                <div className="flex items-center justify-between">
                    {/* Confidence badge with vintage styling */}
                    <motion.span
                        className="text-xs font-semibold px-2 py-1 rounded-full border"
                        style={{
                            color: claimColors.color,
                            backgroundColor: isVintage 
                                ? 'rgba(255, 255, 255, 0.6)'
                                : `${claimColors.color}15`,
                            borderColor: `${claimColors.color}30`,
                            fontFamily: isVintage ? '"Times New Roman", serif' : 'inherit',
                            boxShadow: isVintage 
                                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 2px rgba(139, 69, 19, 0.1)'
                                : 'none'
                        }}
                        whileHover={{ scale: 1.05 }}
                    >
                        {claim.confidence}% confidence
                    </motion.span>
                    
                    {/* Timestamp with vintage typewriter styling */}
                    <span 
                        className="text-xs font-mono"
                        style={{ 
                            color: isVintage ? vintage.faded : colors.mutedForeground,
                            fontFamily: isVintage ? '"Courier New", monospace' : 'inherit',
                            textShadow: isVintage ? '0 1px 1px rgba(139, 69, 19, 0.1)' : 'none'
                        }}
                    >
                        {formatTime(claim.timestamp)}
                    </span>
                </div>
            </div>

            {/* Hover effect overlay */}
            <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                    background: isVintage 
                        ? 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 0%, rgba(160, 82, 45, 0.02) 100%)'
                        : 'linear-gradient(135deg, rgba(96, 165, 250, 0.03) 0%, rgba(147, 51, 234, 0.02) 100%)'
                }}
            />
        </motion.div>
    );
};

export default TimelineClaimItem;