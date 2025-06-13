'use client';

import { memo } from 'react';
import { VideoGrid } from '../feed/VideoGrid';
import { useVideos } from '@/app/hooks/useVideos';
import { Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const FeaturedVideos = memo(function FeaturedVideos() {
  const { 
    data: videos, 
    isLoading, 
    error, 
    refetch 
  } = useVideos({ 
    limit: 4,
    researched: true,
    sort_by: 'processed_at',
    sort_order: 'desc'
  });

  // Loading state
  if (isLoading) {
    return (
      <section className="py-6 relative">
        <h2 className="text-2xl font-bold mb-6">Featured Videos</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-slate-600 dark:text-slate-400">Loading featured videos...</span>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-6 relative">
        <h2 className="text-2xl font-bold mb-6">Featured Videos</h2>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Failed to load featured videos
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <motion.button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </section>
    );
  }

  // Don't render if no videos
  if (!videos || videos.length === 0) {
    return (
      <section className="py-6 relative">
        <h2 className="text-2xl font-bold mb-6">Featured Videos</h2>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <p className="text-slate-600 dark:text-slate-400">
            No featured videos available at the moment.
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Videos</h2>
        </div>
        <VideoGrid 
          videos={videos} 
          layout="grid"
          columns={4}
          virtualized={false}
        />
      </motion.div>
    </section>
  );
});