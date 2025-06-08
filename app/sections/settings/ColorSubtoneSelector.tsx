'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useAppearanceStore, SUBTONE_CONFIGS, ColorSubtone } from '@/app/stores/appearance';
import { cn } from '@/app/lib/utils';

interface ColorSubtoneSelectorProps {
  className?: string;
}

export function ColorSubtoneSelector({ className }: ColorSubtoneSelectorProps) {
  const { colorSubtone, setColorSubtone } = useAppearanceStore();

  const subtoneOrder: ColorSubtone[] = ['neutral', 'blue', 'red', 'green', 'yellow', 'purple'];

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">Color Subtone</h4>
        <p className="text-xs text-muted-foreground mb-4">
          Add a subtle color gradient to enhance your reading experience
        </p>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {subtoneOrder.map((subtone) => {
          const config = SUBTONE_CONFIGS[subtone];
          const isSelected = colorSubtone === subtone;
          
          return (
            <motion.button
              key={subtone}
              onClick={() => setColorSubtone(subtone)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200',
                'hover:border-border/60 focus:outline-none focus:ring-2 focus:ring-primary/20',
                isSelected 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border/30 hover:bg-accent/30'
              )}
            >
              {/* Color Preview Circle */}
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-full border-2 border-background shadow-sm"
                  style={{
                    backgroundColor: config.preview,
                    backgroundImage: subtone === 'neutral' 
                      ? 'linear-gradient(45deg, #f8f9fa 25%, #e9ecef 25%, #e9ecef 50%, #f8f9fa 50%, #f8f9fa 75%, #e9ecef 75%, #e9ecef)'
                      : undefined,
                    backgroundSize: subtone === 'neutral' ? '8px 8px' : undefined
                  }}
                />
                
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-6 h-6 bg-background rounded-full flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Label */}
              <div className="text-center">
                <div className="text-xs font-medium text-foreground">
                  {config.label}
                </div>
                <div className="text-[10px] text-muted-foreground line-clamp-1">
                  {config.description}
                </div>
              </div>
              
              {/* Selection ring */}
              {isSelected && (
                <motion.div
                  layoutId="subtone-selection"
                  className="absolute inset-0 rounded-lg border-2 border-primary"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Live Preview */}
      <div className="mt-6 p-4 rounded-lg border border-border/50 bg-card/50">
        <div className="text-xs font-medium text-foreground mb-2">Preview</div>
        <div 
          className="h-16 rounded-md border border-border/30 relative overflow-hidden"
          style={{ backgroundColor: 'hsl(var(--background))' }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: SUBTONE_CONFIGS[colorSubtone].gradient.light,
              opacity: 0.8
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-sm text-foreground/80 font-medium">
              {SUBTONE_CONFIGS[colorSubtone].label} Subtone
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          {SUBTONE_CONFIGS[colorSubtone].description}
        </div>
      </div>
    </div>
  );
}