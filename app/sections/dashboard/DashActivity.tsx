'use client';

import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { getEvaluationIcon } from '@/app/helpers/factCheck';
import { formatDistanceToNow } from 'date-fns';
import { Clock, TrendingUp, ExternalLink, Hash, Tag } from 'lucide-react';
import { ProfileStatsResponse, StatementSummary, StatementStatus } from '@/app/types/profile';
import { FloatingVerdictIcon } from '@/app/components/ui/Decorative/FloatingVerdictIcon';


interface DashActivityProps {
  statsData: ProfileStatsResponse;
  limit?: number;
}

// Map API status to UI evaluation format
const mapStatusToEvaluation = (status: StatementStatus): string => {
  switch (status) {
    case 'TRUE':
      return 'TRUE';
    case 'FALSE':
      return 'FALSE';
    case 'MISLEADING':
      return 'MISLEADING';
    case 'PARTIALLY_TRUE':
      return 'PARTIALLY_TRUE';
    case 'UNVERIFIABLE':
      return 'UNVERIFIABLE';
    default:
      return 'PENDING';
  }
};

// Get status color and icon based on theme
const getStatusColor = (status: StatementStatus, isDark: boolean) => {
  const evaluation = mapStatusToEvaluation(status);
  
  switch (evaluation) {
    case 'TRUE':
      return isDark ? 'text-green-400' : 'text-green-600';
    case 'FALSE':
      return isDark ? 'text-red-400' : 'text-red-600';
    case 'MISLEADING':
      return isDark ? 'text-yellow-400' : 'text-yellow-600';
    case 'PARTIALLY_TRUE':
      return isDark ? 'text-blue-400' : 'text-blue-600';
    case 'UNVERIFIABLE':
      return isDark ? 'text-purple-400' : 'text-purple-600';
    default:
      return isDark ? 'text-gray-400' : 'text-gray-600';
  }
};

const getStatusBadgeStyle = (status: StatementStatus, isDark: boolean) => {
  const evaluation = mapStatusToEvaluation(status);
  
  switch (evaluation) {
    case 'TRUE':
      return {
        bg: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(240, 253, 244, 0.8)',
        border: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.3)',
        text: isDark ? '#4ade80' : '#16a34a'
      };
    case 'FALSE':
      return {
        bg: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(254, 242, 242, 0.8)',
        border: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.3)',
        text: isDark ? '#f87171' : '#dc2626'
      };
    case 'MISLEADING':
      return {
        bg: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 251, 235, 0.8)',
        border: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.3)',
        text: isDark ? '#fbbf24' : '#d97706'
      };
    case 'PARTIALLY_TRUE':
      return {
        bg: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 246, 255, 0.8)',
        border: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.3)',
        text: isDark ? '#60a5fa' : '#2563eb'
      };
    default:
      return {
        bg: isDark ? 'rgba(107, 114, 128, 0.15)' : 'rgba(249, 250, 251, 0.8)',
        border: isDark ? 'rgba(107, 114, 128, 0.3)' : 'rgba(107, 114, 128, 0.3)',
        text: isDark ? '#9ca3af' : '#6b7280'
      };
  }
};

