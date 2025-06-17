'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { TrendingUp, Hash, CheckCircle, AlertCircle } from 'lucide-react';
import { ProfileStatsResponse, StatementSummary, StatementStatus } from '@/app/types/profile';
import DashActivityItem from './DashStatements/DashActivityItem';
interface DashActivityProps {
  statsData: ProfileStatsResponse;
  limit?: number;
}

// Enhanced status configuration with colors and icons
const getStatusConfig = (status: StatementStatus, isDark: boolean) => {
  const configs = {
    TRUE: {
      colors: {
        badgeBackground: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(240, 253, 244, 0.9)',
        badgeBorder: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
        textColor: isDark ? '#34d399' : '#059669',
      },
      icon: CheckCircle,
      label: 'TRUE'
    },
    FALSE: {
      colors: {
        badgeBackground: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(254, 242, 242, 0.9)',
        badgeBorder: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
        textColor: isDark ? '#f87171' : '#dc2626',
      },
      icon: AlertCircle,
      label: 'FALSE'
    },
    MISLEADING: {
      colors: {
        badgeBackground: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 251, 235, 0.9)',
        badgeBorder: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.2)',
        textColor: isDark ? '#fbbf24' : '#d97706',
      },
      icon: AlertCircle,
      label: 'MISLEADING'
    },
    PARTIALLY_TRUE: {
      colors: {
        badgeBackground: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 246, 255, 0.9)',
        badgeBorder: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
        textColor: isDark ? '#60a5fa' : '#2563eb',
      },
      icon: CheckCircle,
      label: 'PARTIAL'
    },
    UNVERIFIABLE: {
      colors: {
        badgeBackground: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(245, 243, 255, 0.9)',
        badgeBorder: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
        textColor: isDark ? '#a78bfa' : '#7c3aed',
      },
      icon: Hash,
      label: 'UNVERIFIABLE'
    }
  };

  return configs[status] || configs.UNVERIFIABLE;
};

const DashActivity = ({ statsData, limit = 8 }: DashActivityProps) => {
  const { colors, isDark } = useLayoutTheme();
  
  const { recent_statements: statements, stats } = statsData;
  const displayStatements = statements.slice(0, limit);

  // Enhanced theme colors with better contrast and accessibility
  const themeColors = {
    cardBackground: isDark 
      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.8))'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9))',
    cardBorder: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.4)',
    cardShadow: isDark 
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
      : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    headerBackground: isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(248, 250, 252, 0.8)',
    primaryText: colors.foreground,
    secondaryText: isDark ? 'rgba(148, 163, 184, 0.9)' : 'rgba(100, 116, 139, 0.9)',
    mutedText: isDark ? 'rgba(148, 163, 184, 0.7)' : 'rgba(100, 116, 139, 0.7)',
    accentColor: colors.primary,
    divider: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.4)'
  };

  // Calculate verdict summary for enhanced statistics
  const verdictSummary = statements.reduce((acc, statement) => {
    const status = statement.status || 'UNVERIFIABLE';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<StatementStatus, number>);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border backdrop-blur-sm h-fit sticky top-6 overflow-hidden"
      style={{
        background: themeColors.cardBackground,
        borderColor: themeColors.cardBorder,
        boxShadow: themeColors.cardShadow
      }}
    >
      {/* Enhanced Header */}
      <motion.div 
        className="p-5 border-b relative"
        style={{ 
          borderColor: themeColors.divider,
          background: themeColors.headerBackground
        }}
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-xl"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}10)`,
                border: `1px solid ${colors.primary}30`
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: themeColors.accentColor }} />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: themeColors.primaryText }}>
                Recent Activity
              </h3>
              <p className="text-sm" style={{ color: themeColors.secondaryText }}>
                Latest fact-checked statements
              </p>
            </div>
          </div>
          
          <motion.div 
            className="text-right"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold" style={{ color: themeColors.accentColor }}>
              {statements.length}
            </div>
            <div className="text-xs" style={{ color: themeColors.mutedText }}>
              statements
            </div>
          </motion.div>
        </div>
        
        {/* Enhanced Verdict Summary */}
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {Object.entries(verdictSummary).map(([status, count], index) => {
              const statusConfig = getStatusConfig(status as StatementStatus, isDark);
              return (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm"
                  style={{
                    background: statusConfig.colors.badgeBackground,
                    borderColor: statusConfig.colors.badgeBorder,
                    color: statusConfig.colors.textColor
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <statusConfig.icon className="w-3 h-3" />
                  <span className="font-semibold">{statusConfig.label}</span>
                  <span className="font-bold text-xs px-1.5 py-0.5 rounded-full bg-white/20">
                    {count}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Enhanced Statements List */}
      <div className="p-4">
        {displayStatements.length > 0 ? (
          <motion.div 
            className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar"
            variants={containerVariants}
          >
            {displayStatements.map((statement: StatementSummary, index: number) => (
              <DashActivityItem
                key={statement.id || index}
                statement={statement}
                index={index}
                itemVariants={itemVariants}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-12"
            variants={itemVariants}
          >
            <motion.div 
              className="mb-4 opacity-40"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Hash className="w-12 h-12 mx-auto" style={{ color: themeColors.mutedText }} />
            </motion.div>
            <p className="text-lg font-medium mb-2" style={{ color: themeColors.primaryText }}>
              No recent activity
            </p>
            <p className="text-sm" style={{ color: themeColors.mutedText }}>
              Fact-checked statements will appear here
            </p>
          </motion.div>
        )}
        
        {/* Enhanced Footer */}
        {statements.length > limit && (
          <motion.div 
            className="mt-4 pt-4 border-t"
            style={{ borderColor: themeColors.divider }}
            variants={itemVariants}
          >
            <motion.button 
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden group"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}05)`,
                border: `1px solid ${colors.primary}30`,
                color: themeColors.accentColor
              }}
              whileHover={{ 
                scale: 1.02,
                background: `linear-gradient(135deg, ${colors.primary}25, ${colors.primary}10)`
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                console.log('View all statements for profile:', statsData.profile_id);
              }}
            >
              <span className="relative z-10">
                View All {stats.total_statements || statements.length} Statements →
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? 'rgba(71, 85, 105, 0.1)' : 'rgba(203, 213, 225, 0.2)'};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.3)'};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)'};
        }
      `}</style>
    </motion.div>
  );
};

export default DashActivity;