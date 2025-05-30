'use client';

import { useState } from 'react';
import { ScrollArea, ScrollBar } from '@/app/components/ui/scroll-area';
import { Button } from '@/app/components/ui/button';
import { VIDEO_CATEGORIES } from '@/app/constants/videos';
import { cn } from '@/app/lib/utils';

export function CategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  return (
    <div className="py-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 px-4">
          {VIDEO_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant="outline"
              className={cn(
                "rounded-full text-sm h-9",
                selectedCategory === category 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-muted hover:bg-secondary"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}