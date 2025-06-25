import { itemVariants } from "@/app/components/animations/variants/votingVariants";
import { FloatingVerdictIcon } from "@/app/components/ui/Decorative/FloatingVerdictIcon";
import { Divider } from "@/app/components/ui/divider";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion } from "framer-motion";
import { ExternalLink, Calendar, MapPin, Users, AlertTriangle } from "lucide-react";
import DailyFooter from "./DailyFooter";
import { DailyProps } from "./FeedHeader";
import DailyMain from "./DailyMain";

const FeedHeaderContent = ({ config, currentTheme, textColors, mockStatement }: DailyProps) => {
  const { colors } = useLayoutTheme();
  
  return (
    <>
      <div className="relative z-10 p-8 h-full flex flex-col">
        <motion.div 
          variants={itemVariants}
          className="flex items-start justify-between mb-8"
        >
          <div className="flex items-start gap-6">
            <div className="relative">
              <FloatingVerdictIcon
                size="lg"
                confidence={mockStatement.impact_score}
                showConfidenceRing={true}
                delay={0}
                colors={{
                  glowColor: config.color,
                  backgroundColor: currentTheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
                }}
                className="transition-all duration-300 hover:scale-110"
              />
              
              {/* Impact severity indicator */}
              <motion.div
                className="absolute -bottom-2 -right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: config.color,
                  color: 'white'
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                <AlertTriangle size={10} />
                9.8
              </motion.div>
            </div>
            
            <div className="flex-1">
              <h1 className={`text-3xl font-bold ${textColors.primary} mb-2`}>
                Analysis of the day
              </h1>
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <div className={`flex items-center gap-2 ${textColors.secondary} text-sm`}>
                  <Calendar size={16} />
                  {mockStatement.dateDisplay}
                </div>
                <div className={`flex items-center gap-2 ${textColors.secondary} text-sm`}>
                  <MapPin size={16} />
                  {mockStatement.venue}
                </div>
                <div className={`flex items-center gap-2 ${textColors.secondary} text-sm`}>
                  <Users size={16} />
                  {mockStatement.reach}
                </div>
              </div>

              <div className={`${textColors.tertiary} text-sm mb-2`}>
                <span className="font-semibold">{mockStatement.speaker}</span>
                <span className="mx-2">•</span>
                <span className={textColors.warning}>{mockStatement.speakerTitle}</span>
              </div>
            </div>
          </div>
          
          <motion.a
            href={mockStatement.referenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:scale-105 ${textColors.tertiary} text-sm`}
            style={{
              borderColor: colors.border,
              backgroundColor: `${colors.background}80`
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <ExternalLink size={16} />
            UN Archive
          </motion.a>
        </motion.div>

        <DailyMain
          mockStatement={mockStatement}
          config={config}
          textColors={textColors}
          currentTheme={currentTheme}
        />
        <Divider />

        <DailyFooter
          mockStatement={mockStatement}
          config={config}
          textColors={textColors}
          currentTheme={currentTheme}
          />
      </div>
    </>
  );
};

export default FeedHeaderContent;