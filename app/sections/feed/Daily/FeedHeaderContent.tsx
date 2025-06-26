import { memo } from "react";
import { motion, Variants } from "framer-motion";
import { ExternalLink, Calendar, MapPin, Users, AlertTriangle } from "lucide-react";
import { FloatingVerdictIcon } from "@/app/components/ui/Decorative/FloatingVerdictIcon";
import { Divider } from "@/app/components/ui/divider";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import DailyFooter from "./DailyFooter";
import { DailyProps } from "./FeedHeader";
import DailyMain from "./DailyMain";

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1
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

const FeedHeaderContent = memo(({ config, currentTheme, textColors, mockStatement }: DailyProps) => {
  const { colors } = useLayoutTheme();
  
  return (
    <motion.div 
      className="relative p-8 h-full flex flex-col"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        variants={itemVariants}
        className="flex items-start justify-between mb-6"
      >
        <div className="flex items-start gap-6 flex-1">
          <div className="relative flex-shrink-0">
            <FloatingVerdictIcon
              size="lg"
              confidence={mockStatement.impact_score}
              showConfidenceRing={true}
              delay={0}
              colors={{
                glowColor: config.color,
                backgroundColor: currentTheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
              }}
              className="transition-transform duration-200 hover:scale-105"
            />
            

            <motion.div
              className="absolute -bottom-2 -right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
              style={{
                backgroundColor: config.color,
                color: 'white'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.2 }}
            >
              <AlertTriangle size={10} />
              {mockStatement.impact_score}
            </motion.div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className={`text-2xl sm:text-3xl font-bold ${textColors.primary} mb-3`}>
              Analysis of the day
            </h1>

            <div className="space-y-2 mb-3">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className={`flex items-center gap-2 ${textColors.secondary}`}>
                  <Calendar size={14} />
                  {mockStatement.dateDisplay}
                </div>
                <div className={`flex items-center gap-2 ${textColors.secondary}`}>
                  <MapPin size={14} />
                  {mockStatement.venue}
                </div>
                <div className={`flex items-center gap-2 ${textColors.secondary}`}>
                  <Users size={14} />
                  {mockStatement.reach}
                </div>
              </div>
              
              <div className={`${textColors.tertiary} text-sm`}>
                <span className="font-semibold">{mockStatement.speaker}</span>
                <span className="mx-2">•</span>
                <span className={textColors.warning}>{mockStatement.speakerTitle}</span>
              </div>
            </div>
          </div>
        </div>
        
        <motion.a
          href={mockStatement.referenceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors duration-200 ${textColors.tertiary} text-sm flex-shrink-0`}
          style={{
            borderColor: colors.border,
            backgroundColor: `${colors.background}80`
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ExternalLink size={14} />
          <span className="hidden sm:inline">Archive</span>
        </motion.a>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-1 flex flex-col">
        <DailyMain
          mockStatement={mockStatement}
          config={config}
          textColors={textColors}
          currentTheme={currentTheme}
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Divider />
        <DailyFooter
          mockStatement={mockStatement}
          config={config}
          textColors={textColors}
          currentTheme={currentTheme}
        />
      </motion.div>
    </motion.div>
  );
});

FeedHeaderContent.displayName = 'FeedHeaderContent';

export default FeedHeaderContent;