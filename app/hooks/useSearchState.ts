'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNews } from './useNews';
import { useSearchVideos } from './useVideos';

interface UseSearchStateProps {
  autoFocus?: boolean;
  onResultSelect?: (result: any, type: 'news' | 'video') => void;
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

interface UseSearchStateReturn {
  // State
  query: string;
  debouncedQuery: string;
  isOpen: boolean;
  isFocused: boolean;
  isLoading: boolean;
  hasResults: boolean;
  shouldSearch: boolean;
  
  // Results
  newsResults: any[];
  videoResults: any[];
  
  // Refs
  searchRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  
  // Handlers
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  handleResultClick: (result: any, type: 'news' | 'video') => void;
  handleFocus: () => void;
  handleBlur: () => void;
  
  // State setters
  setQuery: (query: string) => void;
  setIsOpen: (open: boolean) => void;
  setIsFocused: (focused: boolean) => void;
}

export function useSearchState({
  autoFocus = false,
  onResultSelect,
  minQueryLength = 2,
  debounceDelay = { short: 500, long: 300 },
  limits = { news: 10, videos: 10 }
}: UseSearchStateProps = {}): UseSearchStateReturn {
  // Core state
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  // Refs
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search query with different delays based on query length
  useEffect(() => {
    const delay = query.length <= minQueryLength ? debounceDelay.short : debounceDelay.long;
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, delay);

    return () => clearTimeout(timer);
  }, [query, minQueryLength, debounceDelay.short, debounceDelay.long]);

  // Search condition
  const shouldSearch = debouncedQuery.length >= minQueryLength;
  
  // Search hooks - only trigger when we have a meaningful query
  const { 
    articles: newsResults = [], 
    loading: newsLoading,
    error: newsError
  } = useNews({
    searchText: shouldSearch ? debouncedQuery : undefined,
    limit: limits.news,
    autoRefresh: false
  });

  const { 
    data: videoResults = [], 
    isLoading: videosLoading,
    error: videosError
  } = useSearchVideos(
    shouldSearch ? debouncedQuery : undefined,
    undefined, // category
    undefined, // country
    undefined, // source
    undefined, // speaker
    undefined, // status
    limits.videos, // limit
    0 // offset
  );

  // Computed state
  const isLoading = newsLoading || videosLoading;
  const hasResults = newsResults.length > 0 || videoResults.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsFocused(false);
        inputRef.current?.blur();
      }
      
      // Prevent default browser search on Ctrl+F when focused
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && isFocused) {
        e.preventDefault();
      }
    };

    if (isOpen || isFocused) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isFocused]);

  // Auto focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // Small delay to ensure DOM is ready
      
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  // Input change handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Open dropdown for any non-empty query, but only search when >= minQueryLength chars
    setIsOpen(value.length > 0);
    
    // Clear any pending blur timeout when user starts typing
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  }, []);

  // Clear handler
  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setIsOpen(false);
    
    // Focus input after clearing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, []);

  // Result click handler
  const handleResultClick = useCallback((result: any, type: 'news' | 'video') => {
    onResultSelect?.(result, type);
    setIsOpen(false);
    setQuery('');
    setDebouncedQuery('');
    setIsFocused(false);
    
    // Optional: Keep focus on input for continued searching
    // inputRef.current?.focus();
  }, [onResultSelect]);

  // Focus handler
  const handleFocus = useCallback(() => {
    // Clear any pending blur timeout
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    
    setIsFocused(true);
    if (query.length > 0) {
      setIsOpen(true);
    }
  }, [query.length]);

  // Blur handler with delay to allow for result clicks
  const handleBlur = useCallback(() => {
    // Use a longer delay to ensure result clicks are processed
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
      // Only close if not actively searching
      if (!isLoading) {
        setIsOpen(false);
      }
    }, 300);
  }, [isLoading]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  return {
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
    handleBlur,
    
    // State setters (for advanced use cases)
    setQuery,
    setIsOpen,
    setIsFocused
  };
}