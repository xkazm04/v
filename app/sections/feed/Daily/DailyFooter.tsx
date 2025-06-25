import UniversalCardSpeaker from "@/app/components/shared/UniversalCardSpeaker";
import { itemVariants } from "@/app/helpers/animation";
import { Daily } from "@/app/types/research";
import { motion } from "framer-motion";
type Props = {
  config: {
    color: string;
    icon: React.ComponentType<any>;
    label: string;
  };
  currentTheme: 'light' | 'dark';
  textColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
    warning: string;
    border: string;
  };
  mockStatement: Daily
}


const DailyFooter = ({mockStatement, config, textColors, currentTheme}: Props) => {
    return <motion.div
        variants={itemVariants}
        className="flex items-center justify-between pt-6"
    >
        <motion.div
            className={`${textColors.tertiary} text-sm flex items-center gap-4`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <div className="flex items-center gap-2">
                <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: config.color }}
                />
                <UniversalCardSpeaker data={mockStatement} />
            </div>

            {/* ✅ NEW: Tags display */}
            <div className="flex items-center gap-2">
                {mockStatement.tags.slice(0, 3).map((tag, index) => (
                    <span
                        key={tag}
                        className="px-2 py-1 rounded text-xs"
                        style={{
                            backgroundColor: `${config.color}15`,
                            color: textColors.tertiary
                        }}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </motion.div>

        {/* ✅ ENHANCED: Impact score visualization */}
        <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
        >
            <span className={`${textColors.tertiary} text-sm font-medium`}>
                Impact Score:
            </span>
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: i < Math.floor(mockStatement.impact_score / 2)
                                ? config.color
                                : currentTheme === 'dark'
                                    ? 'rgba(255,255,255,0.2)'
                                    : 'rgba(0,0,0,0.2)'
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2.2 + i * 0.1 }}
                    />
                ))}
            </div>
        </motion.div>
    </motion.div>
}

export default DailyFooter;