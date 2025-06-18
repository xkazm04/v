import { FloatingVerdictIcon } from "@/app/components/ui/Decorative/FloatingVerdictIcon";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion, useSpring } from "framer-motion"
import { useEffect, useState } from "react";

type Props = {
    progressPercentage: {
        get: () => number;
    };
}

const TimelineProgressHeader = ({ progressPercentage }: Props) => {
    const { colors, isDark } = useLayoutTheme();
    const [displayPercentage, setDisplayPercentage] = useState(0);
    
    const smoothPercentage = useSpring(0, {
        stiffness: 50,
        damping: 25,
        restDelta: 0.1
    });

    useEffect(() => {
        const currentProgress = progressPercentage.get();
        smoothPercentage.set(currentProgress);
    }, [progressPercentage.get(), smoothPercentage]);

    useEffect(() => {
        const unsubscribe = smoothPercentage.onChange((value) => {
            setDisplayPercentage(Math.round(value));
        });
        return unsubscribe;
    }, [smoothPercentage]);
    useEffect(() => {
        const initialProgress = progressPercentage.get();
        smoothPercentage.set(initialProgress);
        setDisplayPercentage(Math.round(initialProgress));
    }, []);

    return (
        <div className="px-4 py-3 border-b" style={{ borderColor: colors.border + '30' }}>
            <div className="flex items-center justify-end">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <motion.span 
                            className="text-sm tabular-nums font-bold font-mono"
                            style={{ color: colors.primary }}
                            key={displayPercentage} 
                        >
                            {displayPercentage}%
                        </motion.span>
                    </div>
                </div>

                {/* FloatingVerdictIcon with smooth percentage */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className='absolute -top-10 right-0'
                >
                    <FloatingVerdictIcon
                        size="sm"
                        confidence={displayPercentage}
                        showConfidenceRing={true}
                        autoAnimate={false}
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