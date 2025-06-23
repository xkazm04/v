'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, AlertCircle } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface DataSourceBadgeProps {
  isRealData: boolean;
  className?: string;
}

const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({ 
  isRealData, 
  className = '' 
}) => {
  const { isDark } = useLayoutTheme();

  return (
    <motion.div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{
        background: isRealData 
          ? (isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)')
          : (isDark ? 'rgba(249, 115, 22, 0.15)' : 'rgba(249, 115, 22, 0.1)'),
        color: isRealData 
          ? (isDark ? '#22c55e' : '#15803d')
          : (isDark ? '#f97316' : '#c2410c'),
        border: isRealData 
          ? '1px solid rgba(34, 197, 94, 0.3)'
          : '1px solid rgba(249, 115, 22, 0.3)'
      }}
      whileHover={{ scale: 1.05 }}
    >
      {isRealData ? (
        <Database className="w-3 h-3" />
      ) : (
        <AlertCircle className="w-3 h-3" />
      )}
      <span>{isRealData ? 'Live Data' : 'Mock Data'}</span>
    </motion.div>
  );
};

export default DataSourceBadge;