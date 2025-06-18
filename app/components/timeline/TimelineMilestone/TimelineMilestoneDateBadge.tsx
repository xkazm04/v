'use client';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';

interface TimelineMilestoneDateBadgeProps {
  date: string;
  isActive: boolean;
  isMobile: boolean;
  isTablet?: boolean;
  colors: any;
  isDark: boolean;
}

export default function TimelineMilestoneDateBadge({
  date,
  isActive,
  isMobile,
  isTablet,
  colors,
  isDark
}: TimelineMilestoneDateBadgeProps) {
  
  return (
    <motion.div
      className={`absolute ${
        isMobile ? '-top-20' : isTablet ? '-top-24' : '-top-28'
      } left-1/2 -translate-x-1/2`}
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.2
      }}
      whileHover={{ scale: 1.05, y: -2 }}
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
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: isActive 
              ? `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}05)`
              : 'transparent'
          }}
          animate={{
            opacity: isActive ? [0.3, 0.6, 0.3] : 0
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          {/* Calendar Icon */}
          <motion.div
            className={`p-2 rounded-xl ${
              isMobile ? 'p-1.5' : 'p-2'
            }`}
            style={{ 
              backgroundColor: isActive ? colors.primary + '20' : colors.primary + '10'
            }}
            animate={{
              rotate: isActive ? [0, 5, -5, 0] : 0,
              scale: isActive ? [1, 1.1, 1] : 1
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Calendar 
              className={`${
                isMobile ? 'w-4 h-4' : isTablet ? 'w-5 h-5' : 'w-6 h-6'
              }`}
              style={{ color: colors.primary }}
            />
          </motion.div>

          {/* Date Content */}
          <div className="flex flex-col">
            <motion.span 
              className={`font-black tracking-tight leading-none ${
                isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl'
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
              {date}
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
              Milestone Period
            </motion.span>
          </div>

          {/* Timeline indicator */}
          <motion.div
            className={`ml-2 w-1 rounded-full ${
              isMobile ? 'h-8' : isTablet ? 'h-10' : 'h-12'
            }`}
            style={{ backgroundColor: colors.primary }}
            animate={{
              height: isActive 
                ? isMobile ? [32, 40, 32] : isTablet ? [40, 50, 40] : [48, 60, 48]
                : isMobile ? 32 : isTablet ? 40 : 48,
              boxShadow: isActive 
                ? `0 0 20px ${colors.primary}60`
                : `0 0 8px ${colors.primary}30`
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Floating time indicators */}
        {isActive && (
          <>
            <motion.div
              className="absolute -right-2 -top-2 w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.primary }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="absolute -left-2 -bottom-2 w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
              animate={{
                scale: [0, 1.2, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 1
              }}
            />
          </>
        )}
      </GlassContainer>
    </motion.div>
  );
}