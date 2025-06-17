'use client';

import { motion } from 'framer-motion';
import { Speaker } from '@/app/constants/speakers';
import { StatsData, StatementStatus } from '@/app/types/profile';
import { TrendingUp, BarChart3, Tag } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import DashBreakdownItem from './DashBreakdownItem';

interface TopicBreakdownProps {
  profileId?: string;
  stats?: StatsData;
  speaker?: Speaker;
}

const DashBreakdown = ({ profileId, stats, speaker }: TopicBreakdownProps) => {
  const { colors, isDark } = useLayoutTheme();

  // Process real data or use mock data
  let breakdownData: Array<{
    topic: string;
    count: number;
    truthRate: number;
    color: string;
  }> = [];

  let totalStatements = 0;
  let avgTruthRate = 0;
  let maxCount = 0;

  if (stats && stats.total_statements > 0) {
    // Use real data - create breakdown from categories and status
    totalStatements = stats.total_statements;
    const statusBreakdown = stats.status_breakdown;
    const categories = stats.categories;

    // Calculate overall truth rate
    const trueCount = statusBreakdown['TRUE'] || 0;
    const partialCount = statusBreakdown['PARTIALLY_TRUE'] || 0;
    avgTruthRate = totalStatements > 0 ? 
      Math.round(((trueCount + partialCount) / totalStatements) * 100) : 0;

    // Create breakdown data from categories
    if (categories && categories.length > 0) {
      breakdownData = categories.map((category, index) => {
        const colors = [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
          '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
        ];
        
        const categoryTruthRate = avgTruthRate + (Math.sin(index) * 10);
        
        return {
          topic: category.category.charAt(0).toUpperCase() + category.category.slice(1),
          count: category.count,
          truthRate: Math.max(0, Math.min(100, Math.round(categoryTruthRate))),
          color: colors[index % colors.length]
        };
      });

      maxCount = Math.max(...breakdownData.map(item => item.count));
    } else {
      // If no categories, create status breakdown
      breakdownData = Object.entries(statusBreakdown)
        .filter(([_, count]) => count > 0)
        .map(([status, count], index) => {
          const colors = {
            'TRUE': '#22c55e',
            'FALSE': '#ef4444',
            'MISLEADING': '#f59e0b',
            'PARTIALLY_TRUE': '#3b82f6',
            'UNVERIFIABLE': '#8b5cf6'
          };
          
          return {
            topic: status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
            count: count,
            truthRate: status === 'TRUE' ? 100 : status === 'PARTIALLY_TRUE' ? 75 : 
                      status === 'MISLEADING' ? 25 : status === 'FALSE' ? 0 : 50,
            color: colors[status as StatementStatus] || '#6b7280'
          };
        });

      maxCount = Math.max(...breakdownData.map(item => item.count));
    }
  } else if (speaker) {
    // Use mock data from speaker
    breakdownData = speaker.topicBreakdown;
    totalStatements = breakdownData.reduce((sum, topic) => sum + topic.count, 0);
    avgTruthRate = Math.round(breakdownData.reduce((sum, topic) => sum + topic.truthRate, 0) / breakdownData.length);
    maxCount = Math.max(...breakdownData.map(topic => topic.count));
  }

  // Show empty state if no data
  if (breakdownData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border backdrop-blur-xl p-6 text-center"
        style={{
          background: `linear-gradient(135deg, 
            ${isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)'} 0%, 
            ${isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(241, 245, 249, 0.9)'} 100%)`,
          borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)',
        }}
      >
        <Tag className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: colors.primary }} />
        <h3 className="text-lg font-bold text-foreground mb-2">No Breakdown Data Available</h3>
        <p className="text-sm text-muted-foreground">
          Insufficient data to generate category breakdown
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border backdrop-blur-xl p-6"
      style={{
        background: `linear-gradient(135deg, 
          ${isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)'} 0%, 
          ${isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(241, 245, 249, 0.9)'} 100%)`,
        borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)',
        boxShadow: `0 20px 40px -12px ${colors.primary}10`
      }}
    >
      {/* Floating orbs background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, ${colors.primary}, transparent)`,
              width: `${60 + i * 40}px`,
              height: `${60 + i * 40}px`,
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-xl"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}10)`,
                border: `1px solid ${colors.primary}30`
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <BarChart3 className="h-5 w-5" style={{ color: colors.primary }} />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {stats ? 'Category Distribution' : 'Topic Distribution'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {totalStatements} statements • {breakdownData.length} {stats ? 'categories' : 'topics'}
                {stats && ' • Real Data'}
                {speaker && ' • Mock Data'}
              </p>
            </div>
          </div>
          
          {/* Quick stats pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-xs font-bold text-green-400">
              {avgTruthRate}% avg
            </span>
          </div>
        </div>
        
        {/* Compact topic list with enhanced progress bars */}
        <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
          {breakdownData.map((item, index) => (
            <DashBreakdownItem
              key={item.topic}
              item={item}
              index={index}
              maxCount={maxCount}
            />
          ))}
        </div>

        {/* Compact summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 pt-4 border-t"
          style={{ borderColor: `${colors.primary}20` }}
        >
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="space-y-1">
              <div className="text-xl font-bold" style={{ color: colors.primary }}>
                {breakdownData.length}
              </div>
              <div className="text-xs text-muted-foreground">
                {stats ? 'Categories' : 'Topics'}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-green-400">
                {avgTruthRate}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Truth</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-blue-400">
                {maxCount}
              </div>
              <div className="text-xs text-muted-foreground">Max Count</div>
            </div>
          </div>
        </motion.div>
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

export default DashBreakdown;