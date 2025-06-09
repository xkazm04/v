import { useLayoutTheme } from "@/app/hooks/use-layout-theme";

type Props = {
    article: {
        source: { name: string };
        publishedAt: string;
        category?: string;
        author?: string;
    };
    displayResult: {
        valid_sources: number;
        resources_agreed?: { total: number };
        resources_disagreed?: { total: number };
        experts?: Record<string, any>;
    };
}

const FactCheckMetadata = ({article, displayResult}: Props) => {
     const { colors, isDark } = useLayoutTheme();
    return <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
            <h4
                className="font-semibold mb-2 text-sm sm:text-base"
                style={{ color: colors.foreground }}
            >
                Publication Details
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span style={{ color: colors.mutedForeground }}>Source:</span>
                    <span style={{ color: colors.foreground }} className="font-medium break-words">
                        {article.source.name}
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span style={{ color: colors.mutedForeground }}>Published:</span>
                    <span style={{ color: colors.foreground }} className="font-medium">
                        {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span style={{ color: colors.mutedForeground }}>Category:</span>
                    <span style={{ color: colors.foreground }} className="font-medium capitalize">
                        {article.category || 'News'}
                    </span>
                </div>
                {article.author && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                        <span style={{ color: colors.mutedForeground }}>Author:</span>
                        <span style={{ color: colors.foreground }} className="font-medium break-words">
                            {article.author}
                        </span>
                    </div>
                )}
            </div>
        </div>

        <div>
            <h4
                className="font-semibold mb-2 text-sm sm:text-base"
                style={{ color: colors.foreground }}
            >
                Verification Summary
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span style={{ color: colors.mutedForeground }}>Total Sources:</span>
                    <span style={{ color: colors.foreground }} className="font-medium">
                        {displayResult.valid_sources}
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span style={{ color: colors.mutedForeground }}>Supporting:</span>
                    <span style={{ color: isDark ? '#4ade80' : '#16a34a' }} className="font-medium">
                        {displayResult.resources_agreed?.total || 0}
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span style={{ color: colors.mutedForeground }}>Contradicting:</span>
                    <span style={{ color: isDark ? '#f87171' : '#dc2626' }} className="font-medium">
                        {displayResult.resources_disagreed?.total || 0}
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span style={{ color: colors.mutedForeground }}>Expert Opinions:</span>
                    <span style={{ color: colors.foreground }} className="font-medium">
                        {Object.keys(displayResult.experts || {}).length}
                    </span>
                </div>
            </div>
        </div>
    </div>
}

export default FactCheckMetadata;