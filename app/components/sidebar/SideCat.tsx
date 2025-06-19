'use client';

import { 
  Home, 
  Globe,
} from 'lucide-react';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import SideSectionHeader from './SideSectionHeader';
import SideCountryItem from './SideCountryItem';
import SideNavMainSection from './SideNavSections';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';
import { getCountryFlag, getCountryName } from '@/app/helpers/countries';

type Props = {
    isCollapsed: boolean;
    isActive: (path: string) => boolean;
}

const SideCat = ({ isCollapsed, isActive }: Props) => {
    const [mounted, setMounted] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main', 'countries']));
    const { colors, sidebarColors, isDark } = useLayoutTheme();
    
    // ✅ Get user's preferred countries from preferences with real-time updates
    const { preferences, getAvailableCountries } = useUserPreferences();
    const availableCountries = getAvailableCountries();

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId);
            } else {
                newSet.add(sectionId);
            }
            return newSet;
        });
    };

    // ✅ Get only user's preferred countries, fallback to worldwide if none
    const userPreferredCountries = preferences.countries && preferences.countries.length > 0 
        ? preferences.countries 
        : ['worldwide'];

    // ✅ Memoize sidebar countries for performance and stable references
    const sidebarCountries = useMemo(() => {
        return userPreferredCountries.map(countryCode => {
            // Find the full country data from available countries
            const countryData = availableCountries.find(c => c.code === countryCode);
            
            if (countryData) {
                return {
                    name: countryData.name,
                    flag: countryData.flag,
                    href: `/?country=${countryData.code}`,
                    code: countryData.code,
                    isDefault: countryData.code === 'worldwide'
                };
            }
            
            // Fallback for countries not in the available list
            return {
                name: getCountryName(countryCode) || countryCode.toUpperCase(),
                flag: getCountryFlag(countryCode),
                href: `/?country=${countryCode}`,
                code: countryCode,
                isDefault: countryCode === 'worldwide'
            };
        });
    }, [userPreferredCountries, availableCountries]);

    return (
        <div className="relative h-full">
            <ScrollArea className="h-full py-4">
                <div className="px-3 space-y-2">
                    {/* Main Navigation Section */}
                    <SideSectionHeader 
                        title="Navigation" 
                        icon={Home} 
                        sectionId="main"
                        isExpanded={expandedSections.has('main')}
                        isCollapsed={isCollapsed}
                        mounted={mounted}
                        toggleSection={toggleSection}
                    />
                    <SideNavMainSection
                        expandedSections={expandedSections}
                        isActive={isActive}
                        isCollapsed={isCollapsed}
                        mounted={mounted}
                    />

                    {/* Elegant Divider */}
                    <div className="my-6 px-2">
                        <motion.div 
                            className="h-px"
                            style={{
                                background: isDark
                                    ? `linear-gradient(to right, transparent 0%, rgba(71, 85, 105, 0.4) 50%, transparent 100%)`
                                    : `linear-gradient(to right, transparent 0%, rgba(226, 232, 240, 0.6) 50%, transparent 100%)`
                            }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        />
                    </div>

                    {/* Countries Section */}
                    <SideSectionHeader 
                        title="Country" 
                        icon={Globe} 
                        sectionId="countries"
                        isExpanded={expandedSections.has('countries')}
                        isCollapsed={isCollapsed}
                        mounted={mounted}
                        toggleSection={toggleSection}
                    />
                    
                    <AnimatePresence initial={false}>
                        {expandedSections.has('countries') && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="space-y-3 overflow-hidden"
                            >
                                    {sidebarCountries.map((country, index) => (
                                        <motion.div
                                            key={`${country.code}-${preferences.lastUpdated}`} 
                                            layout
                                            initial={{ x: -30, opacity: 0, scale: 0.9 }}
                                            animate={{ x: 0, opacity: 1, scale: 1 }}
                                            exit={{ x: -30, opacity: 0, scale: 0.9 }}
                                            transition={{ 
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 25,
                                                delay: index * 0.05,
                                                layout: { duration: 0.3 }
                                            }}
                                        >
                                            <SideCountryItem 
                                                mounted={mounted}
                                                isCollapsed={isCollapsed}
                                                country={country}
                                                isActiveRoute={isActive(country.href.split('?')[0]) && 
                                                    typeof window !== 'undefined' && 
                                                    window.location.search.includes(`country=${country.code}`)}
                                            />
                                        </motion.div>
                                    ))}

                                {/* ✅ Empty state with animation */}
                                {sidebarCountries.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-center py-4 px-2"
                                    >
                                        <p 
                                            className="text-sm"
                                            style={{ color: colors.mutedForeground }}
                                        >
                                            No countries selected
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Country count indicator */}
                    {mounted && expandedSections.has('countries') && sidebarCountries.length > 1 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="px-3 py-2"
                        >
                            <div
                                className="text-xs text-center px-2 py-1 rounded-full"
                                style={{
                                    background: isDark 
                                        ? 'rgba(71, 85, 105, 0.3)' 
                                        : 'rgba(148, 163, 184, 0.2)',
                                    color: colors.mutedForeground
                                }}
                            >
                                {sidebarCountries.length} region{sidebarCountries.length > 1 ? 's' : ''} active
                            </div>
                        </motion.div>
                    )}

                    {/* Another Divider */}
                    <div className="my-6 px-2">
                        <motion.div 
                            className="h-px"
                            style={{
                                background: isDark
                                    ? `linear-gradient(to right, transparent 0%, rgba(71, 85, 105, 0.4) 50%, transparent 100%)`
                                    : `linear-gradient(to right, transparent 0%, rgba(226, 232, 240, 0.6) 50%, transparent 100%)`
                            }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        />
                    </div>
                </div>
            </ScrollArea>

            {/* Subtle bottom fade effect */}
            <div 
                className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
                style={{
                    background: isDark
                        ? `linear-gradient(to top, ${sidebarColors.background} 0%, transparent 100%)`
                        : `linear-gradient(to top, ${sidebarColors.background} 0%, transparent 100%)`
                }}
            />
        </div>
    );
};

export default SideCat;