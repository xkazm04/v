import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useViewport } from "@/app/hooks/useViewport";
import { motion } from "framer-motion";
import { BookOpen, X } from "lucide-react";
import { contentVariants } from "../../animations/variants/placeholderVariants";

type Props = {
    timeline: {
        title: string;
        timeSpan: string;
        milestones: Array<any>;
    };
    onClose: () => void;
}

const TimelineSummaryHeader = ({timeline, onClose}: Props) => {
      const { colors, isDark, vintage } = useLayoutTheme();
      const { isMobile } = useViewport();
    return <motion.div
        className="relative p-6 border-b"
        style={{ borderColor: isDark ? colors.border : vintage.crease }}
        variants={contentVariants}
    >
        {/* Close Button */}
        <motion.button
            className="absolute top-4 right-4 p-2 rounded-full transition-colors"
            style={{
                backgroundColor: colors.muted,
                color: colors.foreground
            }}
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
        >
            <X className="w-5 h-5" />
        </motion.button>

        {/* Title Section */}
        <div className="pr-12">
            <motion.div
                className="flex items-center gap-3 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: colors.primary + '15' }}
                >
                    <BookOpen className="w-6 h-6" style={{ color: colors.primary }} />
                </div>
                <h1
                    className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}
                    style={{ color: isDark ? colors.foreground : vintage.ink }}
                >
                    Timeline Summary
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h2
                    className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'} mb-1`}
                    style={{ color: colors.primary }}
                >
                    {timeline.title}
                </h2>
                <p
                    className={`opacity-70 ${isMobile ? 'text-sm' : 'text-base'}`}
                    style={{ color: isDark ? colors.mutedForeground : vintage.faded }}
                >
                    {timeline.timeSpan} • {timeline.milestones.length} Major Milestones
                </p>
            </motion.div>
        </div>
    </motion.div>
}

export default TimelineSummaryHeader;