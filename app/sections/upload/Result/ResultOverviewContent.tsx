import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { Edit3, FileText, Shield } from "lucide-react";
import { LLMResearchResponse } from "@/app/types/research";

type Props = {
    isLoading: boolean;
    displayResult: LLMResearchResponse
}

const ResultOverviewContent = ({ isLoading, displayResult }: Props) => {
    const { colors, isDark } = useLayoutTheme();
    return <div className="p-8 space-y-6" style={{ background: colors.card.background }}>
        {/* Verdict Summary */}
        <div
            className="p-6 rounded-2xl border-2"
            style={{
                background: isDark
                    ? 'rgba(71, 85, 105, 0.1)'
                    : 'rgba(248, 250, 252, 0.8)',
                border: `2px solid ${colors.border}`
            }}
        >
            <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5" style={{ color: colors.primary }} />
                <h3 className="text-lg font-bold" style={{ color: colors.foreground }}>
                    Verdict
                </h3>
            </div>
            <p className={`text-lg font-semibold leading-relaxed ${isLoading ? 'animate-pulse' : ''}`}
                style={{ color: colors.foreground }}>
                {displayResult.verdict}
            </p>
        </div>

        {/* Original Statement */}
        <div
            className="p-6 rounded-2xl border-2"
            style={{
                background: isDark
                    ? 'rgba(59, 130, 246, 0.05)'
                    : 'rgba(59, 130, 246, 0.02)',
                border: `2px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`
            }}
        >
            <div className="flex items-center gap-3 mb-4">
                <FileText className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-bold" style={{ color: colors.foreground }}>
                    Original Statement
                </h3>
            </div>
            <blockquote
                className={`text-base italic border-l-4 border-blue-400 pl-4 ${isLoading ? 'animate-pulse' : ''}`}
                style={{ color: colors.foreground }}
            >
                "{displayResult.request_statement}"
            </blockquote>
            <div
                className={`text-sm mt-3 p-3 rounded-lg ${isLoading ? 'animate-pulse' : ''}`}
                style={{
                    background: isDark ? 'rgba(71, 85, 105, 0.2)' : 'rgba(248, 250, 252, 0.8)',
                    color: colors.mutedForeground
                }}
            >
                <strong>Context:</strong> {displayResult.request_context}
            </div>
        </div>

        {/* Corrected Statement */}
        {displayResult.correction && (
            <div
                className="p-6 rounded-2xl border-2"
                style={{
                    background: isDark
                        ? 'rgba(34, 197, 94, 0.05)'
                        : 'rgba(34, 197, 94, 0.02)',
                    border: `2px solid ${isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)'}`
                }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <Edit3 className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-lg font-bold" style={{ color: colors.foreground }}>
                        Corrected Statement
                    </h3>
                </div>
                <p className={`text-base leading-relaxed ${isLoading ? 'animate-pulse' : ''}`}
                    style={{ color: colors.foreground }}>
                    {displayResult.correction}
                </p>
            </div>
        )}
    </div>
}

export default ResultOverviewContent;