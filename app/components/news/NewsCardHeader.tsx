import { memo, useMemo, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ResearchResult } from '@/app/types/article';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { cn } from '@/app/lib/utils';
import { formatSafeDate } from '@/app/helpers/dateHelpers';
import { Clock, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface NewsCardHeaderProps {
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

export const NewsCardHeader = memo(function NewsCardHeader({
  research,
  layout,
}: NewsCardHeaderProps) {
  const { colors, isDark } = useLayoutTheme();
  const { isMobile } = useViewport();
  const router = useRouter();
  const [isSourceHovered, setIsSourceHovered] = useState(false);
  
  const dateInfo = useMemo(() => formatSafeDate(research.processed_at), [research.processed_at]);
  
  const handleSourceClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    e.preventDefault(); // Prevent default behavior
    console.log('clicked source', research.source, research.profileId);
    if (research.profileId) {
      router.push(`/dashboard/${research.profileId}`);
    } else {
      console.warn('No profileId available for navigation');
    }
  };
  
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
        {/* Country Flag Background - Lower z-index */}
        <div 
          className="absolute -right-20 inset-0" 
          style={{ zIndex: 1 }} 
        >
          <Image
            src={'/countries/country_usa.svg'} 
            alt={`Flag of ${research.country || 'Unknown'}`}
            fill
            className={cn(
              "object-contain pointer-events-none",
              isDark ? "opacity-45" : "opacity-50"
            )}
            style={{
              filter: isDark ? 'brightness(0.7)' : 'brightness(1.1)'
            }}
          />
        </div>

        {/* Gradient Overlay for better text readability - Mid z-index */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none", // Don't block clicks
            isDark 
              ? "bg-gradient-to-r from-black/40 via-transparent to-black/40"
              : "bg-gradient-to-r from-white/60 via-transparent to-white/60"
          )}
          style={{ zIndex: 2 }}
        />
        
        {/* Content - Highest z-index for clickability */}
        <div 
          className="relative w-full flex items-center justify-between"
          style={{ zIndex: 10 }} 
        >
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <motion.button
              onClick={handleSourceClick}
              onMouseEnter={() => setIsSourceHovered(true)}
              onMouseLeave={() => setIsSourceHovered(false)}
              className={cn(
                "text-sm font-semibold truncate transition-all duration-200 z-30",
                "drop-shadow-sm relative group flex items-center gap-1",
                "px-2 py-1 rounded-md", 
                research.profileId ? "cursor-pointer" : "cursor-default"
              )}
              style={{ 
                color: colors.foreground,
                textShadow: isDark 
                  ? '0 1px 2px rgba(0,0,0,0.8)' 
                  : '0 1px 2px rgba(255,255,255,0.8)',
                zIndex: 20 
              }}
              animate={{
                textShadow: isSourceHovered && research.profileId && !isMobile
                  ? [
                      isDark ? '0 1px 2px rgba(0,0,0,0.8)' : '0 1px 2px rgba(255,255,255,0.8)',
                      `0 0 12px ${colors.primary}80, 0 0 24px ${colors.primary}40`
                    ].join(', ')
                  : isDark 
                    ? '0 1px 2px rgba(0,0,0,0.8)' 
                    : '0 1px 2px rgba(255,255,255,0.8)',
                scale: isSourceHovered && research.profileId ? 1.05 : 1
              }}
              transition={{ duration: 0.2 }}
              disabled={!research.profileId}
            >
              <span className="truncate">{research.source}</span>
              
              {/* ✅ **ENHANCED: External link icon with better animation** */}
              {research.profileId && !isMobile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -5 }}
                  animate={{ 
                    opacity: isSourceHovered ? 1 : 0,
                    scale: isSourceHovered ? 1 : 0.8,
                    x: isSourceHovered ? 0 : -5
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <ExternalLink className="w-3 h-3" />
                </motion.div>
              )}

              {/* ✅ **ENHANCED: Click hint background with better styling** */}
              {research.profileId && !isMobile && (
                <motion.div
                  className="absolute inset-0 rounded-md pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, 
                      ${colors.primary}15 0%, 
                      ${colors.primary}08 50%, 
                      ${colors.primary}15 100%
                    )`,
                    border: `1px solid ${colors.primary}30`
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: isSourceHovered ? 1 : 0,
                    scale: isSourceHovered ? 1 : 0.9
                  }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          </div>

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