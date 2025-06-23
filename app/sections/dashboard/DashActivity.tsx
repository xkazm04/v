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

// Enhanced status configuration with universal theming
const getStatusConfig = (status: StatementStatus, isDark: boolean, universalCard: any) => {
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
  const { colors, isDark, vintage, universalCard, getCardColors } = useLayoutTheme();
  
  const { recent_statements: statements, stats } = statsData;
  const displayStatements = statements.slice(0, limit);

  const cardColors = getCardColors(false, false);

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
      className="rounded-2xl overflow-hidden h-fit sticky top-6"
      style={{
        background: cardColors.background,
        border: `1px solid ${cardColors.border}`,
        boxShadow: cardColors.shadow
      }}
    >
      {/* Universal vintage paper texture for light mode */}
      {!isDark && (
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none rounded-2xl"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.015) 1px, transparent 1px),
              radial-gradient(ellipse 80% 60% at 30% 40%, rgba(139, 69, 19, 0.01), transparent 70%)
            `,
            backgroundSize: '40px 40px, 25px 25px, 100% 100%'
          }}
        />
      )}

      {/* Enhanced Header with Universal Theming */}
      <motion.div 
        className="p-5 border-b relative"
        style={{ 
          borderColor: isDark ? colors.border : vintage.aged,
          background: isDark 
            ? 'linear-gradient(135deg, rgba(51, 65, 85, 0.6), rgba(30, 41, 59, 0.4))'
            : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(255, 255, 255, 0.6))'
        }}
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-xl"
              style={{ 
                background: isDark 
                  ? `linear-gradient(135deg, ${universalCard.accent}20, ${universalCard.accent}10)`
                  : `linear-gradient(135deg, ${universalCard.accent}20, ${universalCard.accent}15)`,
                border: `1px solid ${universalCard.accent}30`
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: universalCard.accent }} />
            </motion.div>
            <div>
              <h3 
                className="text-lg font-bold"
                style={{ 
                  color: isDark ? colors.foreground : vintage.ink,
                  fontFamily: '"Playfair Display", serif'
                }}
              >
                Recent Activity
              </h3>
              <p 
                className="text-sm"
                style={{ 
                  color: isDark ? colors.mutedForeground : vintage.faded,
                  fontFamily: '"Crimson Text", serif'
                }}
              >
                Latest fact-checked statements
              </p>
            </div>
          </div>
          
          <motion.div 
            className="text-right"
            whileHover={{ scale: 1.05 }}
          >
            <div 
              className="text-2xl font-bold"
              style={{ 
                color: universalCard.accent,
                fontFamily: '"Playfair Display", serif'
              }}
            >
              {statements.length}
            </div>
            <div 
              className="text-xs"
              style={{ 
                color: isDark ? colors.mutedForeground : vintage.faded,
                fontFamily: '"Crimson Text", serif'
              }}
            >
              statements
            </div>
          </motion.div>
        </div>
        
        {/* Enhanced Verdict Summary with Universal Theming */}
        <div className="flex flex-wrap gap-2 relative z-10">
          <AnimatePresence>
            {Object.entries(verdictSummary).map(([status, count], index) => {
              const statusConfig = getStatusConfig(status as StatementStatus, isDark, universalCard);
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
                    color: statusConfig.colors.textColor,
                    fontFamily: '"Crimson Text", serif'
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
      <div className="p-4 relative z-10">
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
              <Hash 
                className="w-12 h-12 mx-auto" 
                style={{ color: isDark ? colors.mutedForeground : vintage.faded }} 
              />
            </motion.div>
            <p 
              className="text-lg font-medium mb-2"
              style={{ 
                color: isDark ? colors.foreground : vintage.ink,
                fontFamily: '"Playfair Display", serif'
              }}
            >
              No recent activity
            </p>
            <p 
              className="text-sm"
              style={{ 
                color: isDark ? colors.mutedForeground : vintage.faded,
                fontFamily: '"Crimson Text", serif'
              }}
            >
              Fact-checked statements will appear here
            </p>
          </motion.div>
        )}
        
        {/* Enhanced Footer with Universal Theming */}
        {statements.length > limit && (
          <motion.div 
            className="mt-4 pt-4 border-t"
            style={{ borderColor: isDark ? colors.border : vintage.aged }}
            variants={itemVariants}
          >
            <motion.button 
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden group"
              style={{ 
                background: isDark 
                  ? `linear-gradient(135deg, ${universalCard.accent}15, ${universalCard.accent}05)`
                  : `linear-gradient(135deg, ${universalCard.accent}15, ${universalCard.accent}08)`,
                border: `1px solid ${universalCard.accent}30`,
                color: universalCard.accent,
                fontFamily: '"Crimson Text", serif'
              }}
              whileHover={{ 
                scale: 1.02,
                background: isDark 
                  ? `linear-gradient(135deg, ${universalCard.accent}25, ${universalCard.accent}10)`
                  : `linear-gradient(135deg, ${universalCard.accent}25, ${universalCard.accent}15)`
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

      {/* Universal corner ornaments for light mode */}
      {!isDark && (
        <>
          <div 
            className="absolute top-3 left-3 w-4 h-4 opacity-10 z-20"
            style={{
              background: universalCard.accent,
              clipPath: 'polygon(0 0, 100% 0, 0 100%)'
            }}
          />
          <div 
            className="absolute bottom-3 right-3 w-4 h-4 opacity-10 z-20"
            style={{
              background: universalCard.accent,
              clipPath: 'polygon(100% 100%, 0 100%, 100% 0)'
            }}
          />
        </>
      )}
    </motion.div>
  );
};

export default DashActivity;