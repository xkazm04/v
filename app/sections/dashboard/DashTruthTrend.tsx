'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Speaker } from '@/app/constants/speakers';
import { ProfileStatsResponse } from '@/app/types/profile';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Bar, BarChart } from 'recharts';
import { TrendingUp, BarChart3, LineChart, Activity, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface TruthTrendChartProps {
  // For real data
  profileId?: string;
  stats?: ProfileStatsResponse;
  // For mock data
  speaker?: Speaker;
  timeRange?: string;
}

const DashTruthTrend = ({ profileId, stats, speaker, timeRange }: TruthTrendChartProps) => {
  const [viewMode, setViewMode] = useState<'trend' | 'breakdown'>('trend');
  const [isHovered, setIsHovered] = useState(false);
  const { colors, isDark } = useLayoutTheme();

  // Determine data source and prepare chart data
  let data: any[] = [];
  let currentTruthRate = 0;
  let previousTruthRate = 0;

  if (stats?.recent_statements) {
    // Use real data from stats
    const monthlyStats: Record<string, { truthful: number; misleading: number; false: number; total: number }> = {};
    
    stats.recent_statements.forEach(statement => {
      if (statement.created_at) {
        const month = new Date(statement.created_at).toLocaleDateString('en', { month: 'short' });
        if (!monthlyStats[month]) {
          monthlyStats[month] = { truthful: 0, misleading: 0, false: 0, total: 0 };
        }
        
        monthlyStats[month].total++;
        switch (statement.status) {
          case 'TRUE':
            monthlyStats[month].truthful++;
            break;
          case 'MISLEADING':
            monthlyStats[month].misleading++;
            break;
          case 'FALSE':
            monthlyStats[month].false++;
            break;
        }
      }
    });

    data = Object.entries(monthlyStats).map(([month, stats]) => ({
      month,
      truthful: stats.truthful,
      misleading: stats.misleading,
      false: stats.false,
      total: stats.total,
      truthRate: Math.round((stats.truthful / stats.total) * 100),
      Truthful: stats.truthful,
      Misleading: stats.misleading,
      False: stats.false,
    }));
  } else if (speaker) {
    // Use mock data from speaker
    const enhancedData = [
      { month: 'Jan', truthful: 18, misleading: 5, false: 2, total: 25 },
      { month: 'Feb', truthful: 22, misleading: 4, false: 3, total: 29 },
      { month: 'Mar', truthful: 19, misleading: 7, false: 4, total: 30 },
      { month: 'Apr', truthful: 25, misleading: 6, false: 2, total: 33 },
      { month: 'May', truthful: 21, misleading: 8, false: 3, total: 32 },
      { month: 'Jun', truthful: 27, misleading: 5, false: 3, total: 35 },
      { month: 'Jul', truthful: 23, misleading: 9, false: 4, total: 36 },
      { month: 'Aug', truthful: 29, misleading: 6, false: 2, total: 37 },
      { month: 'Sep', truthful: 26, misleading: 7, false: 5, total: 38 },
      { month: 'Oct', truthful: 31, misleading: 4, false: 3, total: 38 },
      { month: 'Nov', truthful: 28, misleading: 8, false: 4, total: 40 },
      { month: 'Dec', truthful: 33, misleading: 5, false: 2, total: 40 },
    ];

    data = enhancedData.map(item => ({
      ...item,
      truthRate: Math.round((item.truthful / item.total) * 100),
      Truthful: item.truthful,
      Misleading: item.misleading,
      False: item.false,
    }));
  }

  // Enhanced stats calculation
  currentTruthRate = data[data.length - 1]?.truthRate || 0;
  previousTruthRate = data[data.length - 2]?.truthRate || 0;
  const trendDirection = currentTruthRate > previousTruthRate ? 'up' : 'down';
  const trendChange = Math.abs(currentTruthRate - previousTruthRate);

  // If no data available, don't render the component
  if (data.length === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="backdrop-blur-xl border rounded-xl p-4 shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)'}, ${isDark ? 'rgba(30,30,30,0.95)' : 'rgba(248,250,252,0.95)'})`,
            border: `1px solid ${colors.primary}30`,
            boxShadow: `0 20px 40px -12px ${colors.primary}30`
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
            <p className="font-bold text-foreground">{label}</p>
          </div>
          
          {viewMode === 'trend' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-sm font-medium">Truth Rate:</span>
                <span className="text-foreground font-bold">{payload[0].value}%</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {payload[0].payload.truthful}/{payload[0].payload.total} statements analyzed
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-sm shadow-sm" 
                      style={{ backgroundColor: entry.color }} 
                    />
                    <span className="text-foreground text-sm font-medium">{entry.dataKey}:</span>
                  </div>
                  <span className="text-foreground font-bold text-sm">{entry.value}</span>
                </div>
              ))}
              <div className="text-xs text-muted-foreground pt-1 border-t border-border">
                Total: {payload.reduce((sum: number, entry: any) => sum + entry.value, 0)} statements
              </div>
            </div>
          )}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-2xl border backdrop-blur-xl p-6"
      style={{
        background: `linear-gradient(135deg, 
          ${isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)'} 0%, 
          ${isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(241, 245, 249, 0.9)'} 100%)`,
        borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)',
        boxShadow: `0 20px 40px -12px ${colors.primary}10`
      }}
    >
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.primary}${Math.floor(30 - i * 5).toString(16)}, transparent)`,
              width: `${40 + i * 20}px`,
              height: `${40 + i * 20}px`,
              left: `${15 + i * 18}%`,
              top: `${10 + (i % 2) * 35}%`,
            }}
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4 + i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4
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
              <TrendingUp className="h-5 w-5" style={{ color: colors.primary }} />
            </motion.div>
            
            <div>
              <h3 className="text-lg font-bold text-foreground">Truth Trend Analysis</h3>
              <p className="text-xs text-muted-foreground">
                {viewMode === 'trend' ? 'Truth rate trend over time' : 'Statement type breakdown'}
                {stats && ' • Real Data'}
                {speaker && ' • Mock Data'}
              </p>
            </div>
          </div>

          {/* Stats and mode toggle */}
          <div className="flex items-center gap-3">
            {/* Current stats */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                <span className="text-xs font-bold text-green-400">{currentTruthRate}%</span>
              </div>
              
              {trendChange > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                  <motion.div
                    animate={{ rotate: trendDirection === 'up' ? 0 : 180 }}
                    className={trendDirection === 'up' ? 'text-green-400' : 'text-red-400'}
                  >
                    <TrendingUp className="w-3 h-3" />
                  </motion.div>
                  <span className="text-xs font-medium text-blue-400">
                    {trendChange}%
                  </span>
                </div>
              )}
            </div>
            
            {/* Mode toggle */}
            <div className="flex rounded-lg overflow-hidden border"
              style={{ borderColor: `${colors.primary}30` }}
            >
              {[
                { mode: 'trend', icon: LineChart, label: 'Trend' },
                { mode: 'breakdown', icon: BarChart3, label: 'Breakdown' }
              ].map(({ mode, icon: Icon, label }) => (
                <motion.button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className="px-3 py-1.5 text-xs font-medium transition-all duration-300 flex items-center gap-1"
                  style={{
                    background: viewMode === mode 
                      ? `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`
                      : 'transparent',
                    color: viewMode === mode ? 'white' : colors.foreground
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced Chart Container */}
        <motion.div
          className="relative h-72 rounded-xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, 
              ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)'}, 
              ${isDark ? 'rgba(15,23,42,0.3)' : 'rgba(248,250,252,0.4)'})`,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
          }}
          whileHover={{ scale: 1.005 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Enhanced background pattern for chart area */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 20px,
                ${colors.primary} 20px,
                ${colors.primary} 21px
              ), repeating-linear-gradient(
                0deg,
                transparent,
                transparent 20px,
                ${colors.primary} 20px,
                ${colors.primary} 21px
              )`
            }}
          />
          
          <ResponsiveContainer width="100%" height="100%">
            <AnimatePresence mode="wait">
              {viewMode === 'trend' ? (
                <motion.div
                  key="trend"
                  initial={{ opacity: 0, rotateY: -90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: 90 }}
                  transition={{ duration: 0.5 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="truthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.primary} stopOpacity={0.9} />
                        <stop offset="30%" stopColor={colors.primary} stopOpacity={0.6} />
                        <stop offset="60%" stopColor={colors.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={colors.primary} stopOpacity={0.1} />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'} 
                      opacity={0.4} 
                    />
                    <XAxis 
                      dataKey="month" 
                      stroke={colors.foreground}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke={colors.foreground}
                      fontSize={11}
                      domain={[0, 100]}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="truthRate"
                      stroke={colors.primary}
                      strokeWidth={4}
                      fill="url(#truthGradient)"
                      filter="url(#glow)"
                      dot={{ 
                        fill: colors.primary, 
                        strokeWidth: 3, 
                        r: 5,
                        stroke: 'white',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                      }}
                      activeDot={{ 
                        r: 8, 
                        stroke: colors.primary, 
                        strokeWidth: 3,
                        fill: 'white',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                      }}
                    />
                  </AreaChart>
                </motion.div>
              ) : (
                <motion.div
                  key="breakdown"
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.5 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="truthfulGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="misleadingGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#d97706" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="falseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'} 
                      opacity={0.4} 
                    />
                    <XAxis 
                      dataKey="month" 
                      stroke={colors.foreground}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke={colors.foreground}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="Truthful" 
                      stackId="a" 
                      fill="url(#truthfulGrad)" 
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar 
                      dataKey="Misleading" 
                      stackId="a" 
                      fill="url(#misleadingGrad)" 
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar 
                      dataKey="False" 
                      stackId="a" 
                      fill="url(#falseGrad)" 
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </motion.div>
              )}
            </AnimatePresence>
          </ResponsiveContainer>
        </motion.div>
        
        {/* Enhanced Legend */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-6 text-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { label: 'Truthful', color: '#22c55e', icon: '✓', bgGrad: 'from-green-500/20 to-green-600/30' },
            { label: 'Misleading', color: '#f59e0b', icon: '⚠', bgGrad: 'from-yellow-500/20 to-yellow-600/30' },
            { label: 'False', color: '#ef4444', icon: '✗', bgGrad: 'from-red-500/20 to-red-600/30' }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${item.bgGrad} border border-opacity-20 border-current`}
              style={{ borderColor: item.color }}
              whileHover={{ scale: 1.05, y: -2 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <div
                className="w-4 h-4 rounded-sm flex items-center justify-center text-white text-xs font-bold shadow-lg"
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </div>
              <span className="font-semibold" style={{ color: item.color }}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashTruthTrend;