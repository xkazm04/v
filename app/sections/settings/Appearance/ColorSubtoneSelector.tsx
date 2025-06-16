import { motion } from 'framer-motion';
import { Palette, Sparkles, Eye, Brush } from 'lucide-react';
import { useAppearanceStore, SUBTONE_CONFIGS, ColorSubtone } from '@/app/stores/appearance';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { useState } from 'react';
import { SetAppearanceSubtone } from './SetAppearanceSubtone';

interface ColorSubtoneSelectorProps {
  className?: string;
}

export function ColorSubtoneSelector({ className }: ColorSubtoneSelectorProps) {
  const { colorSubtone, setColorSubtone } = useAppearanceStore();
  const { colors, isDark } = useLayoutTheme();
  const [hoveredSubtone, setHoveredSubtone] = useState<ColorSubtone | null>(null);

  const subtoneOrder: ColorSubtone[] = ['neutral', 'blue', 'red', 'green', 'yellow', 'purple'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <motion.div 
      className={cn('space-y-8', className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced Header */}
      <motion.div variants={itemVariants}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3" style={{ color: colors.foreground }}>
            <motion.div
              className="p-2 rounded-xl"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}10)`,
                border: `1px solid ${colors.primary}30`
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Palette className="w-7 h-7" style={{ color: colors.primary }} />
            </motion.div>
            Color Subtones
          </h2>
          <p className="text-lg text-muted-foreground">
            Add subtle color gradients to enhance your reading experience
          </p>
        </div>
      </motion.div>
      
      {/* Enhanced Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto"
      >
        {subtoneOrder.map((subtone, index) => {
          const config = SUBTONE_CONFIGS[subtone];
          const isSelected = colorSubtone === subtone;
          const isHovered = hoveredSubtone === subtone;
          
          return (
            <SetAppearanceSubtone
              key={subtone}
              subtone={subtone}
              config={config}
              isSelected={isSelected}
              isHovered={isHovered}
              index={index}
              onSelect={setColorSubtone}
              onHover={setHoveredSubtone}
            />
          );
        })}
      </motion.div>
      
      {/* Enhanced Live Preview */}
      <motion.div 
        variants={itemVariants}
        className="space-y-6"
      >
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2" style={{ color: colors.foreground }}>
            <Brush className="w-5 h-5" style={{ color: colors.primary }} />
            Live Preview
          </h3>
          <p className="text-sm text-muted-foreground">
            See how your selected subtone affects the interface
          </p>
        </div>
        
        <motion.div 
          className="relative p-8 rounded-2xl border-2 overflow-hidden"
          style={{ 
            borderColor: `${colors.border}60`,
            background: 'hsl(var(--background))'
          }}
          animate={{
            borderColor: hoveredSubtone 
              ? `${SUBTONE_CONFIGS[hoveredSubtone].preview}60`
              : `${colors.border}60`
          }}
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: hoveredSubtone 
                ? SUBTONE_CONFIGS[hoveredSubtone].gradient.light
                : SUBTONE_CONFIGS[colorSubtone].gradient.light
            }}
            style={{ opacity: 0.8 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full opacity-30"
                style={{ 
                  background: hoveredSubtone 
                    ? SUBTONE_CONFIGS[hoveredSubtone].preview
                    : SUBTONE_CONFIGS[colorSubtone].preview,
                  left: `${10 + i * 10}%`,
                  top: `${20 + (i % 3) * 30}%`
                }}
                animate={{
                  y: [0, -12, 0],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-3">
            <motion.div 
              className="text-xl font-bold text-foreground"
              animate={{
                color: hoveredSubtone 
                  ? SUBTONE_CONFIGS[hoveredSubtone].preview
                  : SUBTONE_CONFIGS[colorSubtone].preview
              }}
            >
              {hoveredSubtone 
                ? SUBTONE_CONFIGS[hoveredSubtone].label
                : SUBTONE_CONFIGS[colorSubtone].label
              } Subtone Active
            </motion.div>
            <motion.div 
              className="text-sm text-muted-foreground max-w-md mx-auto"
              animate={{
                opacity: hoveredSubtone ? 0.8 : 1
              }}
            >
              {hoveredSubtone 
                ? SUBTONE_CONFIGS[hoveredSubtone].description
                : SUBTONE_CONFIGS[colorSubtone].description
              }
            </motion.div>
            
            {/* Feature indicators */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
                <span className="text-xs text-muted-foreground">Enhanced</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" style={{ color: colors.primary }} />
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>
          </div>

          {/* Gradient overlay */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 30% 30%, 
                ${hoveredSubtone 
                  ? SUBTONE_CONFIGS[hoveredSubtone].preview
                  : SUBTONE_CONFIGS[colorSubtone].preview
                }40 0%, 
                transparent 70%
              )`
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}