import { motion } from 'framer-motion';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';
import { useViewport } from '@/app/hooks/useViewport';
import { HyperText } from '../../ui/Typography/hyper-text';

interface TimelineMilestoneDateBadgeProps {
  date: string;
  title: string;
  isActive: boolean;
  colors: any;
}

export default function TimelineMilestoneDateBadge({
  date,
  title,
  isActive,
  colors,
}: TimelineMilestoneDateBadgeProps) {
  const { isMobile, isTablet } = useViewport();
  // Function to format the date into dd.mm.yyyy format
  const formatDate = (dateString: string): string => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  }
  const dateFormatted = formatDate(date);
  return (
    <motion.div
      className={`absolute min-w-[300px] ${
        isMobile ? '-top-20' : isTablet ? '-top-24' : '-top-28'
      } left-1/2 -translate-x-1/2`}
    >
      <GlassContainer
        style={isActive ? "crystal" : "frosted"}
        border={isActive ? "glow" : "visible"}
        shadow="xl"
        rounded="2xl"
        className={`relative ${
          isMobile ? 'px-4 py-3' : isTablet ? 'px-6 py-4' : 'px-8 py-5'
        }`}
        overlay={true}
        overlayOpacity={0.1}
      >
        <div className="relative z-10 flex items-center gap-3">

          {/* Date Content */}
          <div className="flex flex-col">
            <motion.span 
              className={`font-semibold tracking-tight leading-none ${
                isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl'
              }`}
              style={{ 
                color: isActive ? colors.primary : colors.foreground,
                textShadow: isActive ? `0 0 10px ${colors.primary}30` : 'none'
              }}
              animate={{
                color: isActive ? colors.primary : colors.foreground
              }}
              transition={{ duration: 0.3 }}
            >
              <HyperText startOnView duration={5000}>{dateFormatted}</HyperText>
            </motion.span>
            
            <motion.span 
              className={`font-medium opacity-60 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}
              style={{ color: colors.foreground }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.6, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {title}
            </motion.span>
          </div>

          {/* Timeline indicator */}
          <motion.div
            className={`ml-2 w-1 rounded-full ${
              isMobile ? 'h-8' : isTablet ? 'h-10' : 'h-12'
            }`}
            style={{ backgroundColor: colors.primary }}
            animate={{
              boxShadow: isActive 
                ? `0 0 20px ${colors.primary}60`
                : `0 0 8px ${colors.primary}30`
            }}
          />
        </div>
      </GlassContainer>
    </motion.div>
  );
}