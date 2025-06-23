'use client';

import { memo } from 'react';
import { useFeaturedVideos } from '@/app/hooks/useVideos'; 
import { Loader2, AlertCircle, Database, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { VideoGrid } from '../feed/VideoGrid/VideoGrid';

export const FeaturedVideos = memo(function FeaturedVideos() {
  const { 
    data: response, 
    isLoading, 
    error, 
    refetch 
  } = useFeaturedVideos(6); // Request max 6 videos

  // Extract videos and metadata from response
  const videos = Array.isArray(response) ? response : (response?.videos || []);
  const metadata = response && !Array.isArray(response) ? response.__meta : null;

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
          {metadata?.source === 'none' && (
            <p className="text-sm text-red-500 mt-2">
              All video sources are currently unavailable
            </p>
          )}
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
          
          {/* Data source indicator */}
          {metadata && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              {metadata.source === 'supabase' && (
                <>
                  <Database className="w-4 h-4 text-green-600" />
                  <span>Live Data</span>
                </>
              )}
              {metadata.source === 'backend_api' && (
                <>
                  <Cloud className="w-4 h-4 text-blue-600" />
                  <span>API Data</span>
                  {metadata.fallback && <span className="text-amber-600">(Fallback)</span>}
                </>
              )}
              {metadata.fetchTime && (
                <span className="text-xs">
                  ({metadata.fetchTime}ms)
                </span>
              )}
            </div>
          )}
        </div>
        
        <VideoGrid 
          videos={videos} 
          layout="grid"
          columns={3} // 3 columns for better layout with max 6 videos
          virtualized={false}
        />
        
        {/* Show total count if available */}
        {videos.length > 0 && (
          <div className="mt-4 text-center text-sm text-slate-500">
            Showing {videos.length} featured video{videos.length === 1 ? '' : 's'}
          </div>
        )}
      </motion.div>
    </section>
  );
});