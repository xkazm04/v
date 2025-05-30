'use client';

import { motion } from 'framer-motion';
import { Speaker } from '@/app/constants/speakers';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface TruthTrendChartProps {
  speaker: Speaker;
  timeRange: string;
}

const DashTruthTrend = ({ speaker }: TruthTrendChartProps) => {
  const data = speaker.monthlyData.map(item => ({
    ...item,
    truthRate: Math.round((item.truthful / item.total) * 100),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-green-600">
            Truth Rate: {payload[0].value}%
          </p>
          <p className="text-xs text-muted-foreground">
            {payload[0].payload.truthful}/{payload[0].payload.total} statements
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Truth Rate Trend</h3>
        <div className="text-sm text-muted-foreground">
          Last 6 months
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="truthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--verified))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--verified))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="truthRate"
              stroke="hsl(var(--verified))"
              strokeWidth={3}
              fill="url(#truthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DashTruthTrend;