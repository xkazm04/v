'use client';

import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';

interface SubtoneGlowProps {
  intensity?: 'subtle' | 'medium' | 'strong';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'corners';
  animated?: boolean;
  className?: string;
}

export function SubtoneGlow({ 
  intensity = 'subtle', 
  position = 'center',
  animated = false,
  className 
}: SubtoneGlowProps) {
  const { subtone, isDark } = useLayoutTheme();
  
  if (!subtone.isActive) return null;

  const intensityMap = {
    subtle: isDark ? 0.03 : 0.02,
    medium: isDark ? 0.06 : 0.04,
    strong: isDark ? 0.1 : 0.07
  };

  const getGradientByPosition = () => {
    const opacity = intensityMap[intensity];
    const color = subtone.color;
    
    switch (position) {
      case 'top':
        return `radial-gradient(ellipse 80% 50% at 50% 0%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`;
      case 'bottom':
        return `radial-gradient(ellipse 80% 50% at 50% 100%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`;
      case 'left':
        return `radial-gradient(ellipse 50% 80% at 0% 50%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`;
      case 'right':
        return `radial-gradient(ellipse 50% 80% at 100% 50%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`;
      case 'center':
        return `radial-gradient(ellipse 60% 60% at 50% 50%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`;
      case 'corners':
        return `
          radial-gradient(ellipse 30% 30% at 0% 0%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}, transparent 50%),
          radial-gradient(ellipse 30% 30% at 100% 0%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}, transparent 50%),
          radial-gradient(ellipse 30% 30% at 0% 100%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}, transparent 50%),
          radial-gradient(ellipse 30% 30% at 100% 100%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}, transparent 50%)
        `;
      default:
        return '';
    }
  };

  return (
    <motion.div
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        background: getGradientByPosition()
      }}
      {...(animated && {
        animate: {
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.02, 1]
        },
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      })}
    />
  );
}