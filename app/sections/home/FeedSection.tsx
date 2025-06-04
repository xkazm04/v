'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { VideoGrid } from '../feed/VideoGrid';
import { NewsGrid } from '../news/NewsGrid';
import { AdvancedFilters } from '@/app/components/filters/AdvancedFilters';
import { CategoryFilter } from './CategoryFilter';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { Search, Filter, TrendingUp, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/app/lib/utils';

interface FilterState {
  category: string;
  country: string;
  status: string;
  source: string;
  dateRange: {
    from: string | null;
    to: string | null;
  };
}

interface FeedSectionProps {
  className?: string;
}

export function FeedSection({ className }: FeedSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'videos' | 'news'>('all');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    country: 'all',
    status: 'all',
    source: 'all',
    dateRange: { from: null, to: null }
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Convert our filter state to API parameters
  const videoFilters = useMemo(() => {
    const apiFilters: any = {};
    
    if (filters.category !== 'all') {
      apiFilters.categories = filters.category.toUpperCase();
    }
    if (filters.source !== 'all') {
      apiFilters.source = filters.source;
    }
    if (searchQuery) {
      apiFilters.search = searchQuery;
    }
    
    return apiFilters;
  }, [filters, searchQuery]);

  const newsFilters = useMemo(() => {
    const apiFilters: any = {};
    
    if (filters.category !== 'all') {
      apiFilters.category = filters.category;
    }
    if (filters.country !== 'all') {
      apiFilters.country = filters.country;
    }
    if (filters.status !== 'all') {
      apiFilters.status = filters.status;
    }
    if (filters.source !== 'all') {
      apiFilters.source = filters.source;
    }
    if (filters.dateRange.from) {
      apiFilters.date_from = filters.dateRange.from;
    }
    if (filters.dateRange.to) {
      apiFilters.date_to = filters.dateRange.to;
    }
    if (searchQuery) {
      apiFilters.search = searchQuery;
    }
    
    return apiFilters;
  }, [filters, searchQuery]);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setFilters(prev => ({ ...prev, category }));
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.country !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.source !== 'all') count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (searchQuery) count++;
    return count;
  }, [filters, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className={cn('space-y-6', className)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fact-Check Feed</h1>
            <p className="text-muted-foreground">
              Discover fact-checked news and videos from verified sources
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Live updates</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Updated 2 min ago</span>
            </div>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        {/* Category Filter - Top Level */}
        <CategoryFilter
          selectedCategory={filters.category}
          onCategoryChange={handleCategoryChange}
          showCounts={true}
          className="w-full"
        />
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with Advanced Filters */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <AdvancedFilters
              onFiltersChange={handleFiltersChange}
              initialFilters={filters}
              showForNewsAndVideos={true}
            />

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  Browse by Country
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending Topics
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Advanced Search
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Feed Content */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Content</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8 mt-6">
              {/* Videos Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Latest Videos</h2>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <VideoGrid 
                  filters={videoFilters}
                  layout="grid"
                  infinite={false}
                  virtualized={false}
                />
              </div>

              {/* News Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Latest News</h2>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <NewsGrid 
                  filters={newsFilters}
                  layout="grid"
                  showFilters={false}
                />
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <VideoGrid 
                filters={videoFilters}
                layout="grid"
                infinite={true}
                virtualized={true}
              />
            </TabsContent>

            <TabsContent value="news" className="mt-6">
              <NewsGrid 
                filters={newsFilters}
                layout="grid"
                showFilters={false}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}