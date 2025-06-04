import LogoCard from "@/app/components/ui/Decorative/LogoCard";
import { Divider } from "@/app/components/ui/divider";
import { motion } from "framer-motion";
import { Calendar, TrendingUp } from "lucide-react";

type Props = {
  config: {
    color: string;
    icon: React.ComponentType<any>;
    label: string;
  };
  currentTheme: 'light' | 'dark';
  itemVariants: any;
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
    reach: string;
  };
}

const FeedHeaderContent = ({config, currentTheme, itemVariants, textColors, mockStatement}: Props) => {
    return <>
    <div className="relative z-10 p-8 h-full flex flex-col">
        {/* Header with App Branding */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            {/* App Logo "V" with unique typography */}
            <LogoCard 
              config={config} 
              currentTheme={currentTheme}
              />
            
            <div>
              <h1 className={`text-2xl font-bold ${textColors.primary} mb-1`}>
                Statement of the Day
              </h1>
              <div className={`flex items-center gap-2 ${textColors.tertiary} text-sm`}>
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
          
          {/* Impact Score */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <div className={`text-3xl font-black ${textColors.primary} mb-1`}>
              {mockStatement.impact_score}
            </div>
            <div className={`text-xs ${textColors.tertiary} flex items-center gap-1`}>
              <TrendingUp className="w-3 h-3" />
              Impact Score
            </div>
          </motion.div>
        </motion.div>

        {/* Main Statement */}
        <motion.div 
          variants={itemVariants}
          className="flex-1 flex flex-col justify-center"
        >
          {/* Status Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 w-fit"
            style={{
              background: `${config.color}${currentTheme === 'light' ? '15' : '20'}`,
              border: `2px solid ${config.color}${currentTheme === 'light' ? '40' : '60'}`,
              boxShadow: `0 4px 20px ${config.color}${currentTheme === 'light' ? '20' : '30'}`
            }}
            whileHover={{ scale: 1.05 }}
          >
            <config.icon className="w-5 h-5" style={{ color: config.color }} />
            <span 
              className="font-bold text-sm tracking-wide"
              style={{ color: config.color }}
            >
              {config.label}
            </span>
          </motion.div>
          
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
          
          {/* Quick Verdict */}
          <motion.p
            className={`${textColors.secondary} leading-relaxed max-w-3xl`}
            style={{ fontSize: '1.1rem' }}
          >
            {mockStatement.verdict}
          </motion.p>
        </motion.div>
        <Divider />

        {/* Footer */}
        <motion.div 
          variants={itemVariants}
          className={`flex items-center justify-between pt-6`}
        >
          <div className={`${textColors.tertiary} text-sm`}>
            Source: <span className="font-medium">{mockStatement.source}</span>
          </div>
          <div className={`${textColors.tertiary} text-sm`}>
            Reach: <span className="font-medium">{mockStatement.reach}</span>
          </div>
        </motion.div>
      </div>
    </>
}

export default FeedHeaderContent;