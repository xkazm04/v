import { memo } from "react";
import { motion, Variants } from "framer-motion";
import { DailyProps } from "./FeedHeader";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const DailyMain = memo(({ mockStatement, config, textColors, currentTheme }: DailyProps) => {
  const { isDark } = useLayoutTheme();
  
  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 flex flex-col justify-center mb-6"
    >
      <motion.blockquote
        variants={itemVariants}
        className={`text-xl sm:text-2xl md:text-3xl font-bold ${textColors.primary} leading-relaxed mb-6 relative px-8`}
        style={{
          textShadow: currentTheme === 'light'
            ? "0 1px 3px rgba(0,0,0,0.1)"
            : "0 2px 4px rgba(0,0,0,0.3)"
        }}
      >
        <span className="text-4xl sm:text-6xl opacity-20 absolute -top-2 left-0 select-none">"</span>
        <span className="relative">{mockStatement.text}</span>
        <span className="text-4xl sm:text-6xl opacity-20 absolute -bottom-6 right-0 select-none">"</span>
      </motion.blockquote>

      <motion.div variants={itemVariants} className="relative pl-4 mb-6">
        <motion.p
          className={`font-serif text-base border border-gray-300/50 sm:text-lg leading-relaxed max-w-4xl px-4 py-3 relative rounded-lg
            ${isDark ? 'bg-gray-950/50' : 'bg-yellow-50/90'} `}
        >
          <span className="font-bold">VERDICT:</span> {mockStatement.verdict}
        </motion.p>
        <div
          className="absolute left-0 top-0 w-1 h-full rounded-full opacity-80"
          style={{ backgroundColor: config.color }}
        />
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r min-h-[120px] from-yellow-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 sm:p-6 rounded-xl border border-red-200 dark:border-red-700/30"
      >
        <div className="flex items-start gap-3">
          <div>
            <h3 className={`${textColors.accent} font-bold text-lg mb-2`}>
              Lesson learned
            </h3>
            <p className={`${textColors.secondary} leading-relaxed text-sm sm:text-base`}>
              {mockStatement.impactDescription}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

DailyMain.displayName = 'DailyMain';

export default DailyMain;