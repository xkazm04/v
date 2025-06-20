import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion } from "framer-motion";
import { BookOpen } from 'lucide-react';

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

const TimelineClaimListStats = ({showStats, colors_enhanced, stats}: Props) => {
      const { colors, vintage, isVintage } = useLayoutTheme();
    return <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
    >
        {/* Title */}
        <div className="flex items-center justify-between">
            <h3
                className="text-lg font-bold flex items-center gap-2"
                style={{
                    color: isVintage ? vintage.ink : colors.foreground,
                    fontFamily: isVintage ? '"Times New Roman", serif' : 'inherit'
                }}
            >
                <BookOpen size={20} style={{ color: colors.primary }} />
                List of statements
            </h3>
        </div>

        {/* Statistics row */}
        {showStats && (
            <div className="grid grid-cols-4 gap-3">
                <motion.div
                    className="text-center p-2 rounded-lg border"
                    style={{
                        backgroundColor: isVintage ? 'rgba(240, 253, 244, 0.6)' : 'rgba(34, 197, 94, 0.1)',
                        borderColor: isVintage ? '#2d5016' : '#22c55e',
                        boxShadow: isVintage ? 'inset 0 1px 0 rgba(255, 255, 255, 0.3)' : 'none'
                    }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div
                        className="text-lg font-bold"
                        style={{ color: isVintage ? '#2d5016' : '#22c55e' }}
                    >
                        {stats.truthCount}
                    </div>
                    <div
                        className="text-sm"
                        style={{
                            color: isVintage ? vintage.faded : colors.mutedForeground,
                            fontFamily: isVintage ? '"Times New Roman", serif' : 'inherit'
                        }}
                    >
                        Truth
                    </div>
                </motion.div>

                <motion.div
                    className="text-center p-2 rounded-lg border"
                    style={{
                        backgroundColor: isVintage ? 'rgba(255, 251, 235, 0.6)' : 'rgba(234, 179, 8, 0.1)',
                        borderColor: isVintage ? '#92400e' : '#eab308',
                        boxShadow: isVintage ? 'inset 0 1px 0 rgba(255, 255, 255, 0.3)' : 'none'
                    }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div
                        className="text-lg font-bold"
                        style={{ color: isVintage ? '#92400e' : '#eab308' }}
                    >
                        {stats.neutralCount}
                    </div>
                    <div
                        className="text-sm"
                        style={{
                            color: isVintage ? vintage.faded : colors.mutedForeground,
                            fontFamily: isVintage ? '"Times New Roman", serif' : 'inherit'
                        }}
                    >
                        Neutral
                    </div>
                </motion.div>

                <motion.div
                    className="text-center p-2 rounded-lg border"
                    style={{
                        backgroundColor: isVintage ? 'rgba(254, 242, 242, 0.6)' : 'rgba(239, 68, 68, 0.1)',
                        borderColor: isVintage ? '#8b1538' : '#ef4444',
                        boxShadow: isVintage ? 'inset 0 1px 0 rgba(255, 255, 255, 0.3)' : 'none'
                    }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div
                        className="text-lg font-bold"
                        style={{ color: isVintage ? '#8b1538' : '#ef4444' }}
                    >
                        {stats.lieCount}
                    </div>
                    <div
                        className="text-sm"
                        style={{
                            color: isVintage ? vintage.faded : colors.mutedForeground,
                            fontFamily: isVintage ? '"Times New Roman", serif' : 'inherit'
                        }}
                    >
                        False
                    </div>
                </motion.div>

                <motion.div
                    className="text-center p-2 rounded-lg border"
                    style={{
                        backgroundColor: isVintage ? vintage.highlight : colors.muted,
                        borderColor: colors_enhanced.border,
                        boxShadow: isVintage ? 'inset 0 1px 0 rgba(255, 255, 255, 0.3)' : 'none'
                    }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div
                        className="text-lg font-bold"
                        style={{ color: colors.primary }}
                    >
                        {stats.avgConfidence}%
                    </div>
                    <div
                        className="text-sm"
                        style={{
                            color: isVintage ? vintage.faded : colors.mutedForeground,
                            fontFamily: isVintage ? '"Times New Roman", serif' : 'inherit'
                        }}
                    >
                        Confidence
                    </div>
                </motion.div>
            </div>
        )}
    </motion.div>
}

export default TimelineClaimListStats;