'use client';

import { motion } from 'framer-motion';
import { Speaker } from '@/app/constants/speakers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FactCheckHistoryProps {
  speaker: Speaker;
}

const DashHistory = ({ speaker }: FactCheckHistoryProps) => {
  const data = speaker.monthlyData.map(item => ({
    month: item.month,
    Truthful: item.truthful,
    Misleading: item.misleading,
    False: item.false,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
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
      <h3 className="text-lg font-semibold text-foreground mb-6">Monthly History</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Truthful" stackId="a" fill="hsl(var(--verified))" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Misleading" stackId="a" fill="hsl(var(--unverified))" radius={[0, 0, 0, 0]} />
            <Bar dataKey="False" stackId="a" fill="hsl(var(--false))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-verified" />
          <span className="text-muted-foreground">Truthful</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-unverified" />
          <span className="text-muted-foreground">Misleading</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-false" />
          <span className="text-muted-foreground">False</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DashHistory;