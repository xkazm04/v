'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { 
  Clock, 
  ExternalLink, 
  MapPin, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  HelpCircle,
  Eye
} from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { useSearchResearch } from '@/app/hooks/useNews';
import { LoadingScreen } from '@/app/components/layout/LoadingScreen';

interface NewsGridProps {
  filters?: any;
  layout?: 'grid' | 'list';
  showFilters?: boolean;
  className?: string;
}

// Status icon mapping
const getStatusIcon = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'TRUE':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'FALSE':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'MISLEADING':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    default:
      return <HelpCircle className="h-4 w-4 text-gray-600" />;
  }
};

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'TRUE':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    case 'FALSE':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    case 'MISLEADING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  }
};

const NewsCard = ({ item, layout = 'grid' }: { item: any; layout: 'grid' | 'list' }) => {
  const isListLayout = layout === 'list';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className={cn(
        'h-full transition-all duration-200 hover:shadow-lg cursor-pointer',
        isListLayout ? 'flex flex-row' : 'flex flex-col'
      )}>
        <CardHeader className={cn(
          'pb-3',
          isListLayout ? 'flex-1' : ''
        )}>
          <div className="space-y-3">
            {/* Status and Category */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="secondary" 
                className={cn('flex items-center gap-1', getStatusColor(item.status))}
              >
                {getStatusIcon(item.status)}
                <span className="text-xs font-medium">
                  {item.status || 'Unverified'}
                </span>
              </Badge>
              
              {item.category && (
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
              )}
            </div>

            {/* Statement */}
            <h3 className={cn(
              'font-semibold leading-tight',
              isListLayout ? 'text-base' : 'text-lg'
            )}>
              {item.statement || 'No statement available'}
            </h3>

            {/* Context preview */}
            {item.context && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.context}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className={cn(
          'pt-0',
          isListLayout ? 'flex-shrink-0 w-64' : ''
        )}>
          <div className="space-y-3">
            {/* Source info */}
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`https://www.google.com/s2/favicons?domain=${item.source || 'example.com'}&sz=64`} />
                <AvatarFallback className="text-xs">
                  {(item.source || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium truncate">
                {item.source || 'Unknown Source'}
              </span>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {item.statement_date && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(item.statement_date).toLocaleDateString()}</span>
                </div>
              )}
              
              {item.country && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{item.country}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 px-3"
              >
                <Eye className="h-3 w-3 mr-1" />
                View Details
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 px-2"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export function NewsGrid({ 
  filters = {}, 
  layout = 'grid', 
  showFilters = true,
  className 
}: NewsGridProps) {
  const [currentLayout, setCurrentLayout] = useState(layout);

  // Use the search hook with all the filters
  const { 
    data: newsData, 
    isLoading, 
    error,
    refetch 
  } = useSearchResearch(
    filters.search,
    filters.status,
    filters.country,
    filters.category,
    filters.source,
    50, // limit
    0   // offset
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Failed to load news</h3>
          <p className="text-muted-foreground">There was an error loading the news data.</p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  // Ensure newsData is an array
  const newsItems = Array.isArray(newsData) ? newsData : [];

  if (newsItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No news found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search terms.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Layout Controls */}
      {showFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>{newsItems.length} news items found</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={currentLayout === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentLayout('grid')}
            >
              Grid
            </Button>
            <Button
              variant={currentLayout === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentLayout('list')}
            >
              List
            </Button>
          </div>
        </div>
      )}

      {/* News Grid */}
      <div className={cn(
        'gap-6',
        currentLayout === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'space-y-4'
      )}>
        <AnimatePresence>
          {newsItems.map((item: any, index: number) => (
            <NewsCard 
              key={item.id || index} 
              item={item} 
              layout={currentLayout}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}