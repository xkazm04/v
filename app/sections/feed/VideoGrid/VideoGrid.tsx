'use client';

import { memo, useMemo, useState, useEffect, useRef } from 'react';
import { VideoCard } from '../VideoCard';
import { useVideos, useInfiniteVideos } from '@/app/hooks/useVideos';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { VideoFilters } from '@/app/types/video_api';
import { Video } from '@/app/types/video_api';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { VirtualizedGrid, VirtualizedList } from './VirtualizedComponents';

interface VideoGridProps {
  columns?: 1 | 2 | 3 | 4;
  layout?: 'grid' | 'list';
  virtualized?: boolean;
  height?: number;
  filters?: VideoFilters;
  infinite?: boolean;
  videos?: Video[];
}

const containerVariants = {
  hidden: { 
    opacity: 1 // Start visible to prevent blinking
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1,
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const VideoGrid = memo(function VideoGrid({ 
  columns = 3, 
  layout = 'grid',
  virtualized = false,
  height = 600,
  filters = {},
  infinite = false,
  videos: propVideos
}: VideoGridProps) {
  const [mounted, setMounted] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 1024, height: 768 });
  const [loadedCount, setLoadedCount] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, amount: 0.1 });

  // Only use API hooks if no videos provided as props
  const shouldFetchFromAPI = !propVideos;

  const {
    data: regularData,
    isLoading: regularLoading,
    error: regularError,
    refetch: regularRefetch
  } = useVideos(shouldFetchFromAPI ? filters : {});

  const {
    data: infiniteData,
    isLoading: infiniteLoading,
    error: infiniteError,
    refetch: infiniteRefetch
  } = useInfiniteVideos(shouldFetchFromAPI ? filters : {});

  // Determine which data to use - prioritize prop videos
  const videos: Video[] = propVideos || (infinite 
    ? (infiniteData?.pages.flat() as Video[]) || []
    : (regularData as Video[]) || []);
  
  const isLoading = shouldFetchFromAPI ? (infinite ? infiniteLoading : regularLoading) : false;
  const error = shouldFetchFromAPI ? (infinite ? infiniteError : regularError) : null;
  const refetch = shouldFetchFromAPI ? (infinite ? infiniteRefetch : regularRefetch) : () => {};

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
      
      const handleResize = () => {
        setScreenSize({ width: window.innerWidth, height: window.innerHeight });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Fixed progressive loading effect - much faster
  useEffect(() => {
    if (!isInView || videos.length === 0) return;

    // Show first card immediately
    setLoadedCount(1);

    // Then stagger the rest quickly
    const timer = setInterval(() => {
      setLoadedCount(prev => {
        if (prev >= videos.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 150); 

    return () => clearInterval(timer);
  }, [isInView, videos.length]);

  // Reset loaded count when videos change
  useEffect(() => {
    setLoadedCount(0);
  }, [videos]);

  const actualColumns = useMemo(() => {
    if (layout === 'list') return 1;
    
    if (screenSize.width <= 640) return 1;
    if (screenSize.width <= 1024) return Math.min(columns, 2);
    return columns;
  }, [columns, layout, mounted, screenSize.width]);

  // Calculate minimum heights to prevent layout shifts
  const cardHeight = layout === 'grid' ? 400 : 180;
  const minRows = Math.ceil(videos.length / actualColumns);
  const containerMinHeight = Math.max(cardHeight * Math.min(minRows, 3), 600);

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  // Show empty state (but not while loading)
  if (!isLoading && videos.length === 0) {
    return <EmptyState />;
  }

  // Virtualized implementations
  if (virtualized && videos.length >= 20) {
    if (layout === 'list') {
      return (
        <VirtualizedList 
          videos={videos}
          height={height}
          itemHeight={180}
        />
      );
    }

    return (
      <VirtualizedGrid
        videos={videos}
        columns={actualColumns}
        height={height}
        itemHeight={cardHeight}
        itemWidth={320}
      />
    );
  }

  // Non-virtualized grid with staggered animations
  return (
    <div 
      ref={gridRef} 
      className="space-y-6"
      style={{ minHeight: `${containerMinHeight}px` }}
    >
      {/* Reserve space container - prevents jumping */}
      <motion.div 
        className={`grid gap-4 max-w-[1800px] ${
          layout === 'list' 
            ? 'grid-cols-1' 
            : 'grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3'
        }`}
        style={{ 
          minHeight: `${containerMinHeight}px`,
          position: 'relative'
        }}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Show simple loading indicator only for the first load */}
        {isLoading && videos.length === 0 && (
          <motion.div 
            className="col-span-full flex items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Loading videos...</p>
            </div>
          </motion.div>
        )}

        {/* Actual video cards */}
        <AnimatePresence mode="popLayout">
          {videos.slice(0, loadedCount).map((video, index) => (
            <VideoCard 
              key={`${video.id}-${index}`}
              video={video} 
              layout={layout}
              priority={index < (actualColumns * 2)}
              index={index}
              isVisible={index < loadedCount}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});

export { VideoGrid };