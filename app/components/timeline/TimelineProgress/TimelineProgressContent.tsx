import { motion } from 'framer-motion';
import { useCallback, useMemo } from 'react';
import { useTimelineAudioStore } from '@/app/stores/useTimelineAudioStore';
import { formatEventContent, formatMilestoneContent } from '@/app/helpers/timelineProgressHelpers';
import TimelineProgressRowItem from './TimelineProgressRowItem';

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

const TimelineProgressContent = ({
    milestones, 
    activeMilestoneId, 
    activeEventId, 
    onNavigateToMilestone, 
    onNavigateToEvent
}: Props) => {
    const { 
        tracks, 
        currentTrackId, 
        isPlaying, 
        isLoading,
        getTrackByProgressId,
        playTrack,
        pauseTrack,
        stopTrack
    } = useTimelineAudioStore();

    // Build timeline items including hero section
    const timelineItems = useMemo(() => {
        const items: any[] = [];
        
        // Add hero section (timeline conclusion)
        const heroTrack = getTrackByProgressId('hero');
        if (heroTrack) {
            items.push({
                id: 'hero',
                type: 'hero' as const,
                title: 'Timeline Summary',
                content: {
                    content: 'Complete timeline overview and analysis',
                    date: ''
                },
                isActive: false,
                track: heroTrack,
                isCurrentlyPlaying: currentTrackId === heroTrack.id && isPlaying
            });
        }

        milestones.forEach((milestone) => {
            // Add milestone
            const milestoneTrack = getTrackByProgressId(milestone.id);
            const milestoneContent = formatMilestoneContent(milestone.title, milestone.date);
            items.push({
                id: milestone.id,
                type: 'milestone' as const,
                title: milestone.title,
                content: milestoneContent,
                isActive: activeMilestoneId === milestone.id,
                milestone,
                track: milestoneTrack,
                isCurrentlyPlaying: milestoneTrack && currentTrackId === milestoneTrack.id && isPlaying
            });

            // Add events
            milestone.events.forEach((event) => {
                const eventTrack = getTrackByProgressId(event.id);
                const eventContent = formatEventContent(event.title);
                items.push({
                    id: event.id,
                    type: 'event' as const,
                    title: event.title,
                    content: eventContent, // No date for events
                    isActive: activeEventId === event.id,
                    parentMilestoneId: milestone.id,
                    track: eventTrack,
                    isCurrentlyPlaying: eventTrack && currentTrackId === eventTrack.id && isPlaying
                });
            });
        });
        return items;
    }, [milestones, activeMilestoneId, activeEventId, tracks, currentTrackId, isPlaying, getTrackByProgressId]);

    // Memoized click handlers
    const handleMilestoneClick = useCallback((milestoneId: string) => {
        onNavigateToMilestone?.(milestoneId);
    }, [onNavigateToMilestone]);

    const handleEventClick = useCallback((eventId: string, milestoneId: string) => {
        onNavigateToEvent?.(eventId, milestoneId);
    }, [onNavigateToEvent]);

    const handleHeroClick = useCallback(() => {
        // Scroll to top or hero section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Audio control handlers - improved pause functionality
    const handlePlayAudio = useCallback(async (track: any) => {
        if (currentTrackId === track.id && isPlaying) {
            // Pause current track
            pauseTrack();
            // Dispatch pause event
            window.dispatchEvent(new CustomEvent('timeline-audio-pause'));
        } else {
            // Start/resume track
            playTrack(track.id);
            
            // Dispatch custom event for audio generation
            window.dispatchEvent(new CustomEvent('timeline-audio-play', {
                detail: { track }
            }));
        }
    }, [currentTrackId, isPlaying, playTrack, pauseTrack]);

    return (
        <div className="p-4 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="relative pl-2">
                <motion.div
                    className="space-y-4" 
                    layout
                >
                    {timelineItems.map((item, index) => {
                        const handleContentClick = () => {
                            if (item.type === 'hero') {
                                handleHeroClick();
                            } else if (item.type === 'milestone') {
                                handleMilestoneClick(item.id);
                            } else {
                                handleEventClick(item.id, item.parentMilestoneId!);
                            }
                        };

                        const handleAudioClick = (e: React.MouseEvent) => {
                            e.stopPropagation();
                            if (item.track) {
                                handlePlayAudio(item.track);
                            }
                        };

                        const hasAudio = !!item.track;
                        const isAudioLoading = isLoading && currentTrackId === item.track?.id;

                        return (
                            <TimelineProgressRowItem
                                key={item.id}
                                item={item}
                                index={index}
                                hasAudio={hasAudio}
                                isAudioLoading={isAudioLoading}
                                onContentClick={handleContentClick}
                                onAudioClick={handleAudioClick}
                            />
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};

export default TimelineProgressContent;