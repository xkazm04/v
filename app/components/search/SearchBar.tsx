'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';
import { useSearchState } from '@/app/hooks/useSearchState';
import { SearchResults } from './SearchResults';

interface SearchBarProps {
  className?: string;
  onResultSelect?: (result: any, type: 'news' | 'video') => void;
  placeholder?: string;
  variant?: 'default' | 'compact';
  showIcon?: boolean;
  autoFocus?: boolean;
  minQueryLength?: number;
  debounceDelay?: {
    short: number;
    long: number;
  };
  limits?: {
    news: number;
    videos: number;
  };
}

export function SearchBar({ 
  className, 
  onResultSelect, 
  placeholder = "Search news and videos...",
  variant = 'default',
  showIcon = true,
  autoFocus = false,
  minQueryLength = 2,
  debounceDelay,
  limits
}: SearchBarProps) {
  const {
    // State
    query,
    debouncedQuery,
    isOpen,
    isFocused,
    isLoading,
    hasResults,
    shouldSearch,
    
    // Results
    newsResults,
    videoResults,
    
    // Refs
    searchRef,
    inputRef,
    
    // Handlers
    handleInputChange,
    handleClear,
    handleResultClick,
    handleFocus,
    handleBlur
  } = useSearchState({
    autoFocus,
    onResultSelect,
    minQueryLength,
    debounceDelay,
    limits
  });

  const isCompact = variant === 'compact';

  return (
    <div ref={searchRef} className={cn('relative w-full', className)}>
      <motion.div 
        className="relative"
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {showIcon && (
          <Search className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-colors pointer-events-none",
            isCompact ? "h-4 w-4" : "h-4 w-4",
            isFocused && "text-blue-500"
          )} />
        )}
        
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "transition-all z-10 duration-200 relative", 
            showIcon ? "pl-10" : "pl-4",
            query ? "pr-12" : "pr-4", 
            isCompact ? "h-9" : "h-10",
            isFocused && "ring-2 ring-blue-500/20 border-blue-300 dark:border-blue-600",
            "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 dark:focus:border-blue-600"
          )}
          autoComplete="off" 
          spellCheck={false} 
        />
        
        {/* Clear button - positioned to not overlap with loading indicator */}
        {query && !isLoading && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "absolute right-1 top-1/2 transform -translate-y-1/2 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 z-20",
              isCompact ? "h-7 w-7" : "h-8 w-8"
            )}
            onClick={handleClear}
            tabIndex={-1} // Prevent tab focus
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Loading indicator - positioned to not overlap with clear button */}
        {isLoading && shouldSearch && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </motion.div>

      {/* Search Results */}
      <SearchResults
        isOpen={isOpen}
        query={query}
        debouncedQuery={debouncedQuery}
        newsResults={newsResults}
        videoResults={videoResults}
        isLoading={isLoading}
        hasResults={hasResults}
        onResultClick={handleResultClick}
        minQueryLength={minQueryLength}
      />

      {/* Search hint for short queries */}
      {isOpen && query.length > 0 && query.length < minQueryLength && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 z-50"
        >
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Type at least {minQueryLength} characters to search
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}