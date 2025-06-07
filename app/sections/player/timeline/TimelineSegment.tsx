import { getSegmentColor } from "@/app/helpers/playerHelp";
import { useState } from "react";
import { motion } from "framer-motion";
import { SegmentInteface } from "./PlayerTimeline";

type Props = {
    segment: SegmentInteface
    activeClaims: { id: string }[];
    handleSeekToTimestamp: (timestamp: number) => void;
    videoDuration: number;
}

const TimelineSegment = ({segment, activeClaims, handleSeekToTimestamp, videoDuration}: Props) => {
    const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
    const segmentWidth = (segment.duration / videoDuration) * 100;
    const segmentStart = (segment.timestamp / videoDuration) * 100;
    const isActive = activeClaims.some(claim => claim.id === segment.id);
    

    return (
        <motion.div
            key={segment.id}
            className={`absolute h-full ${getSegmentColor(segment.type)} transition-all duration-200 cursor-pointer ${hoveredSegment === segment.id ? 'brightness-125 scale-y-125' : ''
                }`}
            style={{
                left: `${segmentStart}%`,
                width: `${segmentWidth}%`,
                opacity: isActive ? 0.9 : 0.6,
                zIndex: isActive ? 10 : 1
            }}
            onMouseEnter={() => setHoveredSegment(segment.id)}
            onMouseLeave={() => setHoveredSegment(null)}
            onClick={() => handleSeekToTimestamp(segment.timestamp)}
            animate={{
                opacity: isActive ? 0.9 : 0.6,
                scaleY: isActive ? 1.2 : 1,
                filter: isActive ? 'brightness(1.2)' : 'brightness(1)'
            }}
            whileHover={{ scaleY: 1.3}}
            transition={{ duration: 0.2 }}
            title={`${segment.claim} (${segment.confidence}% confidence)`}
        />
    );
}

export default TimelineSegment;