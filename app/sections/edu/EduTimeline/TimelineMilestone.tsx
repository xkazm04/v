'use client';
import { motion } from "framer-motion";
import { MilestoneEvent } from "../TimelineVertical";
import { Milestone } from "../sampleData";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import TimelineEventContainer from "./TimelineEventContainer"; // Fixed import

interface TimelineMilestoneProps {
    milestone: Milestone;
    index: number;
    activeMilestoneId: string | null;
    activeEventId: string | null;
    expandedEventId: string | null;
    onEventHover: (eventId: string | null) => void;
    onMilestoneHover: (milestoneId: string | null) => void;
    onEventExpand: (eventId: string | null) => void;
    isVisible: boolean;
    scrollProgress: number;
}

export default function TimelineMilestone({ 
    milestone, 
    index,
    activeMilestoneId,
    activeEventId,
    expandedEventId,
    onEventHover,
    onMilestoneHover,
    onEventExpand,
    isVisible,
    scrollProgress
}: TimelineMilestoneProps) {
    
    const { colors, mounted, isDark } = useLayoutTheme();
    const isMilestoneActive = milestone.id === activeMilestoneId;

    if (!mounted) return null;

    return (
        <motion.div
            className="relative w-full"
            initial={{ opacity: 0, y: 60 }}
            animate={{ 
                opacity: isVisible ? 1 : 0.3, 
                y: 0,
                scale: isVisible ? 1 : 0.95
            }}
            transition={{ 
                delay: 0.1 + index * 0.05, 
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            onMouseEnter={() => onMilestoneHover(milestone.id)}
            data-milestone-id={milestone.id}
        >
            {/* Enhanced Milestone Date Header */}
            <motion.div 
                className="relative flex items-center justify-center mb-16"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.6 }}
            >
                {/* Connection Node */}
                <motion.div
                    className="absolute w-8 h-8 rounded-full border-4 z-20 backdrop-blur-sm"
                    style={{
                        backgroundColor: isMilestoneActive ? colors.primary : colors.background,
                        borderColor: isMilestoneActive ? colors.primary : colors.border,
                        boxShadow: isMilestoneActive 
                            ? `0 0 30px ${colors.primary}50, 0 8px 25px rgba(0,0,0,0.2)` 
                            : `0 4px 15px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)'}`
                    }}
                    animate={{ 
                        scale: isMilestoneActive ? 1.3 : 1,
                        rotate: isMilestoneActive ? [0, 360] : 0
                    }}
                    transition={{ 
                        scale: { duration: 0.3 },
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                    }}
                />

                {/* Enhanced Pulse Effect */}
                {isMilestoneActive && (
                    <>
                      <motion.div
                          className="absolute w-8 h-8 rounded-full border-2 opacity-40"
                          style={{ borderColor: colors.primary }}
                          animate={{
                              scale: [1, 2.5, 1],
                              opacity: [0.4, 0.05, 0.4]
                          }}
                          transition={{
                              duration: 3,
                              ease: "easeInOut",
                              repeat: Infinity,
                              repeatType: "loop"
                          }}
                      />
                      <motion.div
                          className="absolute w-8 h-8 rounded-full border opacity-60"
                          style={{ borderColor: colors.primary }}
                          animate={{
                              scale: [1, 1.8, 1],
                              opacity: [0.6, 0.1, 0.6]
                          }}
                          transition={{
                              duration: 2,
                              ease: "easeInOut",
                              repeat: Infinity,
                              repeatType: "loop",
                              delay: 0.5
                          }}
                      />
                    </>
                )}

                {/* Enhanced Date Badge */}
                <motion.div 
                    className="relative z-30 px-8 py-4 rounded-2xl border-2 backdrop-blur-sm"
                    style={{
                        backgroundColor: isMilestoneActive 
                            ? colors.primary 
                            //@ts-expect-error Ignore
                            : colors.cardColors?.background || colors.background,
                        borderColor: isMilestoneActive ? colors.primary : colors.border,
                        color: isMilestoneActive ? 'white' : colors.foreground,
                        boxShadow: isMilestoneActive
                            ? `0 12px 35px ${colors.primary}40`
                            : isDark 
                                ? '0 8px 25px rgba(0, 0, 0, 0.3)' 
                                : '0 8px 25px rgba(0, 0, 0, 0.1)'
                    }}
                    whileHover={{ 
                        scale: 1.05,
                        y: -3,
                        boxShadow: isMilestoneActive
                            ? `0 20px 40px ${colors.primary}50`
                            : isDark 
                                ? '0 15px 35px rgba(0, 0, 0, 0.4)' 
                                : '0 15px 35px rgba(0, 0, 0, 0.15)'
                    }}
                    animate={{ 
                        scale: isMilestoneActive ? 1.02 : 1,
                        y: isMilestoneActive ? -2 : 0
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <span className="text-2xl font-bold tracking-wide">
                        {milestone.date}
                    </span>
                </motion.div>
            </motion.div>

            {/* Events Container */}
            <div className="space-y-24">
                {milestone.events && milestone.events.map((event, eventIndex) => (
                    <TimelineEventContainer
                        key={event.id}
                        //@ts-expect-error Ignore
                        event={event as MilestoneEvent}
                        milestone={milestone}
                        eventIndex={eventIndex}
                        activeEventId={activeEventId}
                        expandedEventId={expandedEventId}
                        onEventHover={onEventHover}
                        onEventExpand={onEventExpand}
                        isMilestoneActive={isMilestoneActive}
                        isVisible={isVisible}
                    />
                ))}
            </div>
        </motion.div>
    );
}