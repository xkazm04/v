'use client';

import React from 'react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import VerifyWords from '../icons/patterns/VerifyWords';

interface VerifyWordsPatternProps {
  className?: string;
  opacity?: number;
  density?: 'low' | 'medium' | 'high';
}

export function VerifyWordsPattern({ 
  className = '',
  opacity = 0.03,
  density = 'medium'
}: VerifyWordsPatternProps) {
  const { isDark } = useLayoutTheme();

  // Define different positions and rotations for the pattern
  const patternConfigs = React.useMemo(() => {
    const baseConfigs = [
      // Top-left area
      { 
        x: '10%', 
        y: '15%', 
        rotation: -12, 
        scale: 0.8,
        width: 140,
        height: 85
      },
      // Top-right area
      { 
        x: '75%', 
        y: '8%', 
        rotation: 8, 
        scale: 0.9,
        width: 150,
        height: 90
      },
      // Middle-left area
      { 
        x: '5%', 
        y: '45%', 
        rotation: 15, 
        scale: 0.7,
        width: 130,
        height: 78
      },
      // Middle-right area
      { 
        x: '80%', 
        y: '55%', 
        rotation: -18, 
        scale: 0.85,
        width: 145,
        height: 87
      },
      // Bottom-left area
      { 
        x: '15%', 
        y: '80%', 
        rotation: 6, 
        scale: 0.75,
        width: 135,
        height: 81
      },
      // Bottom-right area
      { 
        x: '70%', 
        y: '85%', 
        rotation: -10, 
        scale: 0.8,
        width: 140,
        height: 84
      }
    ];

    // Adjust based on density
    switch (density) {
      case 'low':
        return baseConfigs.slice(0, 4);
      case 'high':
        return [
          ...baseConfigs,
          // Additional elements for high density
          { 
            x: '45%', 
            y: '25%', 
            rotation: 20, 
            scale: 0.6,
            width: 120,
            height: 72
          },
          { 
            x: '35%', 
            y: '70%', 
            rotation: -25, 
            scale: 0.65,
            width: 125,
            height: 75
          }
        ];
      default:
        return baseConfigs;
    }
  }, [density]);

  // Color configuration based on theme
  const colorConfig = React.useMemo(() => {
    if (isDark) {
      return {
        color: '#ffffff',
        filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.1)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.05))',
        mixBlendMode: 'soft-light' as const
      };
    } else {
      return {
        color: '#000000',
        filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.08))',
        mixBlendMode: 'multiply' as const
      };
    }
  }, [isDark]);

  return (
    <div 
      className={`fixed inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      style={{
        zIndex: -1,
        opacity: opacity
      }}
      aria-hidden="true"
    >
      {patternConfigs.map((config, index) => (
        <div
          key={`verify-pattern-${index}`}
          className="absolute transition-all duration-1000 ease-out"
          style={{
            left: config.x,
            top: config.y,
            transform: `translate(-50%, -50%) rotate(${config.rotation}deg) scale(${config.scale})`,
            filter: colorConfig.filter,
            mixBlendMode: colorConfig.mixBlendMode,
            animation: `float-${index % 3} ${20 + index * 2}s ease-in-out infinite`,
          }}
        >
          <VerifyWords 
            width={config.width}
            height={config.height}
            color={colorConfig.color}
          />
        </div>
      ))}

      {/* CSS animations for subtle floating effect */}
      <style jsx>{`
        @keyframes float-0 {
          0%, 100% { transform: translate(-50%, -50%) rotate(${patternConfigs[0]?.rotation || 0}deg) scale(${patternConfigs[0]?.scale || 1}) translateY(0px); }
          50% { transform: translate(-50%, -50%) rotate(${patternConfigs[0]?.rotation || 0}deg) scale(${patternConfigs[0]?.scale || 1}) translateY(-10px); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(-50%, -50%) rotate(${patternConfigs[1]?.rotation || 0}deg) scale(${patternConfigs[1]?.scale || 1}) translateY(0px); }
          50% { transform: translate(-50%, -50%) rotate(${patternConfigs[1]?.rotation || 0}deg) scale(${patternConfigs[1]?.scale || 1}) translateY(8px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(-50%, -50%) rotate(${patternConfigs[2]?.rotation || 0}deg) scale(${patternConfigs[2]?.scale || 1}) translateY(0px); }
          50% { transform: translate(-50%, -50%) rotate(${patternConfigs[2]?.rotation || 0}deg) scale(${patternConfigs[2]?.scale || 1}) translateY(-6px); }
        }
      `}</style>
    </div>
  );
}