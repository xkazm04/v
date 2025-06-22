'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslationProgress, useTranslationStats, useTranslationStore } from '@/app/stores/useTranslationStore';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useState } from 'react';
import { X, Languages, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

export function TranslationProgressIndicator() {
  const { colors } = useLayoutTheme();
  const progress = useTranslationProgress();
  const stats = useTranslationStats();
  const { activeTasks, hideIndicator, clearCompletedTasks } = useTranslationStore();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!progress.isVisible) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'cached':
        return <Zap className="w-3 h-3 text-blue-500" />;
      case 'failed':
        return <XCircle className="w-3 h-3 text-red-500" />;
      case 'translating':
        return (
          <motion.div
            className="w-3 h-3 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        );
      default:
        return <Clock className="w-3 h-3 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'cached': return 'text-blue-600 dark:text-blue-400';
      case 'failed': return 'text-red-600 dark:text-red-400';
      case 'translating': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-4 z-[9999] max-w-md"
      >
        <motion.div
          className="backdrop-blur-md border rounded-xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: colors.background + 'f0',
            borderColor: colors.border,
            boxShadow: `0 20px 40px ${colors.primary}20`
          }}
          layout
        >
          {/* Header */}
          <motion.div
            className="px-4 py-3 border-b cursor-pointer"
            style={{ borderColor: colors.border }}
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ backgroundColor: colors.accent + '20' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: progress.isTranslating ? [0, 360] : 0 }}
                  transition={{ duration: 2, repeat: progress.isTranslating ? Infinity : 0, ease: "linear" }}
                >
                  <Languages className="w-5 h-5" style={{ color: colors.primary }} />
                </motion.div>
                
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: colors.foreground }}>
                    Translation Progress
                  </h3>
                  <p className="text-xs" style={{ color: colors.mutedForeground }}>
                    {progress.isTranslating 
                      ? `${progress.activeCount} translating...`
                      : `${progress.completedCount} completed`
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Progress Circle */}
                <div className="relative w-8 h-8">
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke={colors.border}
                      strokeWidth="2"
                      fill="none"
                    />
                    <motion.circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke={colors.primary}
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: progress.progress / 100 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      style={{
                        strokeDasharray: "87.96",
                        strokeDashoffset: `${87.96 * (1 - progress.progress / 100)}`
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium" style={{ color: colors.primary }}>
                      {progress.progress}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    hideIndicator();
                  }}
                  className="p-1 rounded-md hover:bg-opacity-20"
                  style={{ color: colors.mutedForeground }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="px-4 py-2">
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: colors.accent + '40' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: colors.primary }}
                initial={{ width: 0 }}
                animate={{ width: `${progress.progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Expanded Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="border-t"
                style={{ borderColor: colors.border }}
              >
                {/* Stats */}
                <div className="px-4 py-3 grid grid-cols-2 gap-3 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      {stats.completedTasks + stats.cachedTasks}
                    </div>
                    <div style={{ color: colors.mutedForeground }}>Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-600 dark:text-red-400">
                      {stats.failedTasks}
                    </div>
                    <div style={{ color: colors.mutedForeground }}>Failed</div>
                  </div>
                </div>

                {/* Task List */}
                <div className="max-h-48 overflow-y-auto">
                  {activeTasks.slice(0, 8).map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="px-4 py-2 border-t flex items-center gap-3"
                      style={{ borderColor: colors.border + '50' }}
                    >
                      {getStatusIcon(task.status)}
                      
                      <div className="flex-1 min-w-0">
                        <div 
                          className={`text-xs font-medium truncate ${getStatusColor(task.status)}`}
                        >
                          {task.context && (
                            <span className="capitalize mr-2">
                              [{task.context}]
                            </span>
                          )}
                          {task.text}
                        </div>
                        <div className="text-xs" style={{ color: colors.mutedForeground }}>
                          {task.sourceLocale.toUpperCase()} → {task.targetLocale.toUpperCase()}
                          {task.endTime && (
                            <span className="ml-2">
                              ({Math.round((task.endTime - task.startTime) / 1000)}s)
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Actions */}
                <div className="px-4 py-3 border-t" style={{ borderColor: colors.border }}>
                  <button
                    onClick={clearCompletedTasks}
                    className="text-xs px-3 py-1 rounded-md hover:bg-opacity-20"
                    style={{ 
                      color: colors.primary,
                      backgroundColor: colors.primary + '20'
                    }}
                  >
                    Clear Completed
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}