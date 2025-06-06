import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion } from "framer-motion"
import { Calendar, TrendingUp, User } from "lucide-react";
import { getCategoryIcon, getCountryName, getCategoryColor } from '@/app/helpers/researchResultHelpers';
import { Badge } from "@/app/components/ui/badge";
import { ResearchResponse } from "../types";

type Props = {
    displayResult: ResearchResponse
}

const ResultOverviewMetadata = ({displayResult}: Props) => {
    const CategoryIcon = getCategoryIcon(displayResult.category);
    const { colors, isDark } = useLayoutTheme();
    return <>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm"
        >
            {displayResult.request.source && (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4" style={{ color: colors.mutedForeground }} />
                    <span style={{ color: colors.mutedForeground }}>
                        <strong>Source:</strong> {displayResult.request.source}
                    </span>
                </div>
            )}

            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" style={{ color: colors.mutedForeground }} />
                <span style={{ color: colors.mutedForeground }}>
                    {new Date(displayResult.request.datetime).toLocaleDateString('en-US', {
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
                    className={`text-xs font-semibold ${getCategoryColor(displayResult.category)}`}
                    style={{
                        background: isDark ? 'rgba(71, 85, 105, 0.2)' : 'rgba(248, 250, 252, 0.8)',
                        color: colors.foreground,
                        border: `1px solid ${colors.border}`
                    }}
                >
                    <CategoryIcon className="h-3 w-3 mr-1" />
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