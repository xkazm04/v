import { STAT_CONFIG } from "@/app/constants/stat";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion } from "framer-motion";
import StatCard from "../../ui/Dashboard/StatCard";

type Props = {
    showStats: boolean;
    colors_enhanced: {
        border: string;
    };
    stats: {
        completionRate: number;
        truthCount: number;
        neutralCount: number;
        lieCount: number;
        avgConfidence: number;
    };
}


const TimelineClaimListStats = ({ showStats, colors_enhanced, stats }: Props) => {
    const { isDark, colors } = useLayoutTheme();

    if (!showStats) return null;

    return (
        <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* ✅ LEAN: Single row layout with dividers instead of borders */}
            <div
                className="flex rounded-lg overflow-hidden border"
                style={{
                    backgroundColor: isDark ? colors.card.background : colors.background,
                    borderColor: colors_enhanced.border
                }}
            >
                {(stats.truthCount + stats.neutralCount + stats.lieCount) > 0 && (
                    <motion.div
                        className="flex items-center gap-2 px-3 py-1 rounded-md border"
                        style={{
                            backgroundColor: isDark ? colors.card.background : colors.background,
                            borderColor: colors_enhanced.border
                        }}
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                    >
                        <span
                            className="text font-medium"
                            style={{ color: colors.mutedForeground }}
                        >
                            Total: {stats.truthCount + stats.neutralCount + stats.lieCount} claims
                        </span>

                        <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => {
                                const completion = stats.completionRate;
                                const isActive = i < Math.floor(completion / 20);
                                return (
                                    <motion.div
                                        key={i}
                                        className="w-1 h-1 rounded-full"
                                        style={{
                                            backgroundColor: isActive
                                                ? colors.primary
                                                : isDark
                                                    ? 'rgba(255, 255, 255, 0.2)'
                                                    : colors.border
                                        }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.4 + i * 0.05 }}
                                    />
                                );
                            })}
                        </div>
                    </motion.div>
                )}
                {STAT_CONFIG.map((config, index) => (
                    <StatCard
                        key={config.key}
                        config={config}
                        value={stats[config.key]}
                        isDark={isDark}
                        isLast={index === STAT_CONFIG.length - 1}
                        index={index}
                    />
                ))}

            </div>
        </motion.div>
    );
};

export default TimelineClaimListStats;