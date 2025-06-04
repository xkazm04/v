'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Filter, X, RotateCcw } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryFilter, STATEMENT_CATEGORIES } from '@/app/sections/home/CategoryFilter';
import { CountryFilter, COUNTRIES } from '@/app/components/filters/CountryFilter';

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

interface AdvancedFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  className?: string;
  showForNewsAndVideos?: boolean;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status', color: 'bg-gray-100' },
  { value: 'TRUE', label: 'True', color: 'bg-green-100 text-green-800' },
  { value: 'FALSE', label: 'False', color: 'bg-red-100 text-red-800' },
  { value: 'MISLEADING', label: 'Misleading', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'UNVERIFIED', label: 'Unverified', color: 'bg-gray-100 text-gray-800' },
];

const SOURCE_OPTIONS = [
  { value: 'all', label: 'All Sources' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'news', label: 'News Outlets' },
];

export function AdvancedFilters({ 
  onFiltersChange, 
  initialFilters = {},
  className,
  showForNewsAndVideos = true
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    country: 'all',
    status: 'all',
    source: 'all',
    dateRange: { from: null, to: null },
    ...initialFilters
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.country !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.source !== 'all') count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    
    setActiveFiltersCount(count);
  }, [filters]);

  // Notify parent of filter changes
  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      country: 'all',
      status: 'all',
      source: 'all',
      dateRange: { from: null, to: null }
    });
  };

  const getFilterSummary = () => {
    const summary = [];
    
    if (filters.category !== 'all') {
      const cat = STATEMENT_CATEGORIES.find(c => c.value === filters.category);
      summary.push(cat?.label || filters.category);
    }
    
    if (filters.country !== 'all') {
      const country = COUNTRIES.find(c => c.code === filters.country);
      summary.push(country?.name || filters.country);
    }
    
    if (filters.status !== 'all') {
      const status = STATUS_OPTIONS.find(s => s.value === filters.status);
      summary.push(status?.label || filters.status);
    }
    
    if (filters.source !== 'all') {
      const source = SOURCE_OPTIONS.find(s => s.value === filters.source);
      summary.push(source?.label || filters.source);
    }
    
    return summary;
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between mb-4"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.div>
      </Button>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <div className="flex flex-wrap gap-2">
            {getFilterSummary().map((filter, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {filter}
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </motion.div>
      )}

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Advanced Filters</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-muted-foreground"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset All
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Category</h4>
                  <CategoryFilter
                    selectedCategory={filters.category}
                    onCategoryChange={(category) => updateFilter('category', category)}
                  />
                </div>

                <Separator />

                {/* Country Filter */}
                <div>
                  <CountryFilter
                    selectedCountry={filters.country}
                    onCountryChange={(country) => updateFilter('country', country)}
                  />
                </div>

                <Separator />

                {/* Status Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    Fact-Check Status
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((status) => (
                      <Button
                        key={status.value}
                        variant={filters.status === status.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter('status', status.value)}
                        className={cn(
                          'text-xs',
                          filters.status === status.value ? '' : status.color
                        )}
                      >
                        {status.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Source Filter */}
                {showForNewsAndVideos && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium mb-3">Source</h4>
                      <div className="flex flex-wrap gap-2">
                        {SOURCE_OPTIONS.map((source) => (
                          <Button
                            key={source.value}
                            variant={filters.source === source.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateFilter('source', source.value)}
                            className="text-xs"
                          >
                            {source.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />
                  </>
                )}

                {/* Date Range Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Date Range</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">From</label>
                      <input
                        type="date"
                        value={filters.dateRange.from || ''}
                        onChange={(e) => updateFilter('dateRange', {
                          ...filters.dateRange,
                          from: e.target.value || null
                        })}
                        className="w-full mt-1 px-3 py-2 border border-input rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">To</label>
                      <input
                        type="date"
                        value={filters.dateRange.to || ''}
                        onChange={(e) => updateFilter('dateRange', {
                          ...filters.dateRange,
                          to: e.target.value || null
                        })}
                        className="w-full mt-1 px-3 py-2 border border-input rounded-md text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}