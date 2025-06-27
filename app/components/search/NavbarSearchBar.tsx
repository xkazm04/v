'use client';

import React, { useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';
import { useFilterStore } from '@/app/stores/filterStore';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { NavbarSearchInput, NavbarSearchInputHandle } from './NavbarSearchInput';

interface NavbarSearchBarProps {
  className?: string;
  placeholder?: string;
}

export function NavbarSearchBar({ 
  className,
  placeholder = "Search news..."
}: NavbarSearchBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<NavbarSearchInputHandle>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  // Use theme hook directly instead of props
  const { navbarColors } = useLayoutTheme();
  
  const { searchText } = useFilterStore((state) => ({
    searchText: state.searchText
  }));

  const hasQuery = searchText.length > 0;
  const isActive = hasQuery || isFocused;

  const handleFocusChange = (focused: boolean) => {
    setIsFocused(focused);
  };

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
            "h-4 w-4 z-10",
            isActive ? "text-blue-500" : `${navbarColors.foreground}60`
          )} 
        />
        
        {/* Search Input Component */}
        <NavbarSearchInput 
          ref={inputRef}
          placeholder={placeholder}
          onFocusChange={handleFocusChange}
        />
      </motion.div>
    </motion.div>
  );
}