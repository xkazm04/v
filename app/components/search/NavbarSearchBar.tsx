'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useFilterStore } from '@/app/stores/filterStore';
import { useDebounce } from '@/app/hooks/useDebounce';
import LoaderComponent from '@/app/components/animations/LoaderComponent';

interface NavbarSearchBarProps {
  navbarColors: {
    foreground: string;
    background: string;
    border: string;
  };
  className?: string;
  placeholder?: string;
}

export function NavbarSearchBar({ 
  navbarColors,
  className,
  placeholder = "Search news..."
}: NavbarSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { searchText, setSearchText } = useFilterStore((state) => ({
    searchText: state.searchText,
    setSearchText: state.setSearchText
  }));

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (searchText && searchText !== query) {
      setQuery(searchText);
    }
  }, [searchText]);

  useEffect(() => {
    if (debouncedQuery !== searchText) {
      console.log(`🔍 Setting search filter: "${debouncedQuery}"`);
      setIsLoading(true);
      
      setSearchText(debouncedQuery);
      
      const loadingTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 800); // Slightly longer to account for API response time

      return () => {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      };
    }
  }, [debouncedQuery, searchText, setSearchText]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Show loading immediately for user feedback
    if (value !== searchText) {
      setIsLoading(true);
    }
  }, [searchText]);

  const handleClear = useCallback(() => {
    setQuery('');
    setSearchText('');
    setIsLoading(false);
    inputRef.current?.focus();
  }, [setSearchText]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    // Small delay to allow for potential clicks on clear button
    setTimeout(() => {
      setIsFocused(false);
    }, 150);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      // Clear search on Escape
      if (e.key === 'Escape' && isFocused) {
        handleClear();
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, handleClear]);

  const hasQuery = query.length > 0;
  const isActive = hasQuery || isFocused;

  return (
    <motion.div 
      ref={containerRef}
      className={cn('relative max-w-md w-full', className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.div 
        className="relative"
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Search Icon */}
        <Search 
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors pointer-events-none",
            "h-4 w-4",
            isActive ? "text-blue-500" : `${navbarColors.foreground}60`
          )} 
        />
        
        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "w-full h-10 rounded-lg border pl-10 pr-12 text-sm transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
            isActive 
              ? "border-blue-300 dark:border-blue-600 bg-white dark:bg-slate-800" 
              : "border-transparent",
            "placeholder:text-slate-400 dark:placeholder:text-slate-500"
          )}
          style={{
            backgroundColor: isActive 
              ? undefined 
              : `${navbarColors.background}80`,
            borderColor: isActive 
              ? undefined 
              : navbarColors.border,
            color: isActive 
              ? undefined 
              : navbarColors.foreground
          }}
          autoComplete="off" 
          spellCheck={false} 
        />
        
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-10 top-1/2 transform -translate-y-1/2"
            >
              <LoaderComponent 
                loading={isLoading} 
                variant="small" 
                speedMultiplier={1.2}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clear Button */}
        <AnimatePresence>
          {hasQuery && !isLoading && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={cn(
                "absolute right-3 top-2 transform -translate-y-1/2",
                "h-6 w-6 rounded-full flex items-center justify-center",
                "hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
                "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}
              onClick={handleClear}
              tabIndex={-1}
            >
              <X className="h-3 w-3" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {hasQuery && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-0 -left-[140px] mt-1 text-xs text-slate-500 dark:text-slate-400"
          >
            Searching for "{query}"...
          </motion.div>
        )}
        {isLoading && hasQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-0 -left-[140px] mt-1 text-xs text-blue-500 dark:text-blue-400"
          >
            Searching...
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}