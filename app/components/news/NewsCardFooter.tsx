import { memo, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ResearchResult } from '@/app/types/article';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { formatSafeDate } from '@/app/helpers/dateHelpers';
import { Clock } from 'lucide-react';

type Props = {
  research: ResearchResult;
  layout: 'grid' | 'compact';
  isHovered: boolean;
}

const headerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: { duration: 0.2 }
  }
};

export const NewsCardFooter = memo(function NewsCardFooter({
  research,
  layout,
}: Props) {
  const { colors, isDark } = useLayoutTheme();
  const dateInfo = useMemo(() => formatSafeDate(research.processed_at), [research.processed_at]);
  
  return (
    <AnimatePresence>
      <motion.div
        key="research-header"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          "relative w-full overflow-hidden rounded-t-lg",
          "flex items-center justify-between px-3 py-2"
        )}
      >        
        {/* Content - Highest z-index for clickability */}
        <div 
          className="relative w-full flex items-center justify-end"
          style={{ zIndex: 10 }} 
        >

          {/* Right Side - Date with better styling */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Clock 
              className="w-3 h-3 drop-shadow-sm" 
              style={{ 
                color: colors.mutedForeground,
                filter: isDark 
                  ? 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' 
                  : 'drop-shadow(0 1px 1px rgba(255,255,255,0.8))'
              }} 
            />
            <span
              className={cn(
                "text-xs font-medium",
                "drop-shadow-sm whitespace-nowrap"
              )}
              style={{ 
                color: colors.mutedForeground,
                textShadow: isDark 
                  ? '0 1px 1px rgba(0,0,0,0.8)' 
                  : '0 1px 1px rgba(255,255,255,0.8)'
              }}
              title={dateInfo.absolute}
            >
              {dateInfo.relative}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});