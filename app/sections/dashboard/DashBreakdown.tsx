'use client';

import { motion } from 'framer-motion';
import { Speaker } from '@/app/constants/speakers';
import { Hash, TrendingUp } from 'lucide-react';

interface TopicBreakdownProps {
  speaker: Speaker;
}

const DashBreakdown = ({ speaker }: TopicBreakdownProps) => {
  const maxCount = Math.max(...speaker.topicBreakdown.map(topic => topic.count));
  const totalStatements = speaker.topicBreakdown.reduce((sum, topic) => sum + topic.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950/30 border border-border rounded-2xl p-8 shadow-lg overflow-hidden"
    >
      {/* Geometric accent */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="w-full h-full border-8 border-primary rotate-45 transform translate-x-16 -translate-y-16 rounded-3xl" />
      </div>
      
      <div className="relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Hash className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                Topic Breakdown
              </h3>
              <p className="text-sm text-muted-foreground">
                {totalStatements} statements across {speaker.topicBreakdown.length} categories
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {speaker.topicBreakdown.map((topic, index) => (
            <motion.div
              key={topic.topic}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="group relative"
            >
              {/* Topic Header with Creative Typography */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: topic.color }}
                  />
                  <h4 className="text-lg font-bold text-foreground tracking-wide uppercase text-shadow">
                    {topic.topic}
                  </h4>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-mono text-muted-foreground">
                      {topic.count} statements
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((topic.count / totalStatements) * 100)}% of total
                    </div>
                  </div>
                  
                  <div 
                    className="px-4 py-2 rounded-full font-bold text-sm shadow-sm border-2 transition-all duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: `${topic.color}15`,
                      borderColor: `${topic.color}40`,
                      color: topic.color,
                    }}
                  >
                    {topic.truthRate}% TRUE
                  </div>
                </div>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="relative">
                <div className="h-6 bg-secondary/50 rounded-full overflow-hidden border border-border/50 shadow-inner">
                  {/* Background pattern */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 2px,
                        currentColor 2px,
                        currentColor 4px
                      )`
                    }}
                  />
                  
                  {/* Progress fill */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(topic.count / maxCount) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                    className="relative h-full rounded-full shadow-sm"
                    style={{ 
                      background: `linear-gradient(90deg, ${topic.color}60, ${topic.color}90)`,
                    }}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
                  </motion.div>
                </div>
                
                {/* Statement count overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-foreground mix-blend-difference">
                    {topic.count}
                  </span>
                </div>
              </div>

              {/* Truth rate visualization */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${topic.truthRate}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: topic.color }}
                  />
                </div>
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-6 border-t border-border/50"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {speaker.topicBreakdown.length}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Categories
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {Math.round(speaker.topicBreakdown.reduce((sum, topic) => sum + topic.truthRate, 0) / speaker.topicBreakdown.length)}%
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Avg Truth Rate
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {Math.max(...speaker.topicBreakdown.map(t => t.truthRate))}%
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Highest Rate
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .text-shadow {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </motion.div>
  );
};

export default DashBreakdown;