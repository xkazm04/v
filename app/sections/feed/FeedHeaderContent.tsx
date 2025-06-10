import LogoCard from "@/app/components/ui/Decorative/LogoCard";
import { Divider } from "@/app/components/ui/divider";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

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