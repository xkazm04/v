'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Input } from '@/app/components/ui/input';
import { Search, Globe } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Common countries for news filtering
export const COUNTRIES = [
  { code: 'all', name: 'All Countries', flag: '🌍' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
];

interface CountryFilterProps {
  selectedCountry?: string;
  onCountryChange?: (country: string) => void;
  className?: string;
  showCounts?: boolean;
  counts?: Record<string, number>;
  searchable?: boolean;
}

export function CountryFilter({ 
  selectedCountry = 'all', 
  onCountryChange, 
  className,
  showCounts = false,
  counts = {},
  searchable = true
}: CountryFilterProps) {
  const [activeCountry, setActiveCountry] = useState(selectedCountry);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountrySelect = (countryCode: string) => {
    setActiveCountry(countryCode);
    onCountryChange?.(countryCode);
    setIsExpanded(false);
  };

  const selectedCountryData = COUNTRIES.find(c => c.code === activeCountry);

  return (
    <div className={cn('w-full space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Globe className="h-4 w-4" />
        Filter by Country
      </div>

      {/* Selected Country Display */}
      <Button
        variant="outline"
        className="w-full justify-between h-auto p-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedCountryData?.flag}</span>
          <span className="text-sm">{selectedCountryData?.name}</span>
          {showCounts && counts[activeCountry] && (
            <Badge variant="secondary" className="ml-auto">
              {counts[activeCountry]}
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

      {/* Dropdown */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border rounded-md bg-background">
              {/* Search */}
              {searchable && (
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search countries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              {/* Country List */}
              <ScrollArea className="max-h-64">
                <div className="p-2 space-y-1">
                  {filteredCountries.map((country) => {
                    const isActive = activeCountry === country.code;
                    const count = counts[country.code] || 0;
                    
                    return (
                      <motion.div
                        key={country.code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            'w-full justify-start p-2 h-auto',
                            isActive && 'bg-accent'
                          )}
                          onClick={() => handleCountrySelect(country.code)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <span className="text-lg">{country.flag}</span>
                            <span className="text-sm flex-1 text-left">{country.name}</span>
                            {showCounts && count > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {count}
                              </Badge>
                            )}
                          </div>
                        </Button>
                      </motion.div>
                    );
                  })}
                  
                  {filteredCountries.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      No countries found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}