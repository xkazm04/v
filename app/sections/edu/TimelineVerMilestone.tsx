import { motion } from "framer-motion";
import { MilestoneEvent } from "./TimelineVertical";
import { Milestone } from "./sampleData";
import { useViewport } from "@/app/hooks/useViewport";
import TimelineEventCard from "./TimelineEventCard";

type Props = {
    milestone: Milestone;
    index: number;
    setSelectedEvent: (event: MilestoneEvent) => void;
    activeMilestoneId: string | null;
    activeEventId: string | null;
    onEventHover: (eventId: string | null) => void;
    onMilestoneHover: (milestoneId: string | null) => void;
    isVisible: boolean;
}

const TimelineVerMilestone = ({ 
    milestone, 
    index,
    setSelectedEvent, 
    activeMilestoneId,
    activeEventId,
    onEventHover,
    onMilestoneHover,
    isVisible
}: Props) => {
    
    const { isMobile, isLoaded } = useViewport();
    const isMilestoneActive = milestone.id === activeMilestoneId;
    const isLeft = milestone.isTop && !isMobile; 
    const topPosition = 120 + (index * (isMobile ? 400 : 500));


    return (
        <motion.div
            className={`absolute ${
                isMobile 
                    ? 'w-full px-4 left-0' 
                    : isLeft 
                        ? 'right-1/2 pr-24 lg:pr-32 w-96 lg:w-[800px]' 
                        : 'left-1/2 pl-24 lg:pl-32 w-96 lg:w-[800px]'
            }`}
            style={{ top: `${topPosition}px` }}
            initial={{ opacity: 0, x: isMobile ? 0 : (isLeft ? 50 : -50) }}
            animate={{ 
                opacity: isVisible ? 1 : 0.3, 
                x: 0,
                scale: isVisible ? 1 : 0.95
            }}
            transition={{ delay: 0.6 + index * 0.15, duration: 0.6 }}
            onMouseEnter={() => onMilestoneHover(milestone.id)}
            data-milestone-id={milestone.id}
        >
            {/* Connection Line to Timeline - Hidden on mobile */}
            {!isMobile && isLoaded && (
                <>
                    <motion.div
                        className={`absolute top-12 ${
                            isLeft ? 'right-0' : 'left-0'
                        } h-0.5 rounded-full ${
                            isMilestoneActive 
                                ? 'bg-gradient-to-r from-primary via-primary/80 to-primary/40 shadow-lg' 
                                : 'bg-gradient-to-r from-border via-border/60 to-border/20'
                        }`}
                        style={{ width: '6rem' }}
                        animate={{ 
                            width: isMilestoneActive ? '6rem' : '5rem',
                            opacity: isMilestoneActive ? 1 : 0.6
                        }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Connection dot at timeline */}
                    <motion.div
                        className={`absolute top-11 ${
                            isLeft ? 'right-24 lg:right-32' : 'left-24 lg:left-32'
                        } w-2 h-2 rounded-full ${
                            isMilestoneActive ? 'bg-primary shadow-lg' : 'bg-border'
                        }`}
                        animate={{ 
                            scale: isMilestoneActive ? 1.2 : 1,
                            opacity: isMilestoneActive ? 1 : 0.6
                        }}
                    />
                </>
            )}

            {/* Events Container */}
            <div className={`space-y-6 lg:space-y-8 ${
                isMobile ? 'text-center' : isLeft ? 'text-right' : 'text-left'
            }`}>
                {milestone.events.map((event, eventIndex) => (
                    <TimelineEventCard
                        key={event.id}
                        //@ts-expect-error Ignore
                        event={event}
                        milestone={milestone}
                        index={index}
                        eventIndex={eventIndex}
                        setSelectedEvent={setSelectedEvent}
                        activeEventId={activeEventId}
                        onEventHover={onEventHover}
                        onMilestoneHover={onMilestoneHover}
                        isLeft={isLeft}
                        isMilestoneActive={isMilestoneActive}
                        />
                ))}
            </div>
        </motion.div>
    );
}

export default TimelineVerMilestone;