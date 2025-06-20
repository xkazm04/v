import { getSegmentColor } from "@/app/helpers/playerHelp";
import { useState } from "react";
import { motion } from "framer-motion";
import { SegmentInterface } from "./PlayerTimeline";

type Props = {
    segment: SegmentInterface;
    activeClaims: { id: string }[];
    handleSeekToTimestamp: (timestamp: number) => void;
    videoDuration: number;
}

const TimelineSegment = ({ segment, activeClaims, handleSeekToTimestamp, videoDuration }: Props) => {
    const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
    
    // Validate segment data
    if (!segment || typeof segment !== 'object') {
        console.warn('TimelineSegment: Invalid segment data', segment);
        return null;
    }

    if (typeof segment.duration !== 'number' || typeof segment.timestamp !== 'number' || typeof videoDuration !== 'number') {
        console.warn('TimelineSegment: Invalid numeric values', { segment, videoDuration });
        return null;
    }

    if (videoDuration <= 0) {
        console.warn('TimelineSegment: Invalid video duration', videoDuration);
        return null;
    }

    // Calculate segment position and size with bounds checking
    const segmentWidth = Math.max(0, Math.min(100, (segment.duration / videoDuration) * 100));
    const segmentStart = Math.max(0, Math.min(100, (segment.timestamp / videoDuration) * 100));
    
    // Check if this segment is currently active
    const isActive = Array.isArray(activeClaims) && activeClaims.some(claim => 
        claim && typeof claim === 'object' && claim.id === segment.id
    );

    // Ensure we have a valid ID
    if (!segment.id || typeof segment.id !== 'string') {
        console.warn('TimelineSegment: Invalid segment ID', segment);
        return null;
    }

    const handleClick = () => {
        if (typeof segment.timestamp === 'number' && !isNaN(segment.timestamp)) {
            handleSeekToTimestamp(segment.timestamp);
        }
    };

    return (
        <motion.div
            key={segment.id}
            className={`absolute h-full ${getSegmentColor(segment.type)} transition-all duration-200 cursor-pointer ${
                hoveredSegment === segment.id ? 'brightness-125 scale-y-125' : ''
            }`}
            style={{
                left: `${segmentStart}%`,
                width: `${segmentWidth}%`,
                opacity: isActive ? 0.9 : 0.6,
                zIndex: isActive ? 10 : 1,
                minWidth: '2px' // Ensure segments are visible even if very short
            }}
            onMouseEnter={() => setHoveredSegment(segment.id)}
            onMouseLeave={() => setHoveredSegment(null)}
            onClick={handleClick}
            animate={{
                opacity: isActive ? 0.9 : 0.6,
                scaleY: isActive ? 1.2 : 1,
                filter: isActive ? 'brightness(1.2)' : 'brightness(1)'
            }}
            whileHover={{ scaleY: 1.3 }}
            transition={{ duration: 0.2 }}
            title={`${segment.claim || 'Unknown claim'} (${segment.confidence || 0}% confidence)`}
        />
    );
}

export default TimelineSegment;