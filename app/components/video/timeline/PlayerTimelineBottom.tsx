import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { FactCheckResult } from "@/app/types/video";
import { ChevronDown, BarChart3, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
    factCheck: FactCheckResult;
    isExpanded: boolean;
    handleToggleExpansion: () => void;
    setShowTimeline: (show: boolean) => void;
}

const PlayerTimelineBottom = ({ factCheck, setShowTimeline }: Props) => {
    const { colors, isDark, vintage, isVintage } = useLayoutTheme();

    // Enhanced vintage-aware styling
    const bottomBarStyle = {
        background: isVintage 
            ? `linear-gradient(135deg, ${vintage.aged} 0%, ${vintage.paper} 50%, ${vintage.highlight} 100%)`
            : isDark 
                ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)'
                : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.98) 100%)',
        borderTop: isVintage 
            ? `2px solid ${vintage.crease}`
            : `1px solid ${colors.border}`,
        boxShadow: isVintage 
            ? `
                inset 0 2px 4px rgba(139, 69, 19, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                0 -2px 8px rgba(139, 69, 19, 0.05)
              `
            : isDark 
                ? '0 -4px 6px -1px rgba(0, 0, 0, 0.1)'
                : '0 -2px 4px rgba(0, 0, 0, 0.05)',
    };

    // Vintage paper texture for light mode
    const paperTexture = isVintage ? {
        backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(160, 82, 45, 0.015) 1px, transparent 1px),
            linear-gradient(135deg, transparent 47%, rgba(139, 69, 19, 0.01) 49%, rgba(139, 69, 19, 0.01) 51%, transparent 53%)
        `,
        backgroundSize: '15px 15px, 20px 20px, 100% 100%',
    } : {};

    const stats = [
        {
            key: 'truth',
            value: factCheck.truthPercentage || 0,
            label: 'Truth',
            icon: CheckCircle,
            color: isVintage ? '#2d5016' : '#22c55e',
            bgColor: isVintage ? 'rgba(45, 80, 22, 0.1)' : 'rgba(34, 197, 94, 0.1)',
        },
        {
            key: 'neutral',
            value: factCheck.neutralPercentage || 0,
            label: 'Neutral',
            icon: AlertTriangle,
            color: isVintage ? '#92400e' : '#eab308',
            bgColor: isVintage ? 'rgba(146, 64, 14, 0.1)' : 'rgba(234, 179, 8, 0.1)',
        },
        {
            key: 'misleading',
            value: factCheck.misleadingPercentage || 0,
            label: 'False',
            icon: XCircle,
            color: isVintage ? '#8b1538' : '#ef4444',
            bgColor: isVintage ? 'rgba(139, 21, 56, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        }
    ];

    return (
        <motion.div
            className="relative overflow-hidden"
            style={{
                ...bottomBarStyle,
                ...paperTexture,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            {/* Vintage aging overlay */}
            {isVintage && (
                <>
                    {/* Paper aging gradients */}
                    <div 
                        className="absolute inset-0 pointer-events-none opacity-40"
                        style={{
                            backgroundImage: `
                                radial-gradient(ellipse at 10% 10%, rgba(139, 69, 19, 0.03), transparent 40%),
                                radial-gradient(ellipse at 90% 90%, rgba(160, 82, 45, 0.02), transparent 50%),
                                radial-gradient(ellipse at 50% 100%, rgba(139, 69, 19, 0.015), transparent 60%)
                            `,
                        }}
                    />
                    
                    {/* Vintage newspaper fold lines */}
                    <div 
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: `
                                linear-gradient(90deg, transparent 0%, rgba(139, 69, 19, 0.1) 1px, transparent 2px),
                                linear-gradient(0deg, transparent 0%, rgba(139, 69, 19, 0.05) 1px, transparent 2px)
                            `,
                            backgroundSize: '80px 40px',
                        }}
                    />
                </>
            )}

            <div className="flex justify-between items-center px-5 py-3 relative z-10">
                {/* Enhanced statistics with vintage newspaper style */}
                <div className="flex items-center gap-4">
                    {/* Summary icon */}
                    <motion.div
                        className="flex items-center justify-center w-8 h-8 rounded-full border-2"
                        style={{
                            backgroundColor: isVintage ? vintage.highlight : colors.muted,
                            borderColor: isVintage ? vintage.sepia : colors.border,
                            boxShadow: isVintage 
                                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 2px 4px rgba(139, 69, 19, 0.1)'
                                : 'none'
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <BarChart3 
                            size={16} 
                            style={{ 
                                color: isVintage ? vintage.ink : colors.foreground 
                            }} 
                        />
                    </motion.div>

                    {/* Statistics */}
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.key}
                            className="flex items-center gap-2 px-2 py-1 rounded-lg border"
                            style={{
                                backgroundColor: stat.bgColor,
                                borderColor: `${stat.color}30`,
                                boxShadow: isVintage 
                                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 1px 2px rgba(139, 69, 19, 0.05)'
                                    : 'none'
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <stat.icon 
                                size={12} 
                                style={{ color: stat.color }}
                            />
                            <span 
                                className="text-xs font-bold"
                                style={{ 
                                    color: stat.color,
                                    fontFamily: isVintage ? '"Times New Roman", serif' : 'inherit'
                                }}
                            >
                                {stat.value}%
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Enhanced close button with vintage styling */}
                <motion.button
                    className="flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200"
                    style={{
                        backgroundColor: isVintage ? vintage.paper : colors.background,
                        borderColor: isVintage ? vintage.sepia : colors.border,
                        color: isVintage ? vintage.ink : colors.foreground,
                        boxShadow: isVintage 
                            ? `
                                inset 0 1px 0 rgba(255, 255, 255, 0.4),
                                0 2px 4px rgba(139, 69, 19, 0.15),
                                0 1px 2px rgba(139, 69, 19, 0.1)
                              `
                            : isDark 
                                ? '0 2px 4px rgba(0, 0, 0, 0.2)'
                                : '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                    onClick={() => setShowTimeline(false)}
                    whileHover={{ 
                        scale: 1.1, 
                        rotate: 180,
                        backgroundColor: isVintage ? vintage.highlight : undefined
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={16} />
                </motion.button>
            </div>

            {/* Vintage embossed edge effect */}
            {isVintage && (
                <div 
                    className="absolute bottom-0 left-0 right-0 h-px opacity-60"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${vintage.crease}, transparent)`,
                        boxShadow: `0 1px 0 ${vintage.highlight}`
                    }}
                />
            )}
        </motion.div>
    );
};

export default PlayerTimelineBottom;