'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { ProfileStatsResponse, StatementStatus } from '@/app/types/profile';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import DashActivityItem from './DashStatements/DashActivityItem';
import { getStatusConfig } from '@/app/helpers/statusConfig'; // ✅ Import shared helper
import { containerVariants } from '@/app/helpers/animation';
import { itemVariants } from '@/app/components/animations/variants/votingVariants';

interface DashActivityProps {
  statsData: ProfileStatsResponse;
  limit?: number;
}

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
                style={{ color: isDark ? colors.mutedForeground : vintage.faded }}
              >
                Latest fact-checked statements
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div 
              className="text-sm font-medium"
              style={{ color: isDark ? colors.mutedForeground : vintage.faded }}
            >
              {displayStatements.length} of {statements.length}
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="flex flex-wrap gap-2 relative z-10">
          {Object.entries(verdictSummary).map(([status, count]) => {
            const statusConfig = getStatusConfig(status as StatementStatus, isDark);
            return (
              <motion.div
                key={status}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                style={{
                  background: statusConfig.colors.badgeBackground,
                  border: `1px solid ${statusConfig.colors.badgeBorder}`,
                  color: statusConfig.colors.textColor
                }}
                whileHover={{ scale: 1.05 }}
              >
                <statusConfig.icon className="w-3 h-3" />
                <span className="font-semibold">{count}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Activity Items */}
      <div className="p-5 space-y-4">
        {displayStatements.map((statement, index) => (
          <DashActivityItem
            key={statement.id || index}
            statement={statement}
            index={index}
            itemVariants={itemVariants}
          />
        ))}

        {displayStatements.length === 0 && (
          <motion.div 
            variants={itemVariants}
            className="text-center py-8"
            style={{ color: isDark ? colors.mutedForeground : vintage.faded }}
          >
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">No recent statements available</p>
          </motion.div>
        )}
      </div>

      {/* Vintage aging effect for light mode */}
      {!isDark && (
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none rounded-2xl"
          style={{
            background: `
              radial-gradient(ellipse 200% 100% at 50% 0%, transparent 60%, rgba(139, 69, 19, 0.015) 100%),
              radial-gradient(ellipse 150% 80% at 20% 100%, transparent 70%, rgba(139, 69, 19, 0.01) 100%)
            `
          }}
        />
      )}
    </motion.div>
  );
};

export default DashActivity;