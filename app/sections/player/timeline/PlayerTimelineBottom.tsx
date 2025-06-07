import { FactCheckResult } from "@/app/types/video"

type Props = {
    factCheck: FactCheckResult;
    isExpanded: boolean;
    handleToggleExpansion: () => void;
}

const PlayerTimelineBottom = ({factCheck}: Props) => {
    return <div className="flex justify-between items-center px-5 bg-primary-100 text-sm text-gray-300">
        {/* Quick stats */}
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>{factCheck.truthPercentage}%</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                <span>{factCheck.neutralPercentage}%</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                <span>{factCheck.misleadingPercentage}%</span>
            </div>
        </div>
    </div>
}

export default PlayerTimelineBottom;