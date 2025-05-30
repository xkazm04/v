import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MilestoneEvent } from "./EduLayout";
import { Milestone } from "./sampleData";

type Props = {
    milestone: Milestone;
    sortedMilestones: Milestone[];
    setSelectedEvent: (event: MilestoneEvent) => void;
    isTop: boolean;
    activeMilestoneId: string | null;
    activeEventId: string | null;
    onEventHover: (eventId: string | null) => void;
    onMilestoneHover: (milestoneId: string | null) => void;
}

const TimelineMilestone = ({ 
    milestone, 
    sortedMilestones, 
    setSelectedEvent, 
    isTop,
    activeMilestoneId,
    activeEventId,
    onEventHover,
    onMilestoneHover
}: Props) => {
    const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
    
    const isMilestoneActive = milestone.id === activeMilestoneId;
    
    const containerPositionClass = isTop ? 'bottom-0' : 'top-0';
    const linePositionClass = isTop ? 'bottom-0' : 'top-0';
    const eventsPositionClass = isTop ? 'bottom-16' : 'top-16';
    const verticalLineHeight = '160px'; 
    const positionPercent = (milestone.order - 1) / (sortedMilestones.length - 1) * 80; 

    useEffect(() => {
        // When milestone becomes active, handle event hover effects
        if (isMilestoneActive) {
            onMilestoneHover(milestone.id);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMilestoneActive]);

    const handleEventHover = (eventId: string | null) => {
        setHoveredEventId(eventId);
        onEventHover(eventId);
        if (eventId) {
            onMilestoneHover(milestone.id);
        }
    };

    return (
        <div
            key={`${isTop ? 'top' : 'bottom'}-${milestone.id}`} 
            className={`absolute ${containerPositionClass}`}
            style={{
                left: `${positionPercent}%`, 
                transform: 'translateX(-50%)'
            }}
            onMouseEnter={() => onMilestoneHover(milestone.id)}
        >
            {/* Vertical line */}
            <motion.div
                className={`w-0.5 bg-gray-700/80 absolute ${linePositionClass} left-1/2 transform -translate-x-1/2`} 
                style={{ height: verticalLineHeight }}
                animate={{ 
                    backgroundColor: isMilestoneActive ? 'rgba(59, 130, 246, 0.5)' : 'rgba(55, 65, 81, 0.8)',
                    width: isMilestoneActive ? '2px' : '1px'
                }}
            />

            {/* Milestone events - positioned relative to the line */}
            <div className={`absolute ${eventsPositionClass} left-20 transform -translate-x-1/2 w-48`}>
                {milestone.events.map((event) => {
                    const isEventActive = event.id === activeEventId;
                    return (
                    <motion.div
                        key={event.id}
                        className={`bg-gray-900 border ${
                            isEventActive 
                                ? 'border-blue-400 ring-1 ring-blue-400/50' 
                                : isMilestoneActive 
                                    ? 'border-gray-600' 
                                    : 'border-gray-700'
                        } rounded-lg p-3 mb-4 cursor-pointer shadow-lg ${
                            hoveredEventId === event.id
                                ? 'ring-2 ring-blue-500 shadow-blue-900/30'
                                : isEventActive 
                                    ? 'shadow-blue-900/20' 
                                    : 'shadow-black/50'
                        }`}
                        initial={{ opacity: 0, x: isTop ? -20 : 20 }} 
                        animate={hoveredEventId === event.id
                            ? {
                                scale: 1.05,
                                opacity: 1,
                                x: 0,
                                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 8px 10px -6px rgba(59, 130, 246, 0.2)'
                            }
                            : isEventActive 
                                ? {
                                    scale: 1.4,
                                    opacity: 1,
                                    x: 0,
                                    boxShadow: '0 8px 20px -5px rgba(59, 130, 246, 0.2), 0 6px 8px -6px rgba(59, 130, 246, 0.1)'
                                }
                                : {
                                    scale: 1,
                                    opacity: isMilestoneActive ? 0.95 : 0.9,
                                    x: 0,
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.3)'
                                }
                        }
                        whileHover={{
                            scale: 1.08,
                            opacity: 1,
                            y: isTop ? -3 : 3, 
                            transition: {
                                type: "spring",
                                stiffness: 400,
                                damping: 10
                            }
                        }}
                        //@ts-expect-error Ignore
                        onClick={() => setSelectedEvent(event)}
                        onMouseEnter={() => handleEventHover(event.id)}
                        onMouseLeave={() => handleEventHover(null)}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 20
                        }}
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ 
                                width: hoveredEventId === event.id 
                                    ? '100%' 
                                    : isEventActive 
                                        ? '60%' 
                                        : isMilestoneActive 
                                            ? '40%' 
                                            : '30%' 
                            }}
                            className={`h-0.5 ${
                                isEventActive
                                    ? 'bg-gradient-to-r from-blue-400 to-yellow-400'
                                    : 'bg-gradient-to-r from-blue-500 to-yellow-500'
                            } mb-2`}
                            transition={{ duration: 0.3 }}
                        />
                        <p className={`transition-all duration-300 ${
                            hoveredEventId === event.id
                                ? 'text-sm font-medium text-blue-200'
                                : isEventActive
                                    ? 'text-xs font-medium text-blue-300'
                                    : 'text-xs text-gray-300'
                            }`}>
                            {event.title}
                        </p>
                    </motion.div>
                );})}
            </div>
        </div>
    );
}

export default TimelineMilestone;