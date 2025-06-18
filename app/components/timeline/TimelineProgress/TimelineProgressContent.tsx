import { splitTextIntoLines } from "@/app/helpers/textSplitting";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion } from "framer-motion";
import { Calendar, Hash } from "lucide-react";
import { useCallback, useMemo } from "react";

type Props = {
    milestones: {
        id: string;
        title: string;
        date: string;
        events: { id: string; title: string }[];
    }[];
    activeMilestoneId: string | null;
    activeEventId: string | null;
    onNavigateToMilestone?: (milestoneId: string) => void;
    onNavigateToEvent?: (eventId: string, milestoneId: string) => void;
}

const TimelineProgressContent = ({milestones, activeMilestoneId, activeEventId, onNavigateToMilestone, onNavigateToEvent}: Props) => {
    const { colors } = useLayoutTheme();
    const timelineItems = useMemo(() => {
        const items: any[] = [];
        milestones.forEach((milestone) => {
            // Add milestone
            items.push({
                id: milestone.id,
                type: 'milestone' as const,
                title: milestone.title,
                date: milestone.date,
                isActive: activeMilestoneId === milestone.id,
                milestone
            });

            // Add events
            milestone.events.forEach((event) => {
                items.push({
                    id: event.id,
                    type: 'event' as const,
                    title: event.title,
                    date: milestone.date,
                    isActive: activeEventId === event.id,
                    parentMilestoneId: milestone.id
                });
            });
        });
        return items;
    }, [milestones, activeMilestoneId, activeEventId]);

    // Memoized click handlers to prevent unnecessary re-renders
    const handleMilestoneClick = useCallback((milestoneId: string) => {
        onNavigateToMilestone?.(milestoneId);
    }, [onNavigateToMilestone]);

    const handleEventClick = useCallback((eventId: string, milestoneId: string) => {
        onNavigateToEvent?.(eventId, milestoneId);
    }, [onNavigateToEvent]);
    return <div className="p-4 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="relative pl-2">
            <motion.div
                className="space-y-6"
                layout // Enable layout animations for smooth repositioning
            >
                {timelineItems.map((item, index) => {
                    const handleClick = () => {
                        if (item.type === 'milestone') {
                            handleMilestoneClick(item.id);
                        } else {
                            handleEventClick(item.id, item.parentMilestoneId!);
                        }
                    };

                    // Process title for events - split into multiple lines
                    const titleLines = item.type === 'event'
                        ? splitTextIntoLines(item.title, 28)
                        : [item.title.length > 28 ? item.title.substring(0, 28) + '...' : item.title];

                    return (
                        <motion.div
                            key={item.id}
                            className="relative flex items-start gap-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                            layout // Enable layout animations for smooth repositioning
                        >
                            {/* Timeline node */}
                            <motion.button
                                className={`relative flex-shrink-0 rounded-full border-2 flex items-center justify-center ${item.type === 'milestone' ? 'w-6 h-6' : 'w-4 h-4 ml-1'
                                    }`}
                                style={{
                                    backgroundColor: item.isActive ? colors.primary : 'transparent',
                                    borderColor: item.isActive ? colors.primary :
                                        item.type === 'milestone' ? colors.primary : colors.border,
                                    zIndex: 10
                                }}
                                animate={{
                                    scale: item.isActive ? 1.2 : 1,
                                    boxShadow: item.isActive
                                        ? `0 0 16px ${colors.primary}60`
                                        : 'none'
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20
                                }}
                                whileHover={{ scale: item.isActive ? 1.3 : 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleClick}
                            >
                                {item.type === 'milestone' ? (
                                    <Calendar
                                        className="w-3 h-3"
                                        style={{ color: item.isActive ? 'white' : colors.primary }}
                                    />
                                ) : (
                                    <Hash
                                        className="w-2 h-2"
                                        style={{ color: item.isActive ? 'white' : colors.border }}
                                    />
                                )}
                            </motion.button>

                            {/* Content */}
                            <motion.div
                                className="flex-1 cursor-pointer"
                                whileHover={{ x: 2 }}
                                transition={{ duration: 0.2 }}
                                onClick={handleClick}
                            >
                                <div className={`${item.type === 'milestone' ? 'mb-1' : 'mb-0.5'}`}>
                                    {/* Multi-line title rendering for events */}
                                    {titleLines.map((line, lineIndex) => (
                                        <div key={lineIndex}>
                                            <span
                                                className={`font-semibold ${item.type === 'milestone' ? 'text-sm' : 'text-xs'
                                                    } ${item.isActive ? 'text-primary' : ''} block leading-tight`}
                                                style={{
                                                    color: item.isActive ? colors.primary : colors.foreground
                                                }}
                                            >
                                                {line}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {item.type === 'milestone' && (
                                    <div className="flex items-center gap-1 opacity-60">
                                        <span className="text-xs" style={{ color: colors.foreground }}>
                                            {item.date}
                                        </span>
                                        {item.milestone?.events && item.milestone.events.length > 0 && (
                                            <>
                                                <span className="text-xs">•</span>
                                                <span className="text-xs">
                                                    {item.milestone.events.length} event{item.milestone.events.length !== 1 ? 's' : ''}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    </div>
}

export default TimelineProgressContent;