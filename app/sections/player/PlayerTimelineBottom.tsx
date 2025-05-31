import { Button } from "@/app/components/ui/button"
import { Badge, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { FactCheckResult } from "@/app/types/video"

type Props = {
    factCheck: FactCheckResult;
    isExpanded: boolean;
    handleToggleExpansion: () => void;
}

const PlayerTimelineBottom = ({factCheck, isExpanded, handleToggleExpansion}: Props) => {
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

        {/* Right side - confidence and expand button */}
        <div className="flex items-center gap-2">
            
            {factCheck.confidence}%

            <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleExpansion}
                className="text-white hover:bg-white/10 h-6 w-6 p-0"
            >
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={18} />
                </motion.div>
            </Button>
        </div>
    </div>
}

export default PlayerTimelineBottom;