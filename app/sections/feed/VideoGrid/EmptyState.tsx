'use client';

import { motion } from 'framer-motion';

export const EmptyState = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring" }}
      className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl mx-auto mb-6 flex items-center justify-center"
    >
      <div className="w-8 h-8 bg-slate-400 dark:bg-slate-600 rounded-lg" />
    </motion.div>
    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
      No videos found
    </h3>
    <p className="text-slate-600 dark:text-slate-400 max-w-md">
      Try adjusting your filters or check back later for new content.
    </p>
  </motion.div>
);