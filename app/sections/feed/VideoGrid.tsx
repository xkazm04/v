'use client';

import { VideoMetadata } from '@/app/types/video';
import { memo, useMemo, useState, useEffect } from 'react';
import { FixedSizeGrid as Grid, FixedSizeList } from 'react-window';
import { VideoCard } from './VideoCard';

interface VideoGridProps {
  videos: VideoMetadata[];
  columns?: 1 | 2 | 3 | 4;
  layout?: 'grid' | 'list';
  virtualized?: boolean;
  height?: number;
}

const VideoGrid = memo(function VideoGrid({ 
  videos, 
  columns = 3, 
  layout = 'grid',
  virtualized = false,
  height = 600
}: VideoGridProps) {
  const [mounted, setMounted] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 1024, height: 768 });

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
    if (!mounted) return columns; // Return default during SSR
    
    if (screenSize.width <= 640) return 1;
    if (screenSize.width <= 1024) return Math.min(columns, 2);
    return columns;
  }, [columns, layout, mounted, screenSize.width]);

  const itemHeight = layout === 'list' ? 180 : 280;
  const itemWidth = 320;

  const getGridCols = () => {
    switch (actualColumns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    }
  };

  // Show loading skeleton during initial mount to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={`grid ${getGridCols()} gap-4 md:gap-6`}>
        {videos.slice(0, 6).map((video) => (
          <div key={video.id} className="animate-pulse">
            <div className="aspect-video bg-gray-800 rounded-lg mb-3" />
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-gray-800 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-800 rounded" />
                <div className="h-3 bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-800 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Non-virtualized grid for better SEO and smaller lists
  if (!virtualized || videos.length < 20) {
    return (
      <div className={`grid ${getGridCols()} gap-4 md:gap-6`}>
        {videos.map((video, index) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            layout={layout}
            priority={index < (actualColumns * 2)}
          />
        ))}
      </div>
    );
  }

  // Virtualized for large lists
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