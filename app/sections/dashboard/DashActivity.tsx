'use client';

import { motion } from 'framer-motion';
import { useProfileStatements } from '@/app/hooks/useProfile';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { getEvaluationIcon } from '@/app/helpers/factCheck';
import { formatDistanceToNow } from 'date-fns';
import { Clock, TrendingUp, ExternalLink } from 'lucide-react';
import { DashEmpty, DashError, DashLoading } from './DashStatements/DashStates';

interface ProfileActivityProps {
  profileId: string;
  limit?: number;
}

interface ProfileStatement {
  id: string;
  statement: string;
  verdict?: string;
  status?: string;
  confidence?: number;
  category?: string;
  created_at: string;
  updated_at?: string;
  sources_count?: number;
  fact_check_url?: string;
}

// Map API status to UI evaluation format
const mapStatusToEvaluation = (status?: string): string => {
  switch (status?.toUpperCase()) {
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

// Get status color based on theme
const getStatusColor = (status: string, isDark: boolean) => {
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

const DashActivity = ({ profileId, limit = 10 }: ProfileActivityProps) => {
  const { colors, isDark, cardColors } = useLayoutTheme();
  
  // Fetch profile statements
  const { 
    data: statementsResponse, 
    isLoading, 
    error, 
    isError 
  } = useProfileStatements(profileId, { limit, offset: 0 });

  const statements = statementsResponse?.data?.statements || [];
  const totalCount = statementsResponse?.data?.total || 0;

  // Theme colors
  const themeColors = {
    cardBackground: cardColors.background,
    cardBorder: cardColors.border,
    cardShadow: cardColors.shadow,
    background: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(248, 250, 252, 0.6)',
    itemBackground: isDark ? 'rgba(71, 85, 105, 0.2)' : 'rgba(255, 255, 255, 0.8)',
    itemBorder: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.4)',
    itemHover: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(241, 245, 249, 0.9)',
    text: colors.foreground,
    mutedText: isDark ? 'rgba(148, 163, 184, 0.9)' : 'rgba(100, 116, 139, 0.9)',
    accent: colors.primary,
    errorBg: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 242, 242, 0.8)',
    errorBorder: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
    successBg: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(240, 253, 244, 0.8)',
    pendingBg: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 246, 255, 0.8)'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border p-6 shadow-sm"
      style={{
        background: themeColors.cardBackground,
        borderColor: themeColors.cardBorder,
        boxShadow: themeColors.cardShadow
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold" style={{ color: themeColors.text }}>
          Recent Activity
        </h3>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: themeColors.accent }} />
          <span className="text-sm font-medium" style={{ color: themeColors.accent }}>
            {totalCount} total
          </span>
        </div>
      </div>
      
      {/* Statements List */}
      <div className="space-y-3 max-h-96 overflow-y-auto content-scroll">
        {statements.map((statement: ProfileStatement, index: number) => {
          const evaluation = mapStatusToEvaluation(statement.status);
          const statusColor = getStatusColor(statement.status || '', isDark);
          
          return (
            <motion.div
              key={statement.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border rounded-lg p-4 transition-all duration-200 cursor-pointer group"
              style={{
                background: themeColors.itemBackground,
                borderColor: themeColors.itemBorder
              }}
              whileHover={{
                backgroundColor: themeColors.itemHover,
                scale: 1.01
              }}
            >
              <div className="flex items-start gap-3">
                {/* Status indicator */}
                <div className="flex items-center gap-2 mt-1 flex-shrink-0">
                  {getEvaluationIcon(evaluation, 'sm')}
                  <span className={`text-xs font-medium ${statusColor}`}>
                    {evaluation === 'PENDING' ? 'ANALYZING' : evaluation}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Statement text */}
                  <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: themeColors.text }}>
                    "{statement.statement}"
                  </p>
                  
                  {/* Verdict (if available) */}
                  {statement.verdict && (
                    <div 
                      className="text-xs p-2 rounded border-l-2 mb-3"
                      style={{
                        background: evaluation === 'TRUE' ? themeColors.successBg : 
                                   evaluation === 'FALSE' ? themeColors.errorBg : 
                                   themeColors.pendingBg,
                        borderLeftColor: evaluation === 'TRUE' ? '#22c55e' : 
                                        evaluation === 'FALSE' ? '#ef4444' : 
                                        '#3b82f6',
                        color: themeColors.text
                      }}
                    >
                      <strong>Verdict:</strong> {statement.verdict}
                    </div>
                  )}
                  
                  {/* Metadata */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs" style={{ color: themeColors.mutedText }}>
                      {statement.category && (
                        <span className="capitalize">{statement.category.toLowerCase()}</span>
                      )}
                      {statement.sources_count && (
                        <span>{statement.sources_count} sources</span>
                      )}
                      {statement.confidence && (
                        <span>{statement.confidence}% confidence</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" style={{ color: themeColors.mutedText }} />
                      <span className="text-xs" style={{ color: themeColors.mutedText }}>
                        {formatDistanceToNow(new Date(statement.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Fact-check URL (if available) */}
                  {statement.fact_check_url && (
                    <div className="mt-2 pt-2 border-t" style={{ borderColor: themeColors.itemBorder }}>
                      <a
                        href={statement.fact_check_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs hover:underline transition-colors"
                        style={{ color: themeColors.accent }}
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Fact-Check
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: themeColors.cardBorder }}>
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: themeColors.mutedText }}>
            Showing {statements.length} of {totalCount} statements
          </span>
          
          {totalCount > limit && (
            <button 
              className="text-sm font-medium transition-colors hover:underline"
              style={{ color: themeColors.accent }}
              onClick={() => {
                // TODO: Implement "View All" functionality
                console.log('View all statements for profile:', profileId);
              }}
            >
              View All Statements →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashActivity;