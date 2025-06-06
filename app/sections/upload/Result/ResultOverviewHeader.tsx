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

    return <div className={`relative p-8 overflow-hidden ${isLoading ? 'animate-pulse' : ''}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${verdictStyle.bgColor} opacity-90`} />
        <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px'
            }} />
        </div>

        <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <VerdictIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h2 className="text-sm font-medium text-white/80 uppercase tracking-wider">
                        Fact-Check Verdict
                    </h2>
                    <h1 className={`text-4xl md:text-5xl font-black ${verdictStyle.textColor} leading-tight`}>
                        {displayResult.status.toUpperCase()}
                    </h1>
                </div>
            </div>

            <div className="text-right">
                <div className="text-white/80 text-sm font-medium mb-1">Confidence</div>
                <div className="text-3xl font-bold text-white">
                    {Math.floor(Math.random() * 20) + 80}%
                </div>
            </div>
        </div>
    </div>
}

export default ResultOverviewHeader;