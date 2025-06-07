import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { formatTime } from '@/app/utils/format';
import { motion } from 'framer-motion';

type Props = {
    claim: {
        id: string;
        claim: string;
        type: 'truth' | 'lie' | 'neutral';
        confidence: number;
        timestamp: number;
    };
    timelineColors: {
        border: string;
    };
    index: number;
}

const TimelineClaimItem = ({claim, timelineColors, index }: Props) => {
    const { colors, isDark} = useLayoutTheme();
    return <motion.div
        key={claim.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex items-start space-x-2 text-xs p-2 rounded border"
        style={{
            backgroundColor: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(241, 245, 249, 0.5)',
            borderColor: timelineColors.border
        }}
    >
        <motion.div
            className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ${claim.type === 'truth' ? 'bg-green-500' :
                    claim.type === 'lie' ? 'bg-red-500' : 'bg-yellow-500'
                }`}
            animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                    '0 0 0px rgba(0,0,0,0)',
                    `0 0 8px ${claim.type === 'truth' ? '#22c55e' : claim.type === 'lie' ? '#ef4444' : '#eab308'}40`,
                    '0 0 0px rgba(0,0,0,0)'
                ]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
        />
        <div className="flex-1 min-w-0">
            <p
                className="line-clamp-2 leading-relaxed"
                style={{ color: colors.foreground }}
            >
                {claim.claim}
            </p>
            <div className="flex items-center justify-between mt-1">
                <span
                    className="text-xs font-medium"
                    style={{
                        color: claim.type === 'truth' ? '#22c55e' :
                            claim.type === 'lie' ? '#ef4444' : '#eab308'
                    }}
                >
                    {claim.confidence}% confidence
                </span>
                <span style={{ color: colors.mutedForeground }}>
                    {formatTime(claim.timestamp)}
                </span>
            </div>
        </div>
    </motion.div>
}

export default TimelineClaimItem;