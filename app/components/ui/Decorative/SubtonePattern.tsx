'use client';

import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';

interface SubtonePatternProps {
  pattern?: 'dots' | 'lines' | 'mesh' | 'organic';
  intensity?: 'subtle' | 'medium' | 'strong';
  animated?: boolean;
  className?: string;
}

export function SubtonePattern({ 
  pattern = 'dots', 
  intensity = 'subtle', 
  animated = false,
  className 
}: SubtonePatternProps) {
  const { subtone, isDark } = useLayoutTheme();
  
  if (!subtone.isActive) return null;

  const opacityMap = {
    subtle: isDark ? 0.02 : 0.015,
    medium: isDark ? 0.04 : 0.03,
    strong: isDark ? 0.06 : 0.045
  };

  const getPatternStyle = () => {
    const opacity = opacityMap[intensity];
    const color = subtone.color;
    
    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(circle at 2px 2px, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        };
      case 'lines':
        return {
          backgroundImage: `linear-gradient(90deg, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        };
      case 'mesh':
        return {
          backgroundImage: `
            linear-gradient(90deg, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px),
            linear-gradient(0deg, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        };
      case 'organic':
        return {
          backgroundImage: `radial-gradient(ellipse 40px 20px at 50% 50%, ${color}${Math.floor(opacity * 128).toString(16).padStart(2, '0')}, transparent)`,
          backgroundSize: '80px 40px'
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={getPatternStyle()}
      {...(animated && {
        animate: {
          backgroundPositionX: ['0px', '20px'],
          backgroundPositionY: ['0px', '20px']
        },
        transition: {
          duration: 60,
          repeat: Infinity,
          ease: 'linear'
        }
      })}
    />
  );
}