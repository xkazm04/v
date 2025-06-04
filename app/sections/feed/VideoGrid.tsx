'use client';

import { memo, useMemo, useState, useEffect } from 'react';
import { FixedSizeGrid as Grid, FixedSizeList } from 'react-window';
import { VideoCard } from './VideoCard';
import { useVideos, useInfiniteVideos } from '@/app/hooks/useVideos';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { VideoFilters } from '@/app/types/video_api';
import { Video } from '@/app/types/video_api';

interface VideoGridProps {
  columns?: 1 | 2 | 3 | 4;
  layout?: 'grid' | 'list';
  virtualized?: boolean;
  height?: number;
  filters?: VideoFilters;
  infinite?: boolean;
  videos?: Video[];
}

const VideoGrid = memo(function VideoGrid({ 
  columns = 3, 
  layout = 'grid',
  virtualized = false,
  height = 600,
  filters = {},
  infinite = false,
  videos: propVideos // Add videos prop with alias
}: VideoGridProps) {
  const [mounted, setMounted] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 1024, height: 768 });

  // Only use API hooks if no videos provided as props
  const shouldFetchFromAPI = !propVideos;

  // Use either infinite query or regular query based on props
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: infiniteRefetch
  } = useInfiniteVideos(shouldFetchFromAPI ? filters : {});

  // Determine which data to use - prioritize prop videos
  const videos: (Video)[] = propVideos || (infinite 
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

  const actualColumns = useMemo(() => {
    if (layout === 'list') return 1;
    if (!mounted) return columns;
    
    if (screenSize.width <= 640) return 1;
    if (screenSize.width <= 1024) return Math.min(columns, 2);
    return columns;
  }, [columns, layout, mounted, screenSize.width]);


  const ErrorState = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        Failed to load videos
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mb-4">
        {error?.message || 'Something went wrong while fetching videos.'}
      </p>
      <motion.button
        onClick={() => refetch()}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </motion.button>
    </motion.div>
  );

  // Empty state
  const EmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
        <div className="w-6 h-6 bg-slate-400 dark:bg-slate-600 rounded" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        No videos found
      </h3>
      <p className="text-slate-600 dark:text-slate-400">
        Try adjusting your filters or check back later.
      </p>
    </motion.div>
  );

  // Show error state
  if (error) {
    return <ErrorState />;
  }

  // Show empty state
  if (videos.length === 0) {
    return <EmptyState />;
  }

  const itemHeight = layout === 'list' ? 180 : 400;
  const itemWidth = 320;

  // Non-virtualized grid for better SEO and smaller lists
  if (!virtualized || videos.length < 20) {
    return (
      <div className="space-y-6">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4`}>
          {videos.map((video, index) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              layout={layout}
              priority={index < (actualColumns * 2)}
            />
          ))}
        </div>
        
        {/* Load more button for infinite scroll */}
        {infinite && hasNextPage && (
          <div className="text-center pt-6">
            <motion.button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Videos'
              )}
            </motion.button>
          </div>
        )}
      </div>
    );
  }

  // Virtualized implementations remain the same
  if (layout === 'list') {
    const ListItem = ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <div style={style} className="px-2">
        <VideoCard video={videos[index]} layout="list" />
      </div>
    );

    return (
      <FixedSizeList
        width={'100%'}
        height={height}
        itemCount={videos.length}
        itemSize={itemHeight}
        itemData={videos}
        overscanCount={3}
      >
        {ListItem}
      </FixedSizeList>
    );
  }

  // Virtualized grid
  const GridItem = ({ 
    columnIndex, 
    rowIndex, 
    style 
  }: { 
    columnIndex: number; 
    rowIndex: number; 
    style: React.CSSProperties 
  }) => {
    const index = rowIndex * actualColumns + columnIndex;
    const video = videos[index];
    
    if (!video) return null;

    return (
      <div style={style} className="p-2">
        <VideoCard video={video} layout="grid" />
      </div>
    );
  };

  return (
    <Grid
      columnCount={actualColumns}
      columnWidth={itemWidth}
      width={itemWidth * actualColumns}
      height={height}
      rowCount={Math.ceil(videos.length / actualColumns)}
      rowHeight={itemHeight}
      overscanRowCount={2}
      overscanColumnCount={1}
    >
      {GridItem}
    </Grid>
  );
});

export { VideoGrid };