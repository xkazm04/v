import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { formatTime } from "@/app/utils/format";
import { motion } from "framer-motion"

type Props = {
    timelineColors: {
        border: string;
        accuracy: string;
    };
    accuracy: string;
    trackingConfidence: number;
    currentTime: number;
    videoDuration: number;
}

const TimelineListenHeader = ({timelineColors, accuracy, trackingConfidence, currentTime, videoDuration}: Props) => {
    const { colors  } = useLayoutTheme();
    return <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-2 border-b"
        style={{ borderColor: timelineColors.border }}
    >
        <div className="flex items-center justify-between text-xs">
            {/* Accuracy and Tracking Info */}
            <div className="flex items-center space-x-3">
                <motion.div
                    className="flex items-center space-x-1"
                    animate={{
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                >
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: timelineColors.accuracy }}
                    />
                    <span style={{ color: colors.foreground }}>
                        Tracking: {accuracy}
                    </span>
                </motion.div>

                <motion.div
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                        backgroundColor: `${timelineColors.accuracy}20`,
                        color: timelineColors.accuracy
                    }}
                    whileHover={{ scale: 1.05 }}
                >
                    {trackingConfidence}% confidence
                </motion.div>
            </div>

            {/* Time Display */}
            <div className="flex items-center space-x-2">
                <span
                    className="font-mono font-medium"
                    style={{ color: colors.foreground }}
                >
                    {formatTime(currentTime)}
                </span>
                <span style={{ color: colors.mutedForeground }}>/</span>
                <span
                    className="font-mono"
                    style={{ color: colors.mutedForeground }}
                >
                    {formatTime(videoDuration)}
                </span>
            </div>
        </div>
    </motion.div>
}

export default TimelineListenHeader;