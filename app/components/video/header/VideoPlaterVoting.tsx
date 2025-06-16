import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react";
import { ThumbsUp, ThumbsDown, Users } from 'lucide-react';
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { cn } from "@/app/lib/utils";

interface UserFeedback {
  agreed: number;
  disagreed: number;
  userVote: 'agree' | 'disagree' | null;
  showResults: boolean;
}

const likeButtonVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.05, rotate: 2 },
  tap: { scale: 0.95, rotate: -2 },
  liked: { 
    scale: [1, 1.2, 1], 
    rotate: [0, 10, 0],
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const resultVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 0.9,
    transition: { duration: 0.3 }
  }
};

type Props = {
    isMobile?: boolean;
}


const VideoPlayerVoting = ({isMobile}: Props) => {
    const { colors, isDark } = useLayoutTheme();
    const [feedback, setFeedback] = useState<UserFeedback>({
        agreed: 847,
        disagreed: 123,
        userVote: null,
        showResults: false
    });
    const handleVote = (vote: 'agree' | 'disagree') => {
        setFeedback(prev => {
            const newFeedback = { ...prev };

            // Remove previous vote if exists
            if (prev.userVote === 'agree') {
                newFeedback.agreed -= 1;
            } else if (prev.userVote === 'disagree') {
                newFeedback.disagreed -= 1;
            }

            // Add new vote
            if (vote === 'agree') {
                newFeedback.agreed += 1;
            } else {
                newFeedback.disagreed += 1;
            }

            newFeedback.userVote = vote;
            newFeedback.showResults = true;

            return newFeedback;
        });
    };

    const totalVotes = feedback.agreed + feedback.disagreed;
    const agreePercentage = totalVotes > 0 ? (feedback.agreed / totalVotes) * 100 : 0;
    const disagreePercentage = totalVotes > 0 ? (feedback.disagreed / totalVotes) * 100 : 0;
    return <AnimatePresence mode="wait">
        {!feedback.showResults ? (
            <motion.div
                key="voting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="grid grid-cols-2 gap-3" // Reduced gap
            >
                {/* Agree Button */}
                <motion.button
                    variants={likeButtonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    animate={feedback.userVote === 'agree' ? "liked" : "rest"}
                    onClick={() => handleVote('agree')}
                    className={cn(
                        "flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-base transition-all duration-300 relative overflow-hidden",
                        isMobile ? "py-4" : "py-3" // Reduced padding
                    )}
                    style={{
                        backgroundColor: feedback.userVote === 'agree'
                            ? '#22c55e25'
                            : isDark ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.08)',
                        border: `2px solid ${feedback.userVote === 'agree' ? '#22c55e' : '#22c55e50'}`,
                        color: feedback.userVote === 'agree' ? '#22c55e' : '#16a34a'
                    }}
                >
                    <ThumbsUp className={cn("transition-transform", isMobile ? "w-5 h-5" : "w-4 h-4")} />
                    <span>Agree</span>

                    {/* Ripple effect */}
                    <motion.div
                        className="absolute inset-0 bg-green-500/20 rounded-2xl"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={feedback.userVote === 'agree' ? { scale: 1, opacity: [0, 1, 0] } : { scale: 0, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    />
                </motion.button>

                {/* Disagree Button */}
                <motion.button
                    variants={likeButtonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    animate={feedback.userVote === 'disagree' ? "liked" : "rest"}
                    onClick={() => handleVote('disagree')}
                    className={cn(
                        "flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-base transition-all duration-300 relative overflow-hidden",
                        isMobile ? "py-4" : "py-3" // Reduced padding
                    )}
                    style={{
                        backgroundColor: feedback.userVote === 'disagree'
                            ? '#ef444425'
                            : isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)',
                        border: `2px solid ${feedback.userVote === 'disagree' ? '#ef4444' : '#ef444450'}`,
                        color: feedback.userVote === 'disagree' ? '#ef4444' : '#dc2626'
                    }}
                >
                    <ThumbsDown className={cn("transition-transform", isMobile ? "w-5 h-5" : "w-4 h-4")} />
                    <span>Disagree</span>

                    {/* Ripple effect */}
                    <motion.div
                        className="absolute inset-0 bg-red-500/20 rounded-2xl"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={feedback.userVote === 'disagree' ? { scale: 1, opacity: [0, 1, 0] } : { scale: 0, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    />
                </motion.button>
            </motion.div>
        ) : (
            /* Compact Results Display */
            <motion.div
                key="results"
                variants={resultVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-3" // Reduced space
            >
                {/* Results Header */}
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold" style={{ color: colors.foreground }}>
                        Community Feedback
                    </h3>
                    <div className="flex items-center gap-2 px-2 py-1 rounded-full text-sm"
                        style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                        <Users className="w-3 h-3" />
                        <span className="font-semibold">{totalVotes.toLocaleString()}</span>
                    </div>
                </div>

                {/* Compact Visual Results */}
                <div className="space-y-2">
                    {/* Agree Bar */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <ThumbsUp className="w-3.5 h-3.5 text-green-500" />
                            <span className="font-semibold text-green-500 text-sm">
                                {agreePercentage.toFixed(0)}%
                            </span>
                        </div>
                        <div className="flex-1 h-2.5 rounded-full overflow-hidden"
                            style={{ backgroundColor: `${colors.muted}60` }}>
                            <motion.div
                                className="h-full bg-green-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${agreePercentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                        <span className="text-xs font-medium min-w-[50px] text-right"
                            style={{ color: colors.mutedForeground }}>
                            {feedback.agreed.toLocaleString()}
                        </span>
                    </div>

                    {/* Disagree Bar */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 min-w-[70px]">
                            <ThumbsDown className="w-3.5 h-3.5 text-red-500" />
                            <span className="font-semibold text-red-500 text-sm">
                                {disagreePercentage.toFixed(0)}%
                            </span>
                        </div>
                        <div className="flex-1 h-2.5 rounded-full overflow-hidden"
                            style={{ backgroundColor: `${colors.muted}60` }}>
                            <motion.div
                                className="h-full bg-red-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${disagreePercentage}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            />
                        </div>
                        <span className="text-xs font-medium min-w-[50px] text-right"
                            style={{ color: colors.mutedForeground }}>
                            {feedback.disagreed.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Compact Your Vote Indicator */}
                {feedback.userVote && (
                    <motion.div
                        className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl mt-3"
                        style={{
                            backgroundColor: feedback.userVote === 'agree' ? '#22c55e20' : '#ef444420',
                            border: `1px solid ${feedback.userVote === 'agree' ? '#22c55e40' : '#ef444440'}`
                        }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {feedback.userVote === 'agree' ? (
                            <ThumbsUp className="w-3 h-3 text-green-500" />
                        ) : (
                            <ThumbsDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className="text-xs font-medium"
                            style={{ color: feedback.userVote === 'agree' ? '#22c55e' : '#ef4444' }}>
                            You {feedback.userVote}d
                        </span>
                    </motion.div>
                )}
            </motion.div>
        )}
    </AnimatePresence>
}

export default VideoPlayerVoting;