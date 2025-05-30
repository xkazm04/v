'use client';

import { motion } from 'framer-motion';
import { Speaker } from '@/app/constants/speakers';
import { getEvaluationIcon, getEvaluationColor } from '@/app/helpers/factCheck';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  speaker: Speaker;
}

const DashActivity = ({ speaker }: RecentActivityProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h3>
      
      <div className="space-y-4">
        {speaker.recentStatements.map((statement, index) => (
          <motion.div
            key={statement.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-border/50 rounded-lg p-4 hover:bg-background/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 mt-1">
                {getEvaluationIcon(statement.evaluation, 'sm')}
                <span className={`text-xs font-medium ${getEvaluationColor(statement.evaluation)}`}>
                  {statement.evaluation}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                  "{statement.content}"
                </p>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{statement.topic}</span>
                    <span>{statement.sources} sources</span>
                    <span>{statement.confidence}% confidence</span>
                  </div>
                  
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(statement.date), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
        View All Statements →
      </button>
    </motion.div>
  );
};

export default DashActivity;