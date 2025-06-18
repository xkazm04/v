import { FloatingVerdictIcon } from "@/app/components/ui/Decorative/FloatingVerdictIcon";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion, useSpring, MotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { AudioTrack } from "@/app/stores/useTimelineAudioStore";

type Props = {
    scrollProgressPercentage: MotionValue<number>;
}

const TimelineProgressHeader = ({ 
    scrollProgressPercentage, 
}: Props) => {
    const { colors, isDark } = useLayoutTheme();
    const [timelinePercentage, setTimelinePercentage] = useState(0);
    
    const smoothTimelineProgress = useSpring(0, {
        stiffness: 50,
        damping: 25,
        restDelta: 0.1
    });

    // Always track timeline progress in the header text
    useEffect(() => {
        const unsubscribe = scrollProgressPercentage.onChange((value) => {
            smoothTimelineProgress.set(value);
        });
        return unsubscribe;
    }, [scrollProgressPercentage, smoothTimelineProgress]);

    useEffect(() => {
        const unsubscribe = smoothTimelineProgress.onChange((value) => {
            setTimelinePercentage(Math.round(value));
        });
        return unsubscribe;
    }, [smoothTimelineProgress]);

    useEffect(() => {
        const initialProgress = scrollProgressPercentage.get();
        smoothTimelineProgress.set(initialProgress);
        setTimelinePercentage(Math.round(initialProgress));
    }, []);

    return (
        <div 
            className="px-4 py-3 border-b rounded-t-2xl" 
            style={{ 
                borderColor: colors.border + '30',
            }}
        >
            <div className="flex items-center justify-end mr-14">
                <div className="flex items-center gap-3">
                    {/* Timeline progress indicator */}
                    <motion.div
                        className="flex items-center gap-1"
                        style={{
                            color: colors.foreground + '60'
                        }}
                    >
                        <Clock className="w-3 h-3" />
                        <span className="text-xs font-medium">Progress</span>
                    </motion.div>
                    
                    {/* Timeline progress percentage */}
                    <div className="flex items-center gap-1">
                        <motion.span 
                            className="text-sm tabular-nums font-bold font-mono"
                            style={{ color: colors.primary }}
                        >
                            {timelinePercentage}%
                        </motion.span>
                    </div>
                </div>

                {/* FloatingVerdictIcon with audio progress only */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute -bottom-4 right-0"
                >
                    <FloatingVerdictIcon
                        size="sm"
                        confidence={Math.round(timelinePercentage)}
                        autoAnimate={true}
                        colors={{
                            glowColor: colors.primary,
                            ringColor: colors.primary,
                            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)'
                        }}
                        className="scale-90"
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default TimelineProgressHeader;