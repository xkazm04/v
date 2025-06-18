'use client';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';

interface TimelineMilestoneImpactProps {
  consequence: string;
  isActive: boolean;
  isMobile: boolean;
  colors: any;
}

export default function TimelineMilestoneImpact({
  consequence,
  isActive,
  isMobile,
  colors
}: TimelineMilestoneImpactProps) {

  return (
    <motion.div
      className={`max-w-4xl mx-auto ${isMobile ? 'px-4' : 'px-0'}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
    >
      <GlassContainer
        style={isActive ? "crystal" : "frosted"}
        border={isActive ? "glow" : "visible"}
        shadow="lg"
        rounded="xl"
        className={isMobile ? 'p-4' : 'p-6'}
        overlay={isActive}
        overlayOpacity={0.08}
      >
        <div className="flex items-start gap-4">
          {/* Impact Icon */}
          <motion.div
            className={`p-3 rounded-xl flex-shrink-0 ${
              isMobile ? 'p-2' : 'p-3'
            }`}
            style={{ backgroundColor: colors.primary + '15' }}
            whileHover={{ scale: 1.05, rotate: 3 }}
            animate={{
              boxShadow: isActive 
                ? [
                    `0 0 20px ${colors.primary}40`,
                    `0 0 30px ${colors.primary}60`,
                    `0 0 20px ${colors.primary}40`
                  ]
                : `0 0 10px ${colors.primary}20`
            }}
            transition={{
              boxShadow: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <Target 
              className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} 
              style={{ color: colors.primary }} 
            />
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            {/* Header */}
            <motion.div 
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 
                className={`font-bold ${isMobile ? 'text-base' : 'text-lg'}`}
                style={{ color: colors.primary }}
              >
                Historical Impact
              </h3>
              
              <motion.div
                className="flex items-center gap-1"
                animate={{
                  x: [0, 3, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <TrendingUp 
                  className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} opacity-60`}
                  style={{ color: colors.primary }}
                />
              </motion.div>
            </motion.div>

            {/* Consequence Text */}
            <motion.p 
              className={`leading-relaxed font-light ${
                isMobile ? 'text-sm' : 'text-base'
              }`}
              style={{ color: colors.foreground }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {consequence}
            </motion.p>

            {/* Impact Indicators */}
            <motion.div 
              className="flex items-center gap-4 mt-4 pt-4 border-t"
              style={{ borderColor: colors.border + '20' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span 
                  className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}
                  style={{ color: colors.primary }}
                >
                  Long-term Effects
                </span>
              </div>

              <div className="flex items-center gap-2">
                <AlertTriangle 
                  className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} opacity-60`}
                  style={{ color: colors.primary }}
                />
                <span 
                  className={`opacity-70 ${isMobile ? 'text-xs' : 'text-sm'}`}
                  style={{ color: colors.foreground }}
                >
                  Critical Consequence
                </span>
              </div>

              <motion.div
                className="ml-auto w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.primary }}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Background effect for active state */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}08, transparent, ${colors.primary}08)`
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </GlassContainer>
    </motion.div>
  );
}