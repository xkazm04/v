import { Scale } from "lucide-react";
import { motion } from "framer-motion";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";

type Props = {
    supportingTotal: number;
    contradictingTotal: number;
    supportingPercentage: number;
    contradictingPercentage: number;
    totalSources: number;
}

const ResultResourceHeader = ({supportingTotal, contradictingTotal, supportingPercentage, contradictingPercentage, totalSources}: Props) => {
    const { colors, isDark } = useLayoutTheme();
    return <div
        className="p-6 border-b"
        style={{
            background: isDark
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.95) 100%)',
            borderColor: colors.border
        }}
    >
        <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="h-6 w-6" style={{ color: colors.primary }} />
            <h3 className="text-2xl font-bold" style={{ color: colors.foreground }}>
                Source Analysis
            </h3>
        </div>

        {/* Comparison Bar */}
        <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
                <span style={{ color: isDark ? '#4ade80' : '#16a34a' }}>
                    Supporting ({supportingTotal})
                </span>
                <span style={{ color: isDark ? '#f87171' : '#dc2626' }}>
                    Contradicting ({contradictingTotal})
                </span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full flex">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${supportingPercentage}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        style={{
                            background: isDark
                                ? 'linear-gradient(to right, #16a34a, #22c55e)'
                                : 'linear-gradient(to right, #22c55e, #4ade80)'
                        }}
                    />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${contradictingPercentage}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        style={{
                            background: isDark
                                ? 'linear-gradient(to right, #dc2626, #ef4444)'
                                : 'linear-gradient(to right, #ef4444, #f87171)'
                        }}
                    />
                </div>
            </div>
            <div className="text-center">
                <span className="text-sm" style={{ color: colors.mutedForeground }}>
                    {totalSources} total sources analyzed
                </span>
            </div>
        </div>
    </div>

}

export default ResultResourceHeader;