'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring" }}
    >
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
    </motion.div>
    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
      Failed to load videos
    </h3>
    <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md">
      {error?.message || 'Something went wrong while fetching videos.'}
    </p>
    <motion.button
      onClick={onRetry}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <RefreshCw className="w-4 h-4" />
      Try Again
    </motion.button>
  </motion.div>
);