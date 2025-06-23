'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import DataSourceBadge from './DataSourceBadge';

interface BreakdownHeaderProps {
  isCategories: boolean;
  totalStatements: number;
  itemCount: number;
  avgTruthRate: number;
  isRealData: boolean;
  variants?: any;
}

const BreakdownHeader: React.FC<BreakdownHeaderProps> = ({
  isCategories,
  totalStatements,
  itemCount,
  avgTruthRate,
  isRealData,
  variants
}) => {
  const { colors, isDark, vintage, universalCard } = useLayoutTheme();

  return (
    <motion.div 
      variants={variants}
      className="flex items-center justify-between mb-6"
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="p-3 rounded-xl"
          style={{ 
            background: isDark 
              ? `linear-gradient(135deg, ${universalCard.accent}25, ${universalCard.accent}10)`
              : `linear-gradient(135deg, ${universalCard.accent}25, ${universalCard.accent}15)`,
            border: isDark 
              ? `1px solid ${universalCard.accent}40`
              : `1px solid ${universalCard.accent}`,
            boxShadow: isDark 
              ? `0 4px 12px ${universalCard.accent}20`
              : `0 4px 12px rgba(139, 69, 19, 0.15)`
          }}
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <BarChart3 className="h-6 w-6" style={{ 
            color: universalCard.accent
          }} />
        </motion.div>
        
        <div>
          <h3 
            className="text-xl font-bold leading-tight"
            style={{ 
              color: isDark ? colors.foreground : vintage.ink,
              fontFamily: '"Playfair Display", serif'
            }}
          >
            {isCategories ? 'Category Distribution' : 'Topic Distribution'}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <p 
              className="text-sm"
              style={{ 
                color: isDark ? colors.mutedForeground : vintage.faded,
                fontFamily: '"Crimson Text", serif'
              }}
            >
              {totalStatements} statements 
            </p>
            
            <DataSourceBadge isRealData={isRealData} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BreakdownHeader;