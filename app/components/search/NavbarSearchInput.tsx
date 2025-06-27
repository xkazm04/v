'use client';

import React, { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useFilterStore } from '@/app/stores/filterStore';
import { useDebounce } from '@/app/hooks/useDebounce';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import LoaderComponent from '@/app/components/animations/LoaderComponent';

interface NavbarSearchInputProps {
  placeholder?: string;
  className?: string;
  onFocusChange?: (focused: boolean) => void;
}

export interface NavbarSearchInputHandle {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  isFocused: boolean;
  hasQuery: boolean;
  isActive: boolean;
}

export const NavbarSearchInput = forwardRef<NavbarSearchInputHandle, NavbarSearchInputProps>(({ 
  placeholder = "Search news...",
  className,
  onFocusChange
}, ref) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const internalInputRef = useRef<HTMLInputElement>(null);

  // Use theme hook directly
  const { navbarColors, isDark } = useLayoutTheme();

  const { searchText, setSearchText } = useFilterStore((state) => ({
    searchText: state.searchText,
    setSearchText: state.setSearchText
  }));

  const debouncedQuery = useDebounce(query, 500);

  // Sync with store state
  useEffect(() => {
    if (searchText && searchText !== query) {
      setQuery(searchText);
    }
  }, [searchText, query]);

  // Handle debounced search
  useEffect(() => {
    if (debouncedQuery !== searchText) {
      console.log(`🔍 Setting search filter: "${debouncedQuery}"`);
      setIsLoading(true);
      
      setSearchText(debouncedQuery);
      
      const loadingTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 800);

      return () => {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      };
    }
  }, [debouncedQuery, searchText, setSearchText]);

  // Input handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value !== searchText) {
      setIsLoading(true);
    }
  }, [searchText]);

  const handleClear = useCallback(() => {
    setQuery('');
    setSearchText('');
    setIsLoading(false);
    internalInputRef.current?.focus();
  }, [setSearchText]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocusChange?.(true);
  }, [onFocusChange]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocused(false);
      onFocusChange?.(false);
    }, 150);
  }, [onFocusChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        internalInputRef.current?.focus();
      }
      
      if (e.key === 'Escape' && isFocused) {
        handleClear();
        internalInputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, handleClear]);

  const hasQuery = query.length > 0;
  const isActive = hasQuery || isFocused;

  // Expose methods via useImperativeHandle
  useImperativeHandle(ref, () => ({
    focus: () => internalInputRef.current?.focus(),
    blur: () => internalInputRef.current?.blur(),
    clear: handleClear,
    get isFocused() { return isFocused; },
    get hasQuery() { return hasQuery; },
    get isActive() { return isActive; }
  }), [isFocused, hasQuery, isActive, handleClear]);

  return (
    <div className={cn("relative", className)}>
      <input
        ref={internalInputRef}
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
            ? isDark 
              ? "border-blue-600 bg-slate-800" 
              : "border-blue-300 bg-white"
            : "border-transparent",
          isDark 
            ? "placeholder:text-slate-500" 
            : "placeholder:text-slate-400"
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
      
      {/* Loading indicator */}
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
              "absolute right-3 top-1/2 transform -translate-y-1/2",
              "h-6 w-6 rounded-full flex items-center justify-center",
              "transition-colors",
              isDark
                ? "hover:bg-slate-700 text-slate-400 hover:text-slate-300"
                : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            )}
            onClick={handleClear}
            tabIndex={-1}
          >
            <X className="h-3 w-3" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});

NavbarSearchInput.displayName = 'NavbarSearchInput';