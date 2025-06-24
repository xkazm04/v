'use client';

import { useState, useCallback } from 'react';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';
import { useFilterStore } from '@/app/stores/filterStore';
import { getCountryFlagSvg } from '@/app/helpers/countries';
import { cn } from '@/app/lib/utils';
import Image from 'next/image';

interface SideCountryItemProps {
    mounted: boolean;
    isCollapsed: boolean;
    country: {
        name: string;
        flag: string;
        href: string;
        code: string;
        isDefault?: boolean;
    };
    isActiveRoute?: boolean;
}

const SideCountryItem = ({ mounted, isCollapsed, country, isActiveRoute = false }: SideCountryItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { preferences } = useUserPreferences();
    

    const { selectedCountry, setSelectedCountry } = useFilterStore((state) => ({
        selectedCountry: state.selectedCountry,
        setSelectedCountry: state.setSelectedCountry
    }));

    const isFilterActive = selectedCountry === country.code || 
                          (country.isDefault && selectedCountry === 'worldwide') ||
                          isActiveRoute;
    
    const flagSvgPath = country.code !== 'worldwide' ? getCountryFlagSvg(country.code) : null;

    const handleCountryClick = useCallback(() => {
        const targetCountry = country.isDefault || country.code === 'worldwide' 
            ? 'worldwide' 
            : country.code;

        console.log(`🌍 Setting country filter: ${targetCountry}`);
        
        setSelectedCountry(targetCountry);
        
        const preferredCategory = preferences?.categories?.[0];
        if (preferredCategory && preferredCategory !== 'all') {
            console.log(`📂 Applying preferred category: ${preferredCategory}`);
        }
    }, [country.code, country.isDefault, setSelectedCountry, preferences?.categories]);

    if (!mounted) {
        return (
            <div className={cn(
                'w-full rounded-xl animate-pulse bg-gray-200 dark:bg-gray-700',
                isCollapsed ? 'h-10' : 'h-14'
            )} />
        );
    }

    return (
        <button
            onClick={handleCountryClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                'w-full relative overflow-hidden group rounded-xl transition-all duration-300',
                'border border-slate-200/50 dark:border-slate-700/50',
                isCollapsed ? 'h-10 px-1' : 'h-14 px-2',
                isFilterActive && [
                    'bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-indigo-500/10',
                    'dark:from-blue-500/25 dark:via-purple-500/18 dark:to-indigo-500/15',
                    'border-blue-500/40 dark:border-blue-500/50',
                    'shadow-lg shadow-blue-500/15 dark:shadow-blue-500/20'
                ],
                // Hover states
                !isFilterActive && [
                    'hover:bg-slate-50/80 dark:hover:bg-slate-800/60',
                    'hover:border-slate-300/60 dark:hover:border-slate-600/60'
                ],
                isFilterActive && [
                    'hover:from-blue-500/25 hover:via-purple-500/20 hover:to-indigo-500/15',
                    'dark:hover:from-blue-500/30 dark:hover:via-purple-500/23 dark:hover:to-indigo-500/18'
                ]
            )}
        >
            {isCollapsed ? (
                <div className="flex items-center justify-center h-full relative">
                    <span className="text-xl" title={country.name}>
                        {country.flag}
                    </span>
                    {isFilterActive && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                </div>
            ) : (
                <div className="flex items-center h-full">
                    {/* Left 1/4 - Country Code */}
                    <div className="w-1/4 flex items-center justify-center">
                        <span 
                            className={cn(
                                'text-sm font-bold tracking-wider',
                                isFilterActive 
                                    ? 'text-blue-700 dark:text-blue-300' 
                                    : 'text-slate-600 dark:text-slate-400'
                            )}
                        >
                            {country.code === 'worldwide' ? '🌍' : country.code.toUpperCase()}
                        </span>
                    </div>

                    {/* Right 3/4 - Flag + Active Indicator */}
                    <div className="w-3/4 relative h-full flex items-center justify-center">
                        {/* Flag Background */}
                        {flagSvgPath && (
                            <div 
                                className={cn(
                                    'absolute inset-1 rounded-lg overflow-hidden transition-opacity duration-300',
                                    isFilterActive ? 'opacity-60' : isHovered ? 'opacity-40' : 'opacity-30'
                                )}
                            >
                                <Image
                                    src={flagSvgPath}
                                    alt={`${country.name} flag`}
                                    fill
                                    className="object-cover"
                                />
                                <div 
                                    className={cn(
                                        'absolute inset-0',
                                        isFilterActive 
                                            ? 'bg-gradient-to-br from-blue-500/15 via-blue-500/8 to-purple-500/12'
                                            : 'bg-gradient-to-br from-black/12 via-black/4 to-black/12'
                                    )}
                                />
                            </div>
                        )}

                        {/* Flag Emoji Fallback */}
                        {!flagSvgPath && (
                            <span className="text-2xl opacity-60">
                                {country.flag}
                            </span>
                        )}

                        {/* Active Indicator */}
                        {isFilterActive && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full shadow-sm" />
                        )}
                    </div>
                </div>
            )}
        </button>
    );
};

export default SideCountryItem;