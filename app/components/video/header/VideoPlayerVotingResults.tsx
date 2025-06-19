import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { cn } from "@/app/lib/utils";
import { motion, easeOut } from "framer-motion";
import { ThumbsDown, ThumbsUp, Users } from "lucide-react";

type Props = {
    agreePercentage: number;
    disagreePercentage: number;
    feedback: {
        agreed: number;
        disagreed: number;
    };
}

const VideoPlayerVotingResults = ({agreePercentage,disagreePercentage, feedback}: Props) => {
    const { colors, isDark, vintage } = useLayoutTheme();
    const resultVariants = {
      hidden: { opacity: 0, y: 20, scale: 0.9 },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration: 0.5, ease: easeOut }
      },
      exit: { 
        opacity: 0, 
        y: -20, 
        scale: 0.9,
        transition: { duration: 0.3 }
      }
    };
    return <motion.div
        key="results"
        variants={resultVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-3"
        data-voting="true"
    >
        {/* Main Results Row */}
        <div className="flex items-center gap-4">
            {/* Public Opinion Label */}
            <motion.div
                className="flex items-center gap-2 flex-shrink-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
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
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className={cn(
                    "p-1 rounded-full",
                    isDark ? "bg-green-500/20" : "bg-green-100"
                )}>
                    <ThumbsUp className="w-3 h-3 text-green-500" />
                </div>
                <span className={cn(
                    "text-xs font-bold",
                    isDark ? "text-green-400" : "text-green-700",
                    !isDark && "tracking-wide"
                )}>
                    {feedback.agreed.toLocaleString()}
                </span>
            </motion.div>

            {/* Combined Progress Bar */}
            <motion.div
                className="flex-1 h-4 rounded-full overflow-hidden relative"
                style={{ backgroundColor: isDark ? `${colors.muted}60` : vintage.aged }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
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
                    transition={{ duration: 1.2, ease: easeOut, delay: 0.6 }}
                >
                    {/* Shine effect for vintage */}
                    {!isDark && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ delay: 1.8, duration: 0.8, ease: "easeInOut" }}
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
                    transition={{ duration: 1.2, ease: easeOut, delay: 0.7 }}
                >
                    {/* Shine effect for vintage */}
                    {!isDark && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ delay: 1.9, duration: 0.8, ease: "easeInOut" }}
                        />
                    )}
                </motion.div>
            </motion.div>

            {/* Compact Disagree Count */}
            <motion.div
                className="flex items-center gap-1 flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
            >
                <span className={cn(
                    "text-xs font-bold",
                    isDark ? "text-red-400" : "text-red-700",
                    !isDark && "tracking-wide"
                )}>
                    {feedback.disagreed.toLocaleString()}
                </span>
                <div className={cn(
                    "p-1 rounded-full",
                    isDark ? "bg-red-500/20" : "bg-red-100"
                )}>
                    <ThumbsDown className="w-3 h-3 text-red-500" />
                </div>
            </motion.div>
        </div>
    </motion.div>
}

export default VideoPlayerVotingResults;