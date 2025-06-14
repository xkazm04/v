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
                    ? 'rgba(71, 85, 105, 1)'
                    : 'rgba(248, 250, 252, 1)',
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


    </div>
}

export default ResultOverviewContent;