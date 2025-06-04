'use client';

import { useState, useCallback, useMemo, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Shield, 
  Leaf, 
  ChevronDown,
  Filter,
  X,
  Building,
  Heart,
  Briefcase,
  Zap,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/lib/utils';
import CategoryItem from './CategoryItem';

export interface Category {
  id: string;
  label: string;
  icon: any;
  color: string;
  count?: number;
  isDefault?: boolean;
}

const ALL_CATEGORIES: Category[] = [
  // Default categories (always visible)
  { id: 'politics', label: 'Politics', icon: Users, color: '#3b82f6', count: 245, isDefault: true },
  { id: 'military', label: 'Military', icon: Shield, color: '#ef4444', count: 89, isDefault: true },
  { id: 'environment', label: 'Environment', icon: Leaf, color: '#22c55e', count: 156, isDefault: true },
  
  // Expandable categories
  { id: 'economy', label: 'Economy', icon: TrendingUp, color: '#f59e0b', count: 123 },
  { id: 'health', label: 'Health', icon: Heart, color: '#ec4899', count: 167 },
  { id: 'technology', label: 'Technology', icon: Zap, color: '#8b5cf6', count: 78 },
  { id: 'international', label: 'International', icon: Globe, color: '#06b6d4', count: 201 },
  { id: 'business', label: 'Business', icon: Briefcase, color: '#84cc16', count: 134 },
  { id: 'infrastructure', label: 'Infrastructure', icon: Building, color: '#64748b', count: 67 },
];

interface CategoryFilterProps {
  className?: string;
  onSelectionChange?: (categories: string[]) => void;
  maxVisible?: number;
  showCounts?: boolean;
  allowMultiSelect?: boolean;
}

export function CategoryFilter({ 
  className,
  onSelectionChange,
  maxVisible = 3,
  showCounts = true,
  allowMultiSelect = false
}: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<string | null>(null);

  // Get current selected categories from URL
  const selectedCategories = useMemo(() => {
    const categories = searchParams.get('categories');
    return categories ? categories.split(',') : [];
  }, [searchParams]);

  // Split categories into default and expandable
  const defaultCategories = useMemo(() => 
    ALL_CATEGORIES.filter(cat => cat.isDefault), 
    []
  );
  
  const expandableCategories = useMemo(() => 
    ALL_CATEGORIES.filter(cat => !cat.isDefault), 
    []
  );

  // Optimized navigation with visual feedback
  const updateCategories = useCallback((newCategories: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    } else {
      params.delete('categories');
    }

    const newUrl = `${pathname}?${params.toString()}`;
    
    startTransition(() => {
      router.push(newUrl, { scroll: false });
    });
    
    onSelectionChange?.(newCategories);
  }, [router, pathname, searchParams, onSelectionChange]);

  const handleCategoryClick = useCallback((categoryId: string) => {
    setPendingSelection(categoryId);
    
    let newSelection: string[];
    
    if (allowMultiSelect) {
      if (selectedCategories.includes(categoryId)) {
        newSelection = selectedCategories.filter(id => id !== categoryId);
      } else {
        newSelection = [...selectedCategories, categoryId];
      }
    } else {
      newSelection = selectedCategories.includes(categoryId) ? [] : [categoryId];
    }
    
    // Optimistic UI update with slight delay for visual feedback
    setTimeout(() => {
      updateCategories(newSelection);
      setPendingSelection(null);
    }, 150);
  }, [selectedCategories, allowMultiSelect, updateCategories]);

  const clearAll = useCallback(() => {
    updateCategories([]);
  }, [updateCategories]);



  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Categories</span>
          {selectedCategories.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {selectedCategories.length} selected
            </Badge>
          )}
        </div>
        
        {selectedCategories.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Default Categories */}
      <div className="flex flex-wrap gap-2">
        {defaultCategories.map(category => (
          <CategoryItem
            key={category.id}
            category={category}
            isSelected={selectedCategories.includes(category.id)}
            isPendingItem={pendingSelection === category.id}
			showAnimation={true}
			handleCategoryClick={handleCategoryClick}
			showCounts={showCounts}
          />
        ))}
        
        {/* Expand/Collapse Toggle */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="transition-all duration-200"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="ml-5" />
            </motion.div>
          </button>
        </motion.div>
      </div>

      {/* Expandable Categories */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <motion.div 
              className="flex flex-wrap gap-2 pt-2 border-t border-border/50"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {expandableCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                >
                  <CategoryItem
                    category={category}
                    isSelected={selectedCategories.includes(category.id)}
                    isPendingItem={pendingSelection === category.id}
                    showAnimation={false}
					handleCategoryClick={handleCategoryClick}
					showCounts={showCounts}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}