'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import VideoPlayerVotingResults from './VideoPlayerVotingResults';

interface UserFeedback {
  agreed: number;
  disagreed: number;
  userVote: 'agree' | 'disagree' | null;
  showResults: boolean;
}

import { easeOut } from "framer-motion";

const likeButtonVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.05, rotate: 2 },
  tap: { scale: 0.95, rotate: -2 },
  liked: { 
    scale: [1, 1.2, 1], 
    rotate: [0, 10, 0],
    transition: { duration: 0.6, ease: easeOut }
  }
};

interface Props {
    isMobile?: boolean;
}

const VideoPlayerVoting = ({ isMobile = false }: Props) => {
    const { isDark, vintage } = useLayoutTheme();
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

    // Theme-aware colors
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
            // Vintage styling for light mode
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

    return (
        <div className="w-full" data-voting="true">
            <AnimatePresence mode="wait">
                {!feedback.showResults ? (
                    <motion.div
                        key="voting"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="grid grid-cols-2 gap-4"
                        data-voting="true"
                    >
                        {/* Agree Button */}
                        <motion.button
                            variants={likeButtonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            animate={feedback.userVote === 'agree' ? "liked" : "rest"}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent event bubbling
                                handleVote('agree');
                            }}
                            className={cn(
                                "voting-button vote-agree flex items-center justify-center gap-2 rounded-2xl font-bold text-base transition-all duration-300 relative overflow-hidden",
                                isMobile ? "py-4 px-3" : "py-3 px-4",
                                isDark ? "backdrop-blur-md" : "backdrop-blur-sm"
                            )}
                            style={getVoteButtonStyles('agree', feedback.userVote === 'agree')}
                            data-voting="true"
                        >
                            <ThumbsUp className={cn("transition-transform", isMobile ? "w-5 h-5" : "w-4 h-4")} />
                            <span className={cn("font-semibold", isDark ? "" : "tracking-wide")}>
                                {isDark ? "Agree" : "AGREE"}
                            </span>
                            
                            {/* Ripple effect */}
                            <motion.div
                                className="absolute inset-0 rounded-2xl"
                                style={{ backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : vintage.highlight }}
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
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent event bubbling
                                handleVote('disagree');
                            }}
                            className={cn(
                                "voting-button vote-disagree flex items-center justify-center gap-2 rounded-2xl font-bold text-base transition-all duration-300 relative overflow-hidden",
                                isMobile ? "py-4 px-3" : "py-3 px-4",
                                isDark ? "backdrop-blur-md" : "backdrop-blur-sm"
                            )}
                            style={getVoteButtonStyles('disagree', feedback.userVote === 'disagree')}
                            data-voting="true"
                        >
                            <ThumbsDown className={cn("transition-transform", isMobile ? "w-5 h-5" : "w-4 h-4")} />
                            <span className={cn("font-semibold", isDark ? "" : "tracking-wide")}>
                                {isDark ? "Disagree" : "DISAGREE"}
                            </span>
                            
                            {/* Ripple effect */}
                            <motion.div
                                className="absolute inset-0 rounded-2xl"
                                style={{ backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : vintage.aged }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={feedback.userVote === 'disagree' ? { scale: 1, opacity: [0, 1, 0] } : { scale: 0, opacity: 0 }}
                                transition={{ duration: 0.6 }}
                            />
                        </motion.button>
                    </motion.div>
                ) : (
                    <VideoPlayerVotingResults
                        agreePercentage={agreePercentage}
                        disagreePercentage={disagreePercentage}
                        feedback={feedback}
                        />
                )}
            </AnimatePresence>
        </div>
    );
};

export default VideoPlayerVoting;