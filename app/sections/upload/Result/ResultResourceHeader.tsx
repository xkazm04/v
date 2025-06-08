import { Scale } from "lucide-react";
import { motion } from "framer-motion";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";

type Props = {
    supportingTotal: number;
    contradictingTotal: number;
    supportingPercentage: number | string;
    contradictingPercentage: number | string;
    totalSources: number;
}

const ResultResourceHeader = ({supportingTotal, contradictingTotal, supportingPercentage, contradictingPercentage, totalSources}: Props) => {
    const { colors, isDark } = useLayoutTheme();
    
    // Parse percentage strings (e.g., "80%" -> 80)
    const parseSupportingPercentage = typeof supportingPercentage === 'string' 
        ? parseFloat(supportingPercentage.replace('%', '')) 
        : supportingPercentage;
    
    const parseContradictingPercentage = typeof contradictingPercentage === 'string'
        ? parseFloat(contradictingPercentage.replace('%', ''))
        : contradictingPercentage;
    
    let calculatedTotal = totalSources;
    let actualSupportingCount = supportingTotal;
    let actualContradictingCount = contradictingTotal;
    
    if (totalSources === 0 || !totalSources) {
        if (supportingTotal > 0 && parseSupportingPercentage > 0) {
            calculatedTotal = Math.round((supportingTotal / parseSupportingPercentage) * 100);
        } else if (contradictingTotal > 0 && parseContradictingPercentage > 0) {
            calculatedTotal = Math.round((contradictingTotal / parseContradictingPercentage) * 100);
        } else {
            calculatedTotal = supportingTotal + contradictingTotal;
        }
    } else {
        actualSupportingCount = Math.round((parseSupportingPercentage / 100) * calculatedTotal);
        actualContradictingCount = Math.round((parseContradictingPercentage / 100) * calculatedTotal);
    }
    
    const displayTotal = calculatedTotal;
    const displaySupportingPercentage = parseSupportingPercentage;
    const displayContradictingPercentage = parseContradictingPercentage;
    
    return <div
        className="p-4 sm:p-6 border-b"
        style={{
            background: isDark
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.95) 100%)',
            borderColor: colors.border
        }}
    >
        <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-2 sm:gap-3 mb-4">
            <Scale className="h-5 w-5 sm:h-6 sm:w-6 mx-auto sm:mx-0" style={{ color: colors.primary }} />
            <h3 className="text-xl sm:text-2xl font-bold text-center sm:text-left" style={{ color: colors.foreground }}>
                Source Analysis
            </h3>
        </div>

        {/* Comparison Bar */}
        <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm font-medium gap-2">
                <span 
                    className="truncate"
                    style={{ color: isDark ? '#4ade80' : '#16a34a' }}
                >
                    Supporting ({actualSupportingCount})
                </span>
                <span 
                    className="truncate"
                    style={{ color: isDark ? '#f87171' : '#dc2626' }}
                >
                    Contradicting ({actualContradictingCount})
                </span>
            </div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full flex">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${displaySupportingPercentage}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        style={{
                            background: isDark
                                ? 'linear-gradient(to right, #16a34a, #22c55e)'
                                : 'linear-gradient(to right, #22c55e, #4ade80)'
                        }}
                    />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${displayContradictingPercentage}%` }}
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
                <span className="text-xs sm:text-sm" style={{ color: colors.mutedForeground }}>
                    {displayTotal} total sources analyzed
                </span>
            </div>
        </div>
    </div>
}

export default ResultResourceHeader;