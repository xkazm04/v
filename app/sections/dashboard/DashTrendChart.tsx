'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Bar, BarChart } from 'recharts';
import { Sparkles } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface TrendChartData {
  month: string;
  truthful: number;
  misleading: number;
  false: number;
  unverifiable: number;
  total: number;
  truthRate: number;
  Truthful: number;
  Misleading: number;
  False: number;
  Unverifiable: number;
}

interface DashTrendChartProps {
  data: TrendChartData[];
  viewMode: 'trend' | 'breakdown';
}

const DashTrendChart = ({ data, viewMode }: DashTrendChartProps) => {
  const { colors, isDark } = useLayoutTheme();

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
                {payload[0].payload.truthful}/{payload[0].payload.total} statements truthful
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
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="truthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
                />
                <XAxis 
                  dataKey="month" 
                  stroke={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}
                  fontSize={12}
                />
                <YAxis 
                  stroke={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="truthRate"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fill="url(#truthGradient)"
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
              <BarChart data={data}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
                />
                <XAxis 
                  dataKey="month" 
                  stroke={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}
                  fontSize={12}
                />
                <YAxis 
                  stroke={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Truthful" stackId="a" fill="#22c55e" />
                <Bar dataKey="Misleading" stackId="a" fill="#f59e0b" />
                <Bar dataKey="False" stackId="a" fill="#ef4444" />
                <Bar dataKey="Unverifiable" stackId="a" fill="#8b5cf6" />
              </BarChart>
            </motion.div>
          )}
        </AnimatePresence>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default DashTrendChart;