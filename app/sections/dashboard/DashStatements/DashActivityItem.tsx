'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { StatementSummary, StatementStatus } from '@/app/types/profile';
import { FloatingVerdictIcon } from '@/app/components/ui/Decorative/FloatingVerdictIcon';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { CheckCircle, AlertCircle, Hash } from 'lucide-react';

interface DashActivityItemProps {
  statement: StatementSummary;
  index: number;
  itemVariants: any;
}

// Enhanced status configuration with colors and icons
const getStatusConfig = (status: StatementStatus, isDark: boolean) => {
  const configs = {
    TRUE: {
      colors: {
        glowColor: isDark ? '#10b981' : '#059669',
        ringColor: isDark ? '#34d399' : '#10b981',
        backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
        textColor: isDark ? '#34d399' : '#059669',
        badgeBackground: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(240, 253, 244, 0.9)',
        badgeBorder: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
      },
      icon: CheckCircle,
      label: 'TRUE',
      confidence: 95
    },
    FALSE: {
      colors: {
        glowColor: isDark ? '#ef4444' : '#dc2626',
        ringColor: isDark ? '#f87171' : '#ef4444',
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
        textColor: isDark ? '#f87171' : '#dc2626',
        badgeBackground: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(254, 242, 242, 0.9)',
        badgeBorder: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
      },
      icon: AlertCircle,
      label: 'FALSE',
      confidence: 90
    },
    MISLEADING: {
      colors: {
        glowColor: isDark ? '#f59e0b' : '#d97706',
        ringColor: isDark ? '#fbbf24' : '#f59e0b',
        backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
        textColor: isDark ? '#fbbf24' : '#d97706',
        badgeBackground: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 251, 235, 0.9)',
        badgeBorder: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.2)',
      },
      icon: AlertCircle,
      label: 'MISLEADING',
      confidence: 85
    },
    PARTIALLY_TRUE: {
      colors: {
        glowColor: isDark ? '#3b82f6' : '#2563eb',
        ringColor: isDark ? '#60a5fa' : '#3b82f6',
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
        textColor: isDark ? '#60a5fa' : '#2563eb',
        badgeBackground: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 246, 255, 0.9)',
        badgeBorder: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
      },
      icon: CheckCircle,
      label: 'PARTIAL',
      confidence: 75
    },
    UNVERIFIABLE: {
      colors: {
        glowColor: isDark ? '#8b5cf6' : '#7c3aed',
        ringColor: isDark ? '#a78bfa' : '#8b5cf6',
        backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
        textColor: isDark ? '#a78bfa' : '#7c3aed',
        badgeBackground: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(245, 243, 255, 0.9)',
        badgeBorder: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
      },
      icon: Hash,
      label: 'UNVERIFIABLE',
      confidence: 50
    }
  };

  return configs[status] || configs.UNVERIFIABLE;
};

const DashActivityItem = ({ statement, index, itemVariants }: DashActivityItemProps) => {
  const { isDark } = useLayoutTheme();
  const statusConfig = getStatusConfig(statement.status, isDark);

  // Enhanced theme colors with better contrast and accessibility
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
  };

  return (
    <motion.div
      variants={itemVariants}
      className="border rounded-xl p-4 transition-all duration-300 cursor-pointer group relative overflow-hidden"
      style={{
        background: themeColors.itemBackground,
        borderColor: themeColors.itemBorder
      }}
      whileHover={{
        background: themeColors.itemHover,
        scale: 1.02,
        y: -2
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
      <div className="flex items-start gap-3 mb-3">
        <FloatingVerdictIcon
          size="sm"
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
      
      {/* Statement Content */}
      <div className="ml-11 space-y-3">
        <p 
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: themeColors.primaryText }}
        >
          "{statement.verdict}"
        </p>
        
        {/* Correction Preview */}
        {statement.correction && (
          <div 
            className="text-xs p-3 rounded-lg border-l-4 line-clamp-2"
            style={{
              background: isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)',
              borderLeftColor: statusConfig.colors.glowColor,
              color: themeColors.secondaryText
            }}
          >
            <span className="font-semibold" style={{ color: themeColors.primaryText }}>
              Fact Check: 
            </span>
            {statement.correction}
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