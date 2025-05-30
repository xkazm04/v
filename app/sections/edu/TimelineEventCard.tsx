import { useViewport } from "@/app/hooks/useViewport";
import { motion } from "framer-motion";
import { useState } from "react";
import { MilestoneEvent } from "./TimelineVertical";
import { Milestone } from "./sampleData";
import { MessageCircleWarningIcon } from "lucide-react";

type Props = {
    onEventHover: (eventId: string | null) => void;
    onMilestoneHover: (milestoneId: string | null) => void;
    event: MilestoneEvent;
    milestone: Milestone;
    index: number;
    eventIndex: number;
    setSelectedEvent: (event: MilestoneEvent) => void;
    activeEventId: string | null;
    isLeft?: boolean; 
    isMilestoneActive?: boolean; 
}

const TimelineEventCard = ({ onEventHover, onMilestoneHover, event, milestone, index, eventIndex, setSelectedEvent, activeEventId, isLeft, isMilestoneActive }: Props) => {
    const { isMobile, isDesktop, isLoaded } = useViewport();
    const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
    const isEventActive = event.id === activeEventId;
    const isHovered = hoveredEventId === event.id;
    const handleEventHover = (eventId: string | null) => {
        setHoveredEventId(eventId);
        onEventHover(eventId);
        if (eventId) {
            onMilestoneHover(milestone.id);
        }
    };

    // Color schemes for different milestone types
    const colorScheme = isLeft
        ? {
            primary: 'from-chart-1 to-chart-2',
            border: 'border-chart-1/30',
            text: 'text-chart-1',
            bg: 'bg-chart-1/5',
            accent: 'bg-chart-1',
            glow: 'shadow-chart-1/20'
        }
        : {
            primary: 'from-chart-3 to-chart-4',
            border: 'border-chart-3/30',
            text: 'text-chart-3',
            bg: 'bg-chart-3/5',
            accent: 'bg-chart-3',
            glow: 'shadow-chart-3/20'
        };

    // Use a consistent class name that doesn't change between server and client
    const titleSizeClass = isLoaded ? (isDesktop ? 'text-2xl' : 'text-xl') : 'text-xl';
    const textSizeClass = isLoaded ? (isDesktop ? 'text-lg' : 'text-base') : 'text-base';
    return <>
        <motion.div
            key={event.id}
            className="relative cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.15 + eventIndex * 0.1 }}
            onClick={() => setSelectedEvent(event as MilestoneEvent)}
            onMouseEnter={() => handleEventHover(event.id)}
            onMouseLeave={() => handleEventHover(null)}
        >
            {/* Event Card - Responsive sizing */}
            <motion.div
                className={`relative p-6 lg:p-8 rounded-xl border transition-all duration-300 backdrop-blur-sm ${isEventActive
                    ? `${colorScheme.bg} ${colorScheme.border} border-2 shadow-xl ${colorScheme.glow}`
                    : isHovered
                        ? `bg-muted/60 border-primary/50 shadow-lg`
                        : `bg-card/80 border-border hover:border-primary/30 shadow-md`
                    }`}
                whileHover={{
                    scale: 1.02,
                    y: -4
                }}
                animate={{
                    scale: isEventActive ? 1.03 : 1,
                    boxShadow: isEventActive
                        ? '0 20px 40px -10px rgba(var(--primary) / 0.15), 0 10px 20px -5px rgba(var(--primary) / 0.1)'
                        : isHovered
                            ? '0 8px 25px -5px rgba(0, 0, 0, 0.15)'
                            : '0 2px 8px 0 rgba(0, 0, 0, 0.1)'
                }}
            >
                {/* Event Type Indicator */}
                <div className={`absolute ${isMobile ? 'right-4' : isLeft ? 'left-4' : 'right-4'
                    } top-4`}>
                    <div className={`w-3 h-3 rounded-full ${colorScheme.accent} opacity-70 shadow-sm`}></div>
                </div>

                {/* Progress Bar */}
                <motion.div
                    className={`h-1 bg-gradient-to-r ${colorScheme.primary} rounded-full mb-6 shadow-sm`}
                    initial={{ width: 0 }}
                    animate={{
                        width: isEventActive
                            ? '100%'
                            : isHovered
                                ? '85%'
                                : isMilestoneActive
                                    ? '70%'
                                    : '50%'
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                />

                {/* Event Title */}
                <h3 className={`font-semibold mb-4 transition-colors duration-300 ${titleSizeClass} ${isEventActive
                    ? colorScheme.text
                    : isHovered
                        ? 'text-primary'
                        : 'text-foreground'
                    }`}>
                    {event.title}
                </h3>

                {/* Event Description Preview */}
                <p className={`${textSizeClass} text-muted-foreground line-clamp-4 mb-6`}>
                    {event.description}
                </p>

                {/* Tags Preview */}
                {(event.text_1 || event.text_2) && (
                    <div className={`flex gap-3 flex-wrap mt-6 ${isMobile ? 'justify-center' : isLeft ? 'justify-end' : 'justify-start'
                        }`}>
                        {event.text_1 && (
                            <span className={`px-4 py-2 text-sm rounded-full ${colorScheme.bg} ${colorScheme.text} border ${colorScheme.border} font-medium shadow-sm`}>
                               <MessageCircleWarningIcon />
                            </span>
                        )}
                        {event.text_2 && (
                            <span className={`px-4 py-2 text-sm rounded-full ${colorScheme.bg} ${colorScheme.text} border ${colorScheme.border} font-medium shadow-sm`}>
                                <MessageCircleWarningIcon />
                            </span>
                        )}
                        {event.text_3 && (
                            <span className={`px-4 py-2 text-sm rounded-full ${colorScheme.bg} ${colorScheme.text} border ${colorScheme.border} font-medium shadow-sm`}>
                               <MessageCircleWarningIcon />
                            </span>
                        )}
                        {event.text_4 && (
                            <span className={`px-4 py-2 text-sm rounded-full ${colorScheme.bg} ${colorScheme.text} border ${colorScheme.border} font-medium shadow-sm`}>
                                <MessageCircleWarningIcon />
                            </span>
                        )}
                    </div>
                )}

                {/* Hover Indicator - Hidden on mobile */}
                {!isMobile && isLoaded && (
                    <motion.div
                        className={`absolute ${isLeft ? 'right-0' : 'left-0'
                            } top-1/2 transform -translate-y-1/2 w-1 bg-gradient-to-b ${colorScheme.primary} rounded-full`}
                        animate={{ height: isHovered || isEventActive ? '70%' : '0%' }}
                        transition={{ duration: 0.3 }}
                    />
                )}

                {/* Click indicator */}
                {(isHovered || isEventActive) && (
                    <motion.div
                        className={`absolute bottom-2 ${isMobile ? 'left-1/2 transform -translate-x-1/2' : isLeft ? 'left-2' : 'right-2'
                            } text-xs ${colorScheme.text} opacity-60`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                    >
                        Click to expand
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    </>
}

export default TimelineEventCard;