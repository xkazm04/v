'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/app/components/ui/badge';
import { VIDEO_CATEGORIES } from '@/app/constants/videos';
import { cn } from '@/app/lib/utils';

export function CategoryList() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  return (
    <div className="flex flex-col gap-2 px-3">
      {VIDEO_CATEGORIES.map((category) => (
        <Link 
          key={category} 
          href={`/category/${category.toLowerCase()}`}
          onClick={() => setSelectedCategory(category)}
        >
          <Badge 
            variant="outline" 
            className={cn(
              "cursor-pointer w-full justify-start",
              selectedCategory === category ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            )}
          >
            {category}
          </Badge>
        </Link>
      ))}
    </div>
  );
}