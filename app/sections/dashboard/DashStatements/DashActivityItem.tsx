'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Tag, Quote } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { StatementSummary } from '@/app/types/profile';
import { FloatingVerdictIcon } from '@/app/components/ui/Decorative/FloatingVerdictIcon';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { getStatusConfig } from '@/app/helpers/statusConfig'; 
interface DashActivityItemProps {
  statement: StatementSummary;
  index: number;
  itemVariants: any;
}

const DashActivityItem = ({ statement, index, itemVariants }: DashActivityItemProps) => {
  const { isDark } = useLayoutTheme();
  const statusConfig = getStatusConfig(statement.status, isDark);

  const themeColors = {
    itemBackground: isDark 
      ? 'linear-gradient(135deg, rgba(71, 85, 105, 0.2), rgba(51, 65, 85, 0.1))'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.6))',
    itemBorder: isDark ? 'rgba(71, 85, 105, 0.25)' : 'rgba(203, 213, 225, 0.3)',
    itemHover: isDark 
      ? 'linear-gradient(135deg, rgba(71, 85, 105, 0.35), rgba(51, 65, 85, 0.2))'
      : 'linear-gradient(135deg, rgba(241, 245, 249, 0.9), rgba(255, 255, 255, 0.95))',
    primaryText: isDark ? 'rgba(248, 250, 252, 0.95)' : 'rgba(15, 23, 42, 0.95)',
    secondaryText: isDark ? 'rgba(148, 163, 184, 0.9)' : 'rgba(100, 116, 139, 0.9)',
    mutedText: isDark ? 'rgba(148, 163, 184, 0.7)' : 'rgba(100, 116, 139, 0.7)',
    quoteBackground: isDark ? 'rgba(71, 85, 105, 0.15)' : 'rgba(241, 245, 249, 0.7)',
    quoteBorder: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.4)',
  };

  return (
    <motion.div
      variants={itemVariants}
      className="border rounded-xl p-4 transition-all duration-300 cursor-pointer group relative overflow-hidden hover:shadow hover:shadow-gray-600/20"
      style={{
        background: themeColors.itemBackground,
        borderColor: themeColors.itemBorder
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(circle at 100% 0%, ${statusConfig.colors.glowColor}, transparent 50%)`
        }}
      />
      
      {/* Header with FloatingVerdictIcon */}
      <div className="flex items-start gap-3 mb-4">
        <FloatingVerdictIcon
          size="xs"
          confidence={statusConfig.confidence}
          colors={statusConfig.colors}
          showConfidenceRing={true}
          delay={index * 0.1}
          autoAnimate={true}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span 
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
              style={{
                background: statusConfig.colors.badgeBackground,
                borderColor: statusConfig.colors.badgeBorder,
                color: statusConfig.colors.textColor,
                border: `1px solid ${statusConfig.colors.badgeBorder}`
              }}
            >
              {statusConfig.label}
            </span>
            
            <div className="flex items-center gap-2">
              {statement.country && (
                <div className="flex items-center gap-1" style={{ color: themeColors.mutedText }}>
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs uppercase font-mono">
                    {statement.country}
                  </span>
                </div>
              )}
              
              {statement.category && (
                <div className="flex items-center gap-1" style={{ color: themeColors.mutedText }}>
                  <Tag className="w-3 h-3" />
                  <span className="text-xs capitalize">
                    {statement.category.toLowerCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {statement.original_statement && (
        <div className="ml-11 mb-4">
          <div 
            className="relative p-3 rounded-lg border-l-4"
            style={{
              background: themeColors.quoteBackground,
              borderLeftColor: statusConfig.colors.glowColor,
              borderColor: themeColors.quoteBorder
            }}
          >
            <Quote 
              className="absolute top-2 right-2 w-4 h-4 opacity-30"
              style={{ color: statusConfig.colors.glowColor }}
            />
            <p 
              className="text-sm leading-relaxed italic font-medium"
              style={{ color: themeColors.primaryText }}
            >
              "{statement.original_statement}"
            </p>
          </div>
        </div>
      )}

      <div className="ml-11 space-y-3">
        <div>
          <h4 
            className="text-xs font-bold uppercase tracking-wide mb-1"
            style={{ 
              color: statusConfig.colors.textColor,
              letterSpacing: '0.1em'
            }}
          >
            Verdict
          </h4>
          <p 
            className="text-sm leading-relaxed"
            style={{ color: themeColors.primaryText }}
          >
            {statement.verdict}
          </p>
        </div>
        
        {/* Correction/Additional Info */}
        {statement.correction && (
          <div 
            className="text-xs p-3 rounded-lg border-l-4 line-clamp-2"
            style={{
              background: isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)',
              borderLeftColor: statusConfig.colors.glowColor,
              color: themeColors.secondaryText
            }}
          >
            <span className="" style={{ color: themeColors.primaryText }}>
              {statement.correction}
            </span>
           
          </div>
        )}
        
        {/* Timestamp */}
        <div className="flex items-center gap-1 pt-2" style={{ color: themeColors.mutedText }}>
          <Clock className="w-3 h-3" />
          <span className="text-xs">
            {statement.created_at 
              ? formatDistanceToNow(new Date(statement.created_at), { addSuffix: true })
              : 'Recent'
            }
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DashActivityItem;