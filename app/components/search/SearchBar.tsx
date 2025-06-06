'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchVideos } from '@/app/hooks/useVideos';

interface SearchBarProps {
  className?: string;
  onResultSelect?: (result: any, type: 'news' | 'video') => void;
  placeholder?: string;
}

export function SearchBar({ className, onResultSelect, placeholder = "Search news and videos..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // // Search hooks
  // const { data: newsData, isLoading: newsLoading } = useSearchResearch(
  //   debouncedQuery || undefined,
  //   undefined,
  //   undefined,
  //   undefined,
  //   undefined,
  //   10,
  //   0
  // );

  const { data: videoData, isLoading: videosLoading } = useSearchVideos(
    debouncedQuery || undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    10,
    0
  );

  // Ensure we have arrays to work with
  //@ts-expect-error Ignore
  const newsResults = Array.isArray(newsData) ? newsData : [];
  const videoResults = Array.isArray(videoData) ? videoData : [];

  //@ts-expect-error Ignore
  const isLoading = newsLoading || videosLoading;
  const hasResults = newsResults.length > 0 || videoResults.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const handleResultClick = (result: any, type: 'news' | 'video') => {
    onResultSelect?.(result, type);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className={cn('relative w-full max-w-md', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-10"
          onFocus={() => query.length > 0 && setIsOpen(true)}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="max-h-96 overflow-y-auto">
              <CardContent className="p-4">
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                  </div>
                )}

                {!isLoading && !hasResults && debouncedQuery && (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No results found for "{debouncedQuery}"</p>
                  </div>
                )}

                {!isLoading && hasResults && (
                  <div className="space-y-4">
                    {/* News Results */}
                    {newsResults.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">News</h4>
                        <div className="space-y-2">
                          {newsResults.slice(0, 5).map((item: any, index: number) => (
                            <div
                              key={item.id || `news-${index}`}
                              className="p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
                              onClick={() => handleResultClick(item, 'news')}
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-1">
                                  <p className="text-sm font-medium line-clamp-2">
                                    {item.statement || item.title || 'Untitled'}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {item.source && (
                                      <Badge variant="outline" className="text-xs">
                                        {item.source}
                                      </Badge>
                                    )}
                                    {item.category && (
                                      <Badge variant="secondary" className="text-xs">
                                        {item.category}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Video Results */}
                    {videoResults.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Videos</h4>
                        <div className="space-y-2">
                          {videoResults.slice(0, 5).map((item: any, index: number) => (
                            <div
                              key={item.id || `video-${index}`}
                              className="p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
                              onClick={() => handleResultClick(item, 'video')}
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-1">
                                  <p className="text-sm font-medium line-clamp-2">
                                    {item.title || item.statement || 'Untitled'}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {item.speaker_name && (
                                      <Badge variant="outline" className="text-xs">
                                        {item.speaker_name}
                                      </Badge>
                                    )}
                                    {item.source && (
                                      <Badge variant="secondary" className="text-xs">
                                        {item.source}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}