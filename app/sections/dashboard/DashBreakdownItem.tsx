'use client';

import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface BreakdownItemData {
  topic: string;
  count: number;
  truthRate: number;
  color: string;
}

interface DashBreakdownItemProps {
  item: BreakdownItemData;
  index: number;
  maxCount: number;
}

const DashBreakdownItem = ({ item, index, maxCount }: DashBreakdownItemProps) => {
  const { isDark } = useLayoutTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      {/* Topic row */}
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-3 h-3 rounded-full shadow-sm flex-shrink-0"
          style={{ backgroundColor: item.color }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground truncate">
              {item.topic}
            </span>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs text-muted-foreground">
                {item.count} statements
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced progress bar with background pattern and overlay */}
      <div className="relative ml-6">
        <div className="relative h-8 rounded-lg overflow-hidden"
          style={{ 
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          }}
        >
          {/* Background diagonal pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 4px,
                ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 4px,
                ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 8px
              )`
            }}
          />
          
          {/* Progress fill */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${item.truthRate}%` }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
            className="relative h-full"
            style={{ 
              background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
            }}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3,
                ease: "easeInOut" 
              }}
            />
          </motion.div>
          
          {/* Overlay value in the center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white drop-shadow-lg">
              {item.truthRate}%
            </span>
          </div>
        </div>
        
        {/* Count indicator bar */}
        <div className="mt-2 h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(item.count / maxCount) * 100}%` }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
            className="h-full rounded-full"
            style={{ backgroundColor: `${item.color}80` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DashBreakdownItem;