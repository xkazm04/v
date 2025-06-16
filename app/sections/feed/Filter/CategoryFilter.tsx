'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useFilterStore, useSelectedCategories } from '@/app/stores/filterStore';
import Categories from './Categories';

interface CategoryFilterProps {
  className?: string;
  maxVisible?: number;
  showCounts?: boolean;
  allowMultiSelect?: boolean;
  isLoading?: boolean;
}

export function CategoryFilter({ 
  className,
  showCounts = true,
  allowMultiSelect = true,
}: CategoryFilterProps) {
  const { colors, isDark } = useLayoutTheme();
  
  // Get filter state from Zustand store
  const selectedCategories = useSelectedCategories();
  const { setSelectedCategories, toggleCategory } = useFilterStore();
  

  const handleCategoryClick = useCallback((categoryId: string) => {
    if (allowMultiSelect) {
      toggleCategory(categoryId);
    } else {
      // Single select mode
      const newSelection = selectedCategories.includes(categoryId) ? [] : [categoryId];
      setSelectedCategories(newSelection);
    }
  }, [selectedCategories, allowMultiSelect, toggleCategory, setSelectedCategories]);

  const containerStyles = {
    background: isDark
      ? `linear-gradient(135deg, 
          rgba(15, 23, 42, 0.8) 0%,
          rgba(30, 41, 59, 0.6) 100%
        )`
      : `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.9) 0%,
          rgba(248, 250, 252, 0.8) 100%
        )`,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid ${isDark ? 'rgba(71, 85, 105, 0.2)' : 'rgba(226, 232, 240, 0.4)'}`,
    borderRadius: '1rem',
    boxShadow: isDark
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)'
  };

  return (
    <motion.div 
      className={cn("p-4 space-y-4", className)}
      style={containerStyles}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >


      {/* Categories */}
      {/* <Categories
        categoryCounts={categoryCounts || {}}
        selectedCategories={selectedCategories}
        handleCategoryClick={handleCategoryClick}
        hasCountsError={hasCountsError}
        showCounts={showCounts && !countsLoading && !hasCountsError}
        countsLoading={countsLoading}
        pendingSelection={null}
      /> */}
    </motion.div>
  );
}