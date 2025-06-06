import { formatTime, getSegmentColor } from "@/app/helpers/playerHelp";
import { motion } from "framer-motion"

type Props = {
    segment: {
        timestamp: number;
        claim: string;
        type: 'truth' | 'neutral' | 'lie';
    };
    onSeekToTimestamp?: (timestamp: number) => void;
    index: number;
}

const PlayerTimelineRow = ({segment, onSeekToTimestamp, index}: Props) => {
    return <>
        <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="group cursor-pointer p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 relative overflow-hidden"
            onClick={() => onSeekToTimestamp?.(segment.timestamp)}
        >
            <div className="flex items-start gap-3">
                <div className="flex items-center gap-3">
                    <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-green-500"
                        style={{ backgroundColor: getSegmentColor(segment.type) }}
                    />
                    <span className="text-xs text-gray-300 font-mono bg-gray-800 px-2 py-1 rounded">
                        {formatTime(segment.timestamp)}
                    </span>
                </div>
                            <p className="text-xs text-gray-200 mt-2 leading-relaxed">
                {segment.claim}
            </p>
            </div>
            {/* Hover effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none"
                transition={{ duration: 0.2 }}
            />
        </motion.div>
    </>
}

export default PlayerTimelineRow;