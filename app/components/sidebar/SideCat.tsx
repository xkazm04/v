'use client';

import { 
  Home, 
  ThumbsUp, 
  Clock,
  Globe,
  Filter
} from 'lucide-react';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import SideSectionHeader from './SideSectionHeader';
import SideCountryItem from './SideCountryItem';
import NavItem from './SideNavItem';
import SideNavMainSection from './SideNavSections';
import { COUNTRY_SECTIONS } from '@/app/constants/countriesMock';

type Props = {
    isCollapsed: boolean;
    isActive: (path: string) => boolean;
}

const SideCat = ({ isCollapsed, isActive }: Props) => {
    const [mounted, setMounted] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main', 'countries']));

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

    return (
        <div className="relative h-full">
            {/* Background with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-gray-50/30 to-white/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50" />
            
            <ScrollArea className="relative h-full py-4">
                <div className="px-3 space-y-1">
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
                    <div className="my-4 px-4">
                        <motion.div 
                            className="h-px bg-gradient-to-r from-transparent via-border to-transparent"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        />
                    </div>

                    {/* Countries Section */}
                    <SideSectionHeader 
                        title="Countries" 
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
                                className="space-y-1 overflow-hidden"
                            >
                                {COUNTRY_SECTIONS.map((country, index) => (
                                    <motion.div
                                        key={country.code}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ 
                                            duration: 0.3, 
                                            delay: index * 0.05,
                                            ease: "easeOut"
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
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Another Divider */}
                    <div className="my-4 px-4">
                        <motion.div 
                            className="h-px bg-gradient-to-r from-transparent via-border to-transparent"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        />
                    </div>

                    {/* Quick Actions Section */}
                    <SideSectionHeader 
                        title="Quick Actions" 
                        icon={Filter} 
                        sectionId="actions"
                        isExpanded={expandedSections.has('actions')}
                        isCollapsed={isCollapsed}
                        mounted={mounted}
                        toggleSection={toggleSection}
                    />
                    
                    <AnimatePresence initial={false}>
                        {expandedSections.has('actions') && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="space-y-1 overflow-hidden"
                            >
                                <NavItem 
                                    href="/recent" 
                                    icon={Clock} 
                                    label="Recent Activity" 
                                    isActiveRoute={isActive('/recent')}
                                    description="Last 24 hours"
                                    itemId="recent"
                                    isCollapsed={isCollapsed}
                                    mounted={mounted}
                                />
                                <NavItem 
                                    href="/top-rated" 
                                    icon={ThumbsUp} 
                                    label="Top Rated" 
                                    isActiveRoute={isActive('/top-rated')}
                                    description="Highly verified"
                                    itemId="top-rated"
                                    isCollapsed={isCollapsed}
                                    mounted={mounted}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </ScrollArea>

            {/* Subtle bottom fade effect */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
    );
};

export default SideCat;