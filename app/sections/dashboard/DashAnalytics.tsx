'use client';

import { motion } from 'framer-motion';
import { Speaker } from '@/app/constants/speakers';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StatementAnalyticsProps {
  speaker: Speaker;
  timeRange: string;
}

const DashAnalytics = ({ speaker }: StatementAnalyticsProps) => {
  const data = [
    {
      name: 'Truthful',
      value: speaker.stats.truthfulStatements,
      color: 'hsl(var(--verified))',
      percentage: Math.round((speaker.stats.truthfulStatements / speaker.totalStatements) * 100),
    },
    {
      name: 'Misleading',
      value: speaker.stats.misleadingStatements,
      color: 'hsl(var(--unverified))',
      percentage: Math.round((speaker.stats.misleadingStatements / speaker.totalStatements) * 100),
    },
    {
      name: 'False',
      value: speaker.stats.falseStatements,
      color: 'hsl(var(--false))',
      percentage: Math.round((speaker.stats.falseStatements / speaker.totalStatements) * 100),
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} statements ({data.percentage}%)
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
        <h3 className="text-lg font-semibold text-foreground">Statement Analysis</h3>
        <div className="text-sm text-muted-foreground">
          {speaker.stats.averageConfidence}% avg confidence
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <div
              className="w-4 h-4 rounded-full mx-auto mb-2"
              style={{ backgroundColor: item.color }}
            />
            <div className="text-lg font-bold text-foreground">{item.percentage}%</div>
            <div className="text-xs text-muted-foreground">{item.name}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default DashAnalytics;