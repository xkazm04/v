'use client';
import { motion } from 'framer-motion';
import { LogoBgBlack } from '@/app/components/icons/logo_black';

interface TimelineBackgroundProps {
  scrollProgress: number;
  isDark: boolean;
  colors: any;
}

export default function TimelineBackground({ 
  scrollProgress, 
  isDark, 
  colors 
}: TimelineBackgroundProps) {
  return (
    <>
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* Static Background Line */}
        <div 
          className="fixed left-1/2 top-0 w-px h-full opacity-20"
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, transparent, rgb(148, 163, 184), transparent)'
              : 'linear-gradient(to bottom, transparent, rgb(100, 116, 139), transparent)',
            left: 'calc(50% - 0.5px)'
          }}
        />

        {/* Enhanced Floating Particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: i % 2 === 0 ? colors.primary : colors.secondary || colors.primary,
              left: `${15 + (i * 7)}%`,
              top: `${5 + (i * 12)}%`,
            }}
            animate={{
              y: [-8, 8, -8],
              x: [-3, 3, -3],
              opacity: [0.1, 0.4, 0.1],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}

        {/* Interactive Gradient Mesh */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: isDark
              ? `radial-gradient(circle at ${20 + scrollProgress * 60}% ${30 + scrollProgress * 40}%, 
                  rgba(59, 130, 246, 0.1) 0%, 
                  transparent 50%),
                 radial-gradient(circle at ${80 - scrollProgress * 60}% ${70 - scrollProgress * 40}%, 
                  rgba(147, 51, 234, 0.1) 0%, 
                  transparent 50%)`
              : `radial-gradient(circle at ${20 + scrollProgress * 60}% ${30 + scrollProgress * 40}%, 
                  rgba(59, 130, 246, 0.05) 0%, 
                  transparent 50%),
                 radial-gradient(circle at ${80 - scrollProgress * 60}% ${70 - scrollProgress * 40}%, 
                  rgba(147, 51, 234, 0.05) 0%, 
                  transparent 50%)`
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Depth Gradient Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at center, transparent 0%, rgba(15, 23, 42, 0.2) 80%)'
              : 'radial-gradient(ellipse at center, transparent 0%, rgba(248, 250, 252, 0.2) 80%)'
          }}
        />
      </div>

      {/* Subtle Logo Background */}
      <div className="opacity-[0.015] absolute inset-0 pointer-events-none">
        <LogoBgBlack />
      </div>
    </>
  );
}