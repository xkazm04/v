import { itemVariants } from "@/app/helpers/animation";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { DailyProps } from "./FeedHeader";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";

const DailyMain = ({ mockStatement, config, textColors, currentTheme }: DailyProps) => {
    const { colors } = useLayoutTheme();
    return <motion.div
        variants={itemVariants}
        className="flex-1 flex flex-col justify-center mb-8"
    >
        {/* Statement Text with enhanced typography */}
        <motion.blockquote
            className={`text-2xl md:text-3xl font-bold ${textColors.primary} leading-relaxed mb-6 relative`}
            style={{
                textShadow: currentTheme === 'light'
                    ? "0 2px 4px rgba(0,0,0,0.1)"
                    : "0 3px 6px rgba(0,0,0,0.4)"
            }}
        >
            <span className="text-6xl opacity-20 absolute -top-4 -left-2">"</span>
            <span className="relative z-10">{mockStatement.text}</span>
            <span className="text-6xl opacity-20 absolute -bottom-8 right-0">"</span>
        </motion.blockquote>

        <motion.div className="relative pl-6 mb-6">
            <motion.p
                className={`${textColors.accent} font-serif text-lg leading-relaxed max-w-4xl px-4 py-3 relative z-10 rounded-lg`}
                style={{
                    background: `${colors.background}90`,
                    border: `2px solid ${config.color}40`
                }}
            >
                <span className="font-bold">VERDICT:</span> {mockStatement.verdict}
            </motion.p>

            {/* Enhanced accent line */}
            <motion.div
                className="absolute left-0 top-0 w-1 h-full rounded-full"
                style={{ backgroundColor: config.color }}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: '100%', opacity: 0.8 }}
                transition={{ delay: 1, duration: 0.8 }}
            />
        </motion.div>

        <motion.div
            className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-red-200 dark:border-red-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
        >
            <div className="flex items-start gap-3">
                <AlertTriangle className={`${textColors.accent} mt-1`} size={20} />
                <div>
                    <h3 className={`${textColors.accent} font-bold text-lg mb-2`}>
                        Lesson learned from
                    </h3>
                    <p className={`${textColors.secondary} leading-relaxed`}>
                        {mockStatement.impactDescription}
                    </p>
                </div>
            </div>
        </motion.div>
    </motion.div>
}

export default DailyMain;