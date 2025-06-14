'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface FloatingVerdictIconProps {
  /** Size variant for different use cases */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Confidence score for the ring animation (0-100) */
  confidence?: number;
  /** Custom colors override */
  colors?: {
    glowColor?: string;
    ringColor?: string;
    backgroundColor?: string;
  };
  /** Whether to show the confidence ring */
  showConfidenceRing?: boolean;
  /** Custom logo/icon to display instead of default */
  customIcon?: string;
  /** Animation delay in seconds */
  delay?: number;
  /** Whether to auto-animate on view */
  autoAnimate?: boolean;
  /** Custom className for container */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Hover handler */
  onHover?: (isHovered: boolean) => void;
}

const sizeConfig = {
  sm: {
    container: 'w-12 h-12',
    icon: { width: 24, height: 24 },
    glow: 'blur-lg',
    ring: { r: 20, strokeWidth: 2 }
  },
  md: {
    container: 'w-16 h-16',
    icon: { width: 32, height: 32 },
    glow: 'blur-xl',
    ring: { r: 28, strokeWidth: 2.5 }
  },
  lg: {
    container: 'w-20 h-20',
    icon: { width: 48, height: 48 },
    glow: 'blur-xl',
    ring: { r: 35, strokeWidth: 3 }
  },
  xl: {
    container: 'w-24 h-24',
    icon: { width: 56, height: 56 },
    glow: 'blur-2xl',
    ring: { r: 42, strokeWidth: 3.5 }
  }
};

export const FloatingVerdictIcon: React.FC<FloatingVerdictIconProps> = ({
  size = 'lg',
  confidence = 85,
  colors,
  showConfidenceRing = true,
  customIcon = '/logos/logo_spray_white.png',
  delay = 0.2,
  autoAnimate = true,
  className = '',
  onClick,
  onHover
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { colors: themeColors, isDark } = useLayoutTheme();
  
  const config = sizeConfig[size];
  
  // Default colors based on theme
  const defaultColors = {
    glowColor: colors?.glowColor || themeColors.primary,
    ringColor: colors?.ringColor || 'rgba(255,255,255,0.8)',
    backgroundColor: colors?.backgroundColor || 'rgba(255,255,255,0.1)'
  };

  const shouldAnimate = autoAnimate ? isInView : true;

  return (
    <>
      {/* Global floating animation CSS */}
      <style jsx global>{`
        @keyframes floating-icon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        .floating-icon {
          animation: floating-icon 6s ease-in-out infinite;
        }
      `}</style>

      <motion.div 
        ref={ref}
        className={`relative flex items-center justify-center ${className}`}
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={shouldAnimate ? { 
          scale: 1, 
          rotate: 0, 
          opacity: 1 
        } : { 
          scale: 0, 
          rotate: -180, 
          opacity: 0 
        }}
        transition={{ 
          delay, 
          duration: 0.8, 
          type: "spring", 
          stiffness: 100,
          damping: 10
        }}
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          transition: { duration: 0.2 }
        }}
        onClick={onClick}
        onHoverStart={() => onHover?.(true)}
        onHoverEnd={() => onHover?.(false)}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        {/* Icon Glow Background */}
        <motion.div 
          className={`absolute inset-0 rounded-full ${config.glow}`}
          style={{ backgroundColor: defaultColors.glowColor }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Main Icon Container */}
        <div 
          className={`relative ${config.container} backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center shadow-2xl floating-icon`}
          style={{ backgroundColor: defaultColors.backgroundColor }}
        >
          <Image
            src={customIcon}
            alt="Verdict Icon"
            width={config.icon.width}
            height={config.icon.height}
            className="drop-shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          
          {/* Confidence Ring */}
          {showConfidenceRing && (
            <svg 
              className="absolute inset-0 w-full h-full -rotate-90" 
              viewBox="0 0 100 100"
            >
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r={config.ring.r}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={config.ring.strokeWidth}
              />
              {/* Progress Ring */}
              <motion.circle
                cx="50"
                cy="50"
                r={config.ring.r}
                fill="none"
                stroke={defaultColors.ringColor}
                strokeWidth={config.ring.strokeWidth + 0.5}
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * config.ring.r}`}
                initial={{ strokeDashoffset: 2 * Math.PI * config.ring.r }}
                animate={shouldAnimate ? { 
                  strokeDashoffset: 2 * Math.PI * config.ring.r * (1 - confidence / 100)
                } : { 
                  strokeDashoffset: 2 * Math.PI * config.ring.r 
                }}
                transition={{ 
                  delay: delay + 0.8, 
                  duration: 1.5, 
                  ease: "easeOut" 
                }}
              />
            </svg>
          )}
        </div>
      </motion.div>
    </>
  );
};