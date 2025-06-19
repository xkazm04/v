
import NewsCardSpeaker from "@/app/components/news/NewsCardSpeaker";
import { FloatingVerdictIcon } from "@/app/components/ui/Decorative/FloatingVerdictIcon";
import { Divider } from "@/app/components/ui/divider";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion, Variants } from "framer-motion";
import { Calendar } from "lucide-react";

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
    border: string;
  };
  mockStatement: {
    impact_score: number;
    text: string;
    verdict: string;
    source: string;
  };
}

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const FeedHeaderContent = ({ config, currentTheme, textColors, mockStatement }: Props) => {
  const { colors} = useLayoutTheme();
  return (
    <>
      <div className="relative z-10 p-8 h-full flex flex-col">
        {/* Header with App Branding */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-6">
            {/* Enhanced Floating Verdict Icon */}
            <div className="relative">
              <FloatingVerdictIcon
                size="md"
                confidence={mockStatement.impact_score}
                showConfidenceRing={true}
                delay={0}
                colors={{
                  glowColor: config.color,
                  backgroundColor: currentTheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
                }}
                className="transition-all duration-300 hover:scale-110"
              />
            </div>
            
            <div>
              <h1 className={`text-2xl font-bold ${textColors.primary} mb-1`}>
                Statement of the Day
              </h1>
              <div className={`flex items-center gap-2 ${textColors.tertiary} text-sm`}>
                {mockStatement.source}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Statement */}
        <motion.div 
          variants={itemVariants}
          className="flex-1 flex flex-col justify-center"
        >
          {/* Statement Text */}
          <motion.blockquote
            className={`text-xl md:text-2xl font-semibold ${textColors.primary} leading-relaxed mb-4`}
            style={{
              textShadow: currentTheme === 'light' 
                ? "0 1px 2px rgba(0,0,0,0.1)" 
                : "0 2px 4px rgba(0,0,0,0.3)"
            }}
          >
            "{mockStatement.text}"
          </motion.blockquote>
          
          {/* Quick Verdict with enhanced styling */}
          <motion.div className="relative pl-1.5">
            <motion.p
              className={`${textColors.secondary} font-serif leading-relaxed max-w-3xl px-2 relative z-10`}
              style={{ background: `${colors.background}80`, fontSize: '1.1rem' }}
            >
              {mockStatement.verdict}
            </motion.p>
            
            {/* Verdict accent line */}
            <motion.div
              className="absolute left-0 top-0 w-0.5 h-full rounded-full"
              style={{ backgroundColor: config.color }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '100%', opacity: 0.7 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
          </motion.div>
        </motion.div>
        
        <Divider />

        {/* Enhanced Footer */}
        <motion.div 
          variants={itemVariants}
          className={`flex items-center justify-between pt-6`}
        >
          <motion.div 
            className={`${textColors.tertiary} text-sm flex items-center gap-2`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <NewsCardSpeaker research={mockStatement} />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default FeedHeaderContent;