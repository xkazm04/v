'use client';

import { memo } from 'react';
import { FixedSizeGrid as Grid, FixedSizeList } from 'react-window';
import { motion } from 'framer-motion';
import { VideoCard } from '../VideoCard';
import { Video } from '@/app/types/video_api';

interface VirtualizedListProps {
  videos: Video[];
  height: number;
  itemHeight: number;
}

interface VirtualizedGridProps {
  videos: Video[];
  columns: number;
  height: number;
  itemHeight: number;
  itemWidth: number;
}

export const VirtualizedList = memo(function VirtualizedList({
  videos,
  height,
  itemHeight
}: VirtualizedListProps) {
  const ListItem = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <motion.div 
      style={style} 
      className="px-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <VideoCard 
        video={videos[index]} 
        layout="list" 
        index={index}
        isVisible={true}
      />
    </motion.div>
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
});

export const VirtualizedGrid = memo(function VirtualizedGrid({
  videos,
  columns,
  height,
  itemHeight,
  itemWidth
}: VirtualizedGridProps) {
  const GridItem = ({ 
    columnIndex, 
    rowIndex, 
    style 
  }: { 
    columnIndex: number; 
    rowIndex: number; 
    style: React.CSSProperties 
  }) => {
    const index = rowIndex * columns + columnIndex;
    const video = videos[index];
    
    if (!video) return null;

    return (
      <motion.div 
        style={style} 
        className="p-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
      >
        <VideoCard 
          video={video} 
          layout="grid" 
          index={index}
          isVisible={true}
        />
      </motion.div>
    );
  };

  return (
    <Grid
      columnCount={columns}
      columnWidth={itemWidth}
      width={itemWidth * columns}
      height={height}
      rowCount={Math.ceil(videos.length / columns)}
      rowHeight={itemHeight}
      overscanRowCount={2}
      overscanColumnCount={1}
    >
      {GridItem}
    </Grid>
  );
});