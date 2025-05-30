'use client';

import { motion } from 'framer-motion';
import { Speaker } from '@/app/constants/speakers';

interface TopicBreakdownProps {
  speaker: Speaker;
}

const DashBreakdown = ({ speaker }: TopicBreakdownProps) => {
  const maxCount = Math.max(...speaker.topicBreakdown.map(topic => topic.count));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Topic Breakdown</h3>
      
      <div className="space-y-4">
        {speaker.topicBreakdown.map((topic, index) => (
          <motion.div
            key={topic.topic}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">{topic.topic}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {topic.count} statements
                </span>
                <span
                  className="text-sm font-medium px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${topic.color}20`,
                    color: topic.color,
                  }}
                >
                  {topic.truthRate}% true
                </span>
              </div>
            </div>
            
            <div className="relative h-2 bg-background rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(topic.count / maxCount) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: topic.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DashBreakdown;