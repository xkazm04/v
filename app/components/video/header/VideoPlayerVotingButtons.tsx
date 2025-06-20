import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion } from "framer-motion";
import { likeButtonVariants } from "../../animations/variants/votingVariants";
import { useViewport } from "@/app/hooks/useViewport";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/app/lib/utils";

type Props = {
    isTransitioning: boolean;
    feedback: {
        userVote: 'agree' | 'disagree' | null;
    };
    handleVote: (voteType: 'agree' | 'disagree') => void;
}

const VideoPlayerVotingButtons = ({isTransitioning, feedback, handleVote}: Props) => {
    const { isDark, vintage } = useLayoutTheme();
    const { isMobile } = useViewport();
    const getVoteButtonStyles = (voteType: 'agree' | 'disagree', isActive: boolean) => {
        const isAgree = voteType === 'agree';

        if (isDark) {
            return {
                backgroundColor: isActive
                    ? (isAgree ? '#22c55e25' : '#ef444425')
                    : (isAgree ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)'),
                border: `2px solid ${isActive
                    ? (isAgree ? '#22c55e' : '#ef4444')
                    : (isAgree ? '#22c55e50' : '#ef444450')
                    }`,
                color: isActive
                    ? (isAgree ? '#22c55e' : '#ef4444')
                    : (isAgree ? '#16a34a' : '#dc2626')
            };
        } else {
            return {
                backgroundColor: isActive
                    ? (isAgree ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)')
                    : (isAgree ? `${vintage.highlight}80` : `${vintage.aged}80`),
                border: `2px solid ${isActive
                    ? (isAgree ? '#16a34a' : '#dc2626')
                    : (isAgree ? `${vintage.sepia}80` : `${vintage.faded}60`)
                    }`,
                color: isActive
                    ? (isAgree ? '#16a34a' : '#dc2626')
                    : (isAgree ? '#15803d' : '#b91c1c'),
                boxShadow: isActive
                    ? `0 4px 12px ${isAgree ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    : vintage.shadow
            };
        }
    };

    
    return <>
        <motion.button
            variants={likeButtonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            animate={
                isTransitioning && feedback.userVote === 'agree' ? "votingToResults" :
                    feedback.userVote === 'agree' ? "liked" : "rest"
            }
            onClick={(e) => {
                e.stopPropagation();
                if (!isTransitioning) handleVote('agree');
            }}
            disabled={isTransitioning}
            className={cn(
                "voting-button vote-agree flex items-center justify-center gap-2 rounded-2xl font-bold text-base transition-all duration-300 relative overflow-hidden",
                isMobile ? "py-4 px-3" : "py-3 px-4",
                isDark ? "backdrop-blur-md" : "backdrop-blur-sm",
                isTransitioning && "pointer-events-none"
            )}
            style={getVoteButtonStyles('agree', feedback.userVote === 'agree')}
            data-voting="true"
        >
            <ThumbsUp className={cn("transition-transform", isMobile ? "w-5 h-5" : "w-4 h-4")} />
            <span className={cn("font-semibold", isDark ? "" : "tracking-wide")}>
                {isDark ? "Agree" : "AGREE"}
            </span>

            {/* Enhanced Ripple effect */}
            <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : vintage.highlight }}
                initial={{ scale: 0, opacity: 0 }}
                animate={feedback.userVote === 'agree' ? { scale: 1, opacity: [0, 1, 0] } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.6 }}
            />

            {/* Vote Success Effect */}
            {isTransitioning && feedback.userVote === 'agree' && (
                <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                        backgroundColor: isDark ? 'rgba(34, 197, 94, 0.4)' : vintage.highlight,
                        border: '2px solid #22c55e'
                    }}
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{
                        scale: [1, 1.05, 1.1],
                        opacity: [1, 0.8, 0],
                        borderWidth: ['2px', '3px', '4px']
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                />
            )}
        </motion.button>

        {/* Disagree Button */}
        <motion.button
            variants={likeButtonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            animate={
                isTransitioning && feedback.userVote === 'disagree' ? "votingToResults" :
                    feedback.userVote === 'disagree' ? "liked" : "rest"
            }
            onClick={(e) => {
                e.stopPropagation();
                if (!isTransitioning) handleVote('disagree');
            }}
            disabled={isTransitioning}
            className={cn(
                "voting-button vote-disagree flex items-center justify-center gap-2 rounded-2xl font-bold text-base transition-all duration-300 relative overflow-hidden",
                isMobile ? "py-4 px-3" : "py-3 px-4",
                isDark ? "backdrop-blur-md" : "backdrop-blur-sm",
                isTransitioning && "pointer-events-none"
            )}
            style={getVoteButtonStyles('disagree', feedback.userVote === 'disagree')}
            data-voting="true"
        >
            <ThumbsDown className={cn("transition-transform", isMobile ? "w-5 h-5" : "w-4 h-4")} />
            <span className={cn("font-semibold", isDark ? "" : "tracking-wide")}>
                {isDark ? "Disagree" : "DISAGREE"}
            </span>

            {/* Enhanced Ripple effect */}
            <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : vintage.aged }}
                initial={{ scale: 0, opacity: 0 }}
                animate={feedback.userVote === 'disagree' ? { scale: 1, opacity: [0, 1, 0] } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.6 }}
            />

            {/* Vote Success Effect */}
            {isTransitioning && feedback.userVote === 'disagree' && (
                <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.4)' : vintage.aged,
                        border: '2px solid #ef4444'
                    }}
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{
                        scale: [1, 1.05, 1.1],
                        opacity: [1, 0.8, 0],
                        borderWidth: ['2px', '3px', '4px']
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                />
            )}
        </motion.button>
    </>
}

export default VideoPlayerVotingButtons;