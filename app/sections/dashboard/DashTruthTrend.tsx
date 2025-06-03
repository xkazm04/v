'use client';

import { motion } from 'framer-motion';
import { Speaker } from '@/app/constants/speakers';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Bar, BarChart, ComposedChart, Line } from 'recharts';
import { TrendingUp, BarChart3, LineChart } from 'lucide-react';
import { useState } from 'react';

interface TruthTrendChartProps {
  speaker: Speaker;
  timeRange: string;
}

const DashTruthTrend = ({ speaker }: TruthTrendChartProps) => {
  const [viewMode, setViewMode] = useState<'trend' | 'breakdown'>('trend');

  const data = speaker.monthlyData.map(item => ({
    ...item,
    truthRate: Math.round((item.truthful / item.total) * 100),
    Truthful: item.truthful,
    Misleading: item.misleading,
    False: item.false,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {viewMode === 'trend' ? (
            <>
              <p className="text-sm text-green-600 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600" />
                Truth Rate: {payload[0].value}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {payload[0].payload.truthful}/{payload[0].payload.total} statements
              </p>
            </>
          ) : (
            payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.dataKey}: {entry.value}
              </p>
            ))
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-card via-card to-card/50 border border-border rounded-2xl p-6 shadow-lg overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Statement Analysis
            </h3>
            <p className="text-sm text-muted-foreground">
              {viewMode === 'trend' ? 'Truth rate trends over time' : 'Statement breakdown by type'}
            </p>
          </div>
          
          <div className="flex bg-secondary/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('trend')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                viewMode === 'trend'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LineChart className="h-4 w-4" />
              Trend
            </button>
            <button
              onClick={() => setViewMode('breakdown')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                viewMode === 'breakdown'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Breakdown
            </button>
          </div>
        </div>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'trend' ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="truthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--verified))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--verified))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="truthRate"
                  stroke="hsl(var(--verified))"
                  strokeWidth={3}
                  fill="url(#truthGradient)"
                  dot={{ fill: 'hsl(var(--verified))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--verified))', strokeWidth: 2 }}
                />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Truthful" stackId="a" fill="hsl(var(--verified))" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Misleading" stackId="a" fill="hsl(var(--unverified))" radius={[0, 0, 0, 0]} />
                <Bar dataKey="False" stackId="a" fill="hsl(var(--false))" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-8 text-sm bg-secondary/30 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-verified shadow-sm" />
            <span className="text-muted-foreground">Truthful</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-unverified shadow-sm" />
            <span className="text-muted-foreground">Misleading</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-false shadow-sm" />
            <span className="text-muted-foreground">False</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashTruthTrend;