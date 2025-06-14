import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion } from "framer-motion"
import { Calendar, TrendingUp, User } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { LLMResearchResponse } from "@/app/types/research";
import { getCountryName } from "@/app/helpers/countries";

type Props = {
    displayResult: LLMResearchResponse
}

const ResultOverviewMetadata = ({ displayResult }: Props) => {
    const { colors, isDark } = useLayoutTheme();
    return <>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm"
        >
            <div className="flex items-center gap-2">
                <User className="h-4 w-4" style={{ color: colors.mutedForeground }} />
                <span style={{ color: colors.mutedForeground }}>
                    <strong>Source:</strong> {displayResult.request_source}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" style={{ color: colors.mutedForeground }} />
                <span style={{ color: colors.mutedForeground }}>
                    {new Date(displayResult.request_datetime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" style={{ color: colors.mutedForeground }} />
                <span style={{ color: colors.mutedForeground }}>
                    {displayResult.valid_sources} sources
                </span>
            </div>

            {displayResult.category && (
                <Badge
                    className={`text-xs font-semibold`}
                    style={{
                        background: isDark ? 'rgba(71, 85, 105, 0.2)' : 'rgba(248, 250, 252, 0.8)',
                        color: colors.foreground,
                        border: `1px solid ${colors.border}`
                    }}
                >
                    {displayResult.category.charAt(0).toUpperCase() + displayResult.category.slice(1)}
                </Badge>
            )}

            {displayResult.country && (
                <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                        background: isDark ? 'rgba(71, 85, 105, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                        color: colors.foreground,
                        border: `1px solid ${colors.border}`
                    }}
                >
                    🌍 {getCountryName(displayResult.country)}
                </Badge>
            )}
        </motion.div>
    </>
}

export default ResultOverviewMetadata;