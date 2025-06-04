'use client';

import { useState } from 'react';
import { Sidebar } from '@/app/components/sidebar/sidebar';
import { FeaturedVideos } from '@/app/sections/home/FeaturedVideos';
import { CategoryFilter } from '@/app/sections/home/CategoryFilter';
import { Divider } from './components/ui/divider';
import FeaturedNews from './sections/home/FeaturedNews';
import FeedHeader from './sections/feed/FeedHeader';
import { useCategoryCounts } from '@/app/hooks/useNews';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { data: categoryCounts, isLoading: countsLoading } = useCategoryCounts();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex relative">
      <Sidebar />
      <div className="flex-1 p-4 relative">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          showCounts={true}
          counts={categoryCounts || {}}
        />
        <FeedHeader />
        <FeaturedVideos />
        <Divider />
        <FeaturedNews selectedCategory={selectedCategory} />
      </div>
    </div>
  );
}