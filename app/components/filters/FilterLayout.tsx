'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/app/components/ui/skeleton';
import { CategoryFilter } from '@/app/sections/feed/Filter/CategoryFilter';

interface FilterLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

function FilterSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export function FilterLayout({ children, className }: FilterLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 ${className}`}
    >
      <Suspense fallback={<FilterSkeleton />}>
        <CategoryFilter
          showCounts={true}
          selectedCategories={[]}
          allowMultiSelect={false}
          onSelectionChange={() => {}}
        />
      </Suspense>
      {children}
    </motion.div>
  );
}