import { getVerdictStyling } from '@/app/config/verdictStyling';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

type Props = {
    isLoading: boolean;
    displayResult: {
        status: string;
    };
}

const ResultOverviewHeader = ({ isLoading, displayResult }: Props) => {
    const { isDark } = useLayoutTheme();
    const verdictStyle = getVerdictStyling(displayResult.status, isDark);
    const VerdictIcon = verdictStyle.icon;

    return <div className={`relative p-4 sm:p-6 lg:p-8 overflow-hidden ${isLoading ? 'animate-pulse' : ''}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${verdictStyle.bgColor} opacity-90`} />
        <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px'
            }} />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="p-2 sm:p-3 lg:p-4 bg-white/20 rounded-xl sm:rounded-2xl backdrop-blur-sm flex-shrink-0">
                    <VerdictIcon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wider mb-1">
                        Fact-Check Verdict
                    </h2>
                    <h1 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black ${verdictStyle.textColor} leading-tight break-words`}>
                        {displayResult.status.toUpperCase()}
                    </h1>
                </div>
            </div>
        </div>
    </div>
}

export default ResultOverviewHeader;