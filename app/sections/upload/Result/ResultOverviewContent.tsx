import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { LLMResearchResponse } from "@/app/types/research";

type Props = {
    isLoading: boolean;
    displayResult: LLMResearchResponse
}

const ResultOverviewContent = ({ isLoading, displayResult }: Props) => {
    const { colors, isDark } = useLayoutTheme();
    return <div className="p-8 space-y-6" style={{ background: colors.card.background }}>
        <div
            className="p-6 rounded-2xl border-2"
            style={{
                background: isDark
                    ? 'rgba(71, 85, 105, 1)'
                    : 'rgba(248, 250, 252, 1)',
                border: `2px solid ${colors.border}`
            }}
        >
            <div className="flex items-center gap-3">
            </div>
            <p className={`text-lg leading-snug ${isLoading ? 'animate-pulse' : ''}`}
                style={{ color: colors.foreground }}>
                {displayResult.verdict}
            </p>
        </div>


    </div>
}

export default ResultOverviewContent;