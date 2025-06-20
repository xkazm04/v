import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { cn } from "@/app/lib/utils";
import { motion } from "framer-motion";
import { ThumbsDown, ThumbsUp, Users } from "lucide-react";
import { containerVariants, itemVariants, progressBarVariants } from "../../animations/variants/votingVariants";

type Props = {
    agreePercentage: number;
    disagreePercentage: number;
    feedback: {
        agreed: number;
        disagreed: number;
    };
    userVote?: 'agree' | 'disagree' | null;
    isMobile?: boolean;
}

const VideoPlayerVotingResults = ({
    agreePercentage, 
    disagreePercentage, 
    feedback, 
    userVote = null,
    isMobile = false
}: Props) => {
    const { colors, isDark, vintage } = useLayoutTheme();

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
            data-voting="true"
        >
            {/* Main Results Row */}
            <motion.div 
                className="flex items-center gap-4"
                variants={itemVariants}
            >
                {/* Public Opinion Label */}
                <motion.div
                    className="flex items-center gap-2 flex-shrink-0"
                    variants={itemVariants}
                >
                    <Users className={cn("w-4 h-4", isDark ? "text-slate-400" : "text-vintage-faded")} />
                    <span className={cn(
                        "font-semibold text-sm whitespace-nowrap",
                        isDark ? "text-slate-300" : "text-vintage-ink",
                        !isDark && "tracking-wide uppercase"
                    )}>
                        {isDark ? "Community Verdict" : "Public OPINION"}
                    </span>
                </motion.div>

                {/* Compact Agree Count */}
                <motion.div
                    className="flex items-center gap-1 flex-shrink-0"
                    variants={itemVariants}
                >
                    <div className={cn(
                        "p-1 rounded-full transition-all duration-300",
                        isDark ? "bg-green-500/20" : "bg-green-100",
                        userVote === 'agree' && "ring-2 ring-green-500/40 bg-green-500/30"
                    )}>
                        <ThumbsUp className={cn(
                            "w-3 h-3 text-green-500 transition-transform duration-300",
                            userVote === 'agree' && "scale-110"
                        )} />
                    </div>
                    <span className={cn(
                        "text-xs font-bold transition-all duration-300",
                        isDark ? "text-green-400" : "text-green-700",
                        !isDark && "tracking-wide",
                        userVote === 'agree' && "scale-105 font-extrabold"
                    )}>
                        {feedback.agreed.toLocaleString()}
                    </span>
                </motion.div>

                {/* Combined Progress Bar */}
                <motion.div
                    className="flex-1 h-4 rounded-full overflow-hidden relative"
                    style={{ backgroundColor: isDark ? `${colors.muted}60` : vintage.aged }}
                    variants={progressBarVariants}
                >
                    {/* Agree Section */}
                    <motion.div
                        className="absolute left-0 top-0 h-full"
                        style={{
                            backgroundColor: isDark ? '#22c55e' : '#16a34a',
                            boxShadow: isDark ? 'none' : `inset 0 1px 2px rgba(0,0,0,0.1)`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${agreePercentage}%` }}
                        transition={{ 
                            duration: 1.2, 
                            ease: "easeOut", 
                            delay: 0.5
                        }}
                    >
                        {/* Enhanced Shine effect for vintage */}
                        {!isDark && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ 
                                    delay: 1.7, 
                                    duration: 0.8, 
                                    ease: "easeInOut",
                                    repeat: userVote === 'agree' ? 1 : 0
                                }}
                            />
                        )}
                        
                        {/* User vote highlight */}
                        {userVote === 'agree' && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ 
                                    duration: 1.5,
                                    delay: 1.8,
                                    ease: "easeInOut"
                                }}
                            />
                        )}
                    </motion.div>

                    {/* Disagree Section */}
                    <motion.div
                        className="absolute right-0 top-0 h-full"
                        style={{
                            backgroundColor: isDark ? '#ef4444' : '#dc2626',
                            boxShadow: isDark ? 'none' : `inset 0 1px 2px rgba(0,0,0,0.1)`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${disagreePercentage}%` }}
                        transition={{ 
                            duration: 1.2, 
                            ease: "easeOut", 
                            delay: 0.6
                        }}
                    >
                        {/* Enhanced Shine effect for vintage */}
                        {!isDark && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ 
                                    delay: 1.8, 
                                    duration: 0.8, 
                                    ease: "easeInOut",
                                    repeat: userVote === 'disagree' ? 1 : 0
                                }}
                            />
                        )}
                        
                        {/* User vote highlight */}
                        {userVote === 'disagree' && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ 
                                    duration: 1.5,
                                    delay: 1.9,
                                    ease: "easeInOut"
                                }}
                            />
                        )}
                    </motion.div>
                </motion.div>

                {/* Compact Disagree Count */}
                <motion.div
                    className="flex items-center gap-1 flex-shrink-0"
                    variants={itemVariants}
                >
                    <span className={cn(
                        "text-xs font-bold transition-all duration-300",
                        isDark ? "text-red-400" : "text-red-700",
                        !isDark && "tracking-wide",
                        userVote === 'disagree' && "scale-105 font-extrabold"
                    )}>
                        {feedback.disagreed.toLocaleString()}
                    </span>
                    <div className={cn(
                        "p-1 rounded-full transition-all duration-300",
                        isDark ? "bg-red-500/20" : "bg-red-100",
                        userVote === 'disagree' && "ring-2 ring-red-500/40 bg-red-500/30"
                    )}>
                        <ThumbsDown className={cn(
                            "w-3 h-3 text-red-500 transition-transform duration-300",
                            userVote === 'disagree' && "scale-110"
                        )} />
                    </div>
                </motion.div>
            </motion.div>

            {/* Enhanced Your Vote Indicator */}
            {userVote && (
                <motion.div
                    className={cn(
                        "flex items-center justify-center gap-2 py-2 px-4 rounded-xl",
                        isDark ? "backdrop-blur-md" : "backdrop-blur-sm"
                    )}
                    style={{
                        backgroundColor: userVote === 'agree' 
                            ? (isDark ? '#22c55e20' : 'rgba(34, 197, 94, 0.1)')
                            : (isDark ? '#ef444420' : 'rgba(239, 68, 68, 0.1)'),
                        border: `1px solid ${userVote === 'agree' 
                            ? (isDark ? '#22c55e40' : '#16a34a60')
                            : (isDark ? '#ef444440' : '#dc262660')
                        }`,
                        boxShadow: isDark ? 'none' : vintage.shadow
                    }}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                        delay: 0.8,
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                    }}
                    data-voting="true"
                >
                    {userVote === 'agree' ? (
                        <ThumbsUp className="w-3 h-3 text-green-500" />
                    ) : (
                        <ThumbsDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={cn(
                        "text-xs font-medium",
                        isDark ? "" : "tracking-wide uppercase"
                    )}
                    style={{ 
                        color: userVote === 'agree' 
                            ? (isDark ? '#22c55e' : '#16a34a')
                            : (isDark ? '#ef4444' : '#dc2626')
                    }}>
                        {isDark 
                            ? `You ${userVote}d`
                            : `YOU ${userVote.toUpperCase()}D`
                        }
                    </span>
                </motion.div>
            )}
        </motion.div>
    );
}

export default VideoPlayerVotingResults;