const DashActivity = ({ statsData, limit = 8 }: DashActivityProps) => {
  const { colors, isDark, cardColors } = useLayoutTheme();
  
  const { recent_statements: statements, stats } = statsData;
  const displayStatements = statements.slice(0, limit);

  // Theme colors
  const themeColors = {
    cardBackground: cardColors.background,
    cardBorder: cardColors.border,
    cardShadow: cardColors.shadow,
    background: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(248, 250, 252, 0.6)',
    itemBackground: isDark ? 'rgba(71, 85, 105, 0.15)' : 'rgba(255, 255, 255, 0.6)',
    itemBorder: isDark ? 'rgba(71, 85, 105, 0.2)' : 'rgba(203, 213, 225, 0.3)',
    itemHover: isDark ? 'rgba(71, 85, 105, 0.25)' : 'rgba(241, 245, 249, 0.8)',
    text: colors.foreground,
    mutedText: isDark ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)',
    accent: colors.primary,
    subtleText: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(100, 116, 139, 0.6)'
  };

  // Calculate verdict summary
  const verdictSummary = statements.reduce((acc, statement) => {
    const status = statement.status || 'UNVERIFIABLE';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<StatementStatus, number>);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl border shadow-sm h-fit sticky top-6"
      style={{
        background: themeColors.cardBackground,
        borderColor: themeColors.cardBorder,
        boxShadow: themeColors.cardShadow
      }}
    >
      {/* Header with floating verdict icons */}
      <div className="p-4 pb-3 border-b relative overflow-hidden" style={{ borderColor: themeColors.cardBorder }}>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: themeColors.accent }} />
            <h3 className="text-sm font-semibold" style={{ color: themeColors.text }}>
              Recent Activity
            </h3>
          </div>
          <span className="text-xs font-medium" style={{ color: themeColors.accent }}>
            {stats.total_statements}
          </span>
        </div>
        
        {/* Verdict Summary with compact badges */}
        <div className="flex flex-wrap gap-1 mt-2 relative z-10">
          {Object.entries(verdictSummary).map(([status, count]) => {
            const statusStyle = getStatusBadgeStyle(status as StatementStatus, isDark);
            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
                style={{
                  background: statusStyle.bg,
                  borderColor: statusStyle.border,
                  color: statusStyle.text
                }}
              >
                <span className="capitalize text-xs">
                  {status.toLowerCase().replace('_', ' ')}
                </span>
                <span className="font-bold">{count}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Decorative floating verdict icons */}
        <div className="absolute top-0 right-0 opacity-20">
          <FloatingVerdictIcon 
            size="sm" 
            confidence={85} 
            delay={0.5} 
            autoAnimate={true}
          />
        </div>
      </div>
      
      {/* Compact Statements List */}
      <div className="p-3">
        {displayStatements.length > 0 ? (
          <div className="space-y-2 max-h-80 overflow-y-auto content-scroll">
            {displayStatements.map((statement: StatementSummary, index: number) => {
              const evaluation = mapStatusToEvaluation(statement.status);
              const statusColor = getStatusColor(statement.status, isDark);
              const statusStyle = getStatusBadgeStyle(statement.status, isDark);
              
              return (
                <motion.div
                  key={statement.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border rounded-lg p-3 transition-all duration-200 cursor-pointer group hover:shadow-sm"
                  style={{
                    background: themeColors.itemBackground,
                    borderColor: themeColors.itemBorder
                  }}
                  whileHover={{
                    backgroundColor: themeColors.itemHover,
                    scale: 1.005
                  }}
                >
                  {/* Status badge and category */}
                  <div className="flex items-center justify-between mb-2">
                    <div 
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
                      style={{
                        background: statusStyle.bg,
                        borderColor: statusStyle.border,
                        color: statusStyle.text
                      }}
                    >
                      {getEvaluationIcon(evaluation, 'xs')}
                      <span className="uppercase tracking-wide text-xs font-bold">
                        {evaluation === 'PARTIALLY_TRUE' ? 'PARTIAL' : evaluation}
                      </span>
                    </div>
                    
                    {statement.category && (
                      <div className="flex items-center gap-1" style={{ color: themeColors.subtleText }}>
                        <Tag className="w-3 h-3" />
                        <span className="text-xs capitalize">
                          {statement.category.toLowerCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Statement text - compact */}
                  <p className="text-xs leading-relaxed line-clamp-2 mb-2" style={{ color: themeColors.text }}>
                    "{statement.statement}"
                  </p>
                  
                  {/* Verdict summary - very compact */}
                  {statement.verdict && (
                    <div className="text-xs mb-2 line-clamp-1" style={{ color: themeColors.mutedText }}>
                      <strong>Verdict:</strong> {statement.verdict}
                    </div>
                  )}
                  
                  {/* Metadata footer */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1" style={{ color: themeColors.subtleText }}>
                      <Clock className="w-3 h-3" />
                      <span>
                        {statement.created_at 
                          ? formatDistanceToNow(new Date(statement.created_at), { addSuffix: true })
                          : 'Recently'
                        }
                      </span>
                    </div>
                    
                    <button
                      className="inline-flex items-center gap-1 text-xs hover:underline transition-colors opacity-0 group-hover:opacity-100"
                      style={{ color: themeColors.accent }}
                      onClick={() => {
                        // TODO: Navigate to statement detail
                        console.log('View statement details:', statement.id);
                      }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mb-3 opacity-50">
              <Hash className="w-8 h-8 mx-auto" style={{ color: themeColors.mutedText }} />
            </div>
            <p className="text-sm" style={{ color: themeColors.mutedText }}>
              No recent statements found
            </p>
          </div>
        )}
        
        {/* Footer */}
        {statements.length > limit && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: themeColors.cardBorder }}>
            <button 
              className="w-full text-xs font-medium transition-colors hover:underline text-center"
              style={{ color: themeColors.accent }}
              onClick={() => {
                // TODO: Implement "View All" functionality
                console.log('View all statements for profile:', statsData.profile_id);
              }}
            >
              View All {stats.total_statements} Statements →
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashActivity;