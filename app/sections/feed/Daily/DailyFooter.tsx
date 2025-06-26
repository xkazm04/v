import { memo } from "react";
import { motion } from "framer-motion";
import UniversalCardSpeaker from "@/app/components/shared/UniversalCardSpeaker";
import { Daily } from "@/app/types/research";

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

const DailyFooter = memo(({ mockStatement, config, textColors, currentTheme }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6">
      <div className={`${textColors.tertiary} text-sm flex flex-wrap items-center gap-4`}>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: config.color }}
          />
          <UniversalCardSpeaker data={mockStatement} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {mockStatement.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded text-xs whitespace-nowrap"
              style={{
                backgroundColor: `${config.color}15`,
                color: textColors.tertiary
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        className="flex items-center gap-2 flex-shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <span className={`${textColors.tertiary} text-sm font-medium`}>
          Impact:
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-colors duration-200"
              style={{
                backgroundColor: i < Math.floor(mockStatement.impact_score / 2)
                  ? config.color
                  : currentTheme === 'dark'
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(0,0,0,0.2)'
              }}
            />
          ))}
        </div>
        <span className={`${textColors.tertiary} text-sm ml-1`}>
          {mockStatement.impact_score}
        </span>
      </motion.div>
    </div>
  );
});

DailyFooter.displayName = 'DailyFooter';

export default DailyFooter;