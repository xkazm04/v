import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayerVotingResults from './VideoPlayerVotingResults';
import { resultsVariants, votingResultsContainerVariants, votingVariants } from '../../animations/variants/votingVariants';
import VideoPlayerVotingButtons from './VideoPlayerVotingButtons';

interface UserFeedback {
  agreed: number;
  disagreed: number;
  userVote: 'agree' | 'disagree' | null;
  showResults: boolean;
}
interface Props {
    isMobile?: boolean;
}

const VideoPlayerVoting = ({ isMobile = false }: Props) => {
    const [feedback, setFeedback] = useState<UserFeedback>({
        agreed: 847,
        disagreed: 123,
        userVote: null,
        showResults: false
    });
    
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleVote = (vote: 'agree' | 'disagree') => {
        setIsTransitioning(true);

        setTimeout(() => {
            setFeedback(prev => {
                const newFeedback = { ...prev };

                if (prev.userVote === 'agree') {
                    newFeedback.agreed -= 1;
                } else if (prev.userVote === 'disagree') {
                    newFeedback.disagreed -= 1;
                }

                if (vote === 'agree') {
                    newFeedback.agreed += 1;
                } else {
                    newFeedback.disagreed += 1;
                }

                newFeedback.userVote = vote;
                newFeedback.showResults = true;

                return newFeedback;
            });
            
            setTimeout(() => {
                setIsTransitioning(false);
            }, 200);
        }, 300);
    };

    const totalVotes = feedback.agreed + feedback.disagreed;
    const agreePercentage = totalVotes > 0 ? (feedback.agreed / totalVotes) * 100 : 0;
    const disagreePercentage = totalVotes > 0 ? (feedback.disagreed / totalVotes) * 100 : 0;



    const getContainerState = () => {
        if (isTransitioning) return 'transitioning';
        if (feedback.showResults) return 'results';
        return 'voting';
    };

    return (
        <motion.div 
            ref={containerRef}
            className="w-full overflow-hidden" 
            data-voting="true"
            variants={votingResultsContainerVariants}
            animate={getContainerState()}
            style={{
                minHeight: isMobile ? '80px' : '72px' // Consistent minimum height
            }}
        >
            <div className="relative">
                <AnimatePresence mode="wait">
                    {!feedback.showResults ? (
                        <motion.div
                            key="voting"
                            variants={votingVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="grid grid-cols-2 gap-4"
                            data-voting="true"
                        >
                            <VideoPlayerVotingButtons
                                feedback={feedback}
                                isTransitioning={isTransitioning}
                                handleVote={handleVote}
                            />

                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            variants={resultsVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <VideoPlayerVotingResults
                                agreePercentage={agreePercentage}
                                disagreePercentage={disagreePercentage}
                                feedback={feedback}
                                userVote={feedback.userVote}
                                isMobile={isMobile}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default VideoPlayerVoting;