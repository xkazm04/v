'use client';

import { motion } from 'framer-motion';
import { Speaker } from '@/app/constants/speakers';
import { Hash, TrendingUp, BarChart3 } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface TopicBreakdownProps {
  speaker: Speaker;
}

const DashBreakdown = ({ speaker }: TopicBreakdownProps) => {
  const { colors, isDark } = useLayoutTheme();
  const maxCount = Math.max(...speaker.topicBreakdown.map(topic => topic.count));
  const totalStatements = speaker.topicBreakdown.reduce((sum, topic) => sum + topic.count, 0);

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
              <h3 className="text-lg font-bold text-foreground">Topic Distribution</h3>
              <p className="text-xs text-muted-foreground">
                {totalStatements} statements • {speaker.topicBreakdown.length} topics
              </p>
            </div>
          </div>
          
          {/* Quick stats pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-xs font-bold text-green-400">
              {Math.round(speaker.topicBreakdown.reduce((sum, topic) => sum + topic.truthRate, 0) / speaker.topicBreakdown.length)}% avg
            </span>
          </div>
        </div>
        
        {/* Compact topic list with enhanced progress bars */}
        <div className="space-y-4">
          {speaker.topicBreakdown.map((topic, index) => (
            <motion.div
              key={topic.topic}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {/* Topic row */}
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm flex-shrink-0"
                  style={{ backgroundColor: topic.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {topic.topic}
                    </span>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-xs text-muted-foreground">
                        {topic.count} statements
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced progress bar with background pattern and overlay */}
              <div className="relative ml-6">
                <div className="relative h-8 rounded-lg overflow-hidden"
                  style={{ 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Background diagonal pattern */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 4px,
                        ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 4px,
                        ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 8px
                      )`
                    }}
                  />
                  
                  {/* Progress fill */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${topic.truthRate}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                    className="relative h-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${topic.color}, ${topic.color}dd)`,
                    }}
                  >
                    {/* Animated shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatDelay: 3,
                        ease: "easeInOut" 
                      }}
                    />
                  </motion.div>
                  
                  {/* Overlay value in the center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white drop-shadow-lg">
                      {topic.truthRate}%
                    </span>
                  </div>
                </div>
                
                {/* Count indicator bar */}
                <div className="mt-2 h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(topic.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: `${topic.color}80` }}
                  />
                </div>
              </div>
            </motion.div>
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
                {speaker.topicBreakdown.length}
              </div>
              <div className="text-xs text-muted-foreground">Topics</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-green-400">
                {Math.round(speaker.topicBreakdown.reduce((sum, topic) => sum + topic.truthRate, 0) / speaker.topicBreakdown.length)}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Truth</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-blue-400">
                {Math.max(...speaker.topicBreakdown.map(t => t.count))}
              </div>
              <div className="text-xs text-muted-foreground">Max Count</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashBreakdown;