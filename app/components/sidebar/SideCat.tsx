'use client';
import {
    Globe,
    Hash,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react'
import SideSectionHeader from './SideSectionHeader';
import SideNavMainSection from './SideNavSections';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';
import { getCountryFlag, getCountryName } from '@/app/helpers/countries';
import Divider from '../ui/divider';
import Image from 'next/image';
import { navItemVariants } from '../animations/variants/navVariants';
import SideCatStats from './SideCatStats';

const SideCountryItem = lazy(() => import('./SideCountryItem'));
const SideCategoryGrid = lazy(() => import('./SideCategoryGrid'));
const SideSettingButton = lazy(() => import('./SideSettingButton'));

const ComponentSkeleton = ({ height = "h-8" }: { height?: string }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${height} bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse`}
    />
);

enum LoadingStage {
    NAVIGATION = 0,
    STATS = 1,
    COUNTRIES = 2,
    CATEGORIES = 3,
    SETTINGS = 4,
    COMPLETE = 5
}

type Props = {
    isCollapsed: boolean;
    isActive: (path: string) => boolean;
}

const SideCat = ({ isCollapsed, isActive }: Props) => {
    const [mounted, setMounted] = useState(false);
    const [loadingStage, setLoadingStage] = useState<LoadingStage>(LoadingStage.NAVIGATION);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main', 'countries']));
    const { isDark } = useLayoutTheme();
    const containerRef = useRef<HTMLDivElement>(null);

    const { preferences, getAvailableCountries } = useUserPreferences();
    const availableCountries = getAvailableCountries();

    // ✅ Progressive loading with delays
    useEffect(() => {
        setMounted(true);
        
        const stages = [
            { stage: LoadingStage.STATS, delay: 400 },
            { stage: LoadingStage.COUNTRIES, delay: 800 },
            { stage: LoadingStage.CATEGORIES, delay: 1200 },
            { stage: LoadingStage.SETTINGS, delay: 1600 },
            { stage: LoadingStage.COMPLETE, delay: 2000 }
        ];

        stages.forEach(({ stage, delay }) => {
            setTimeout(() => {
                setLoadingStage(prevStage => Math.max(prevStage, stage));
            }, delay);
        });
    }, []);

    // ✅ Intersection Observer for adaptive loading
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Accelerate loading if component is in view
                        setLoadingStage(LoadingStage.COMPLETE);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
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

    // ✅ Get user preferences (same as before)
    const userPreferredCountries = preferences.countries && preferences.countries.length > 0
        ? preferences.countries
        : ['worldwide'];

    const userPreferredCategories = preferences.categories || [];

    const sidebarCountries = useMemo(() => {
        return userPreferredCountries.map(countryCode => {
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

            return {
                name: getCountryName(countryCode) || countryCode.toUpperCase(),
                flag: getCountryFlag(countryCode),
                href: `/?country=${countryCode}`,
                code: countryCode,
                isDefault: countryCode === 'worldwide'
            };
        });
    }, [userPreferredCountries, availableCountries]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };


    return (
        <div className="relative" ref={containerRef}>
            <motion.div 
                className="space-y-4 px-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* ✅ Navigation Section - Always loads first */}
                <motion.div variants={navItemVariants}>
                    <SideNavMainSection
                        isActive={isActive}
                        isCollapsed={isCollapsed}
                        mounted={mounted}
                    />
                </motion.div>

                <motion.div variants={navItemVariants}>
                    <Divider />
                </motion.div>

                {/* ✅ Stats Section - Loads after navigation */}
                {loadingStage >= LoadingStage.STATS && (
                    <SideCatStats />
                )}

                {/* ✅ Countries Section - Progressive loading */}
                {loadingStage >= LoadingStage.COUNTRIES ? (
                    <motion.div variants={navItemVariants}>
                        <SideSectionHeader
                            title="Regions"
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
                                    className="space-y-2 overflow-hidden"
                                >
                                    <AnimatePresence mode="popLayout">
                                        {sidebarCountries.map((country, index) => (
                                            <motion.div
                                                key={`${country.code}-${preferences.lastUpdated || 'initial'}`}
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
                                                <Suspense fallback={<ComponentSkeleton />}>
                                                    <SideCountryItem
                                                        mounted={mounted}
                                                        isCollapsed={isCollapsed}
                                                        country={country}
                                                        isActiveRoute={isActive(country.href.split('?')[0]) &&
                                                            typeof window !== 'undefined' &&
                                                            window.location.search.includes(`country=${country.code}`)}
                                                    />
                                                </Suspense>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <ComponentSkeleton height="h-12" />
                )}

                <motion.div variants={navItemVariants}>
                    <Divider />
                </motion.div>

                {/* ✅ Categories Section - Progressive loading */}
                {loadingStage >= LoadingStage.CATEGORIES && userPreferredCategories.length > 0 ? (
                    <motion.div variants={navItemVariants}>
                        <SideSectionHeader
                            title="Topics"
                            icon={Hash}
                            sectionId="categories"
                            isExpanded={expandedSections.has('categories')}
                            isCollapsed={false}
                            mounted={mounted}
                            toggleSection={toggleSection}
                        />

                        <AnimatePresence initial={false}>
                            {expandedSections.has('categories') && (
                                <motion.div
                                    key={`categories-${preferences.lastUpdated || 'initial'}`}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <Suspense fallback={<ComponentSkeleton height="h-16" />}>
                                        <SideCategoryGrid
                                            categories={userPreferredCategories}
                                            isCollapsed={false}
                                            mounted={mounted}
                                        />
                                    </Suspense>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ) : userPreferredCategories.length > 0 ? (
                    <ComponentSkeleton height="h-12" />
                ) : null}

                {userPreferredCategories.length > 0 && (
                    <motion.div variants={navItemVariants}>
                        <Divider />
                    </motion.div>
                )}

                {loadingStage >= LoadingStage.SETTINGS ? (
                    <motion.div variants={navItemVariants}>
                        <Suspense fallback={<ComponentSkeleton height="h-14" />}>
                            <SideSettingButton />
                        </Suspense>
                    </motion.div>
                ) : (
                    <ComponentSkeleton height="h-14" />
                )}

                <motion.div
                    variants={navItemVariants}
                    className="absolute -bottom-20 flex pointer-events-none -z-10"
                >
                    <motion.div>
                        <Image
                            src="/logos/logo_glow_white.png"
                            alt="Logo"
                            width={250}
                            height={250}
                            className={`drop-shadow-lg ${isDark ? 'opacity-90' : 'opacity-40'}`}
                            style={{
                                filter: isDark
                                    ? 'brightness(1) contrast(1)'
                                    : 'brightness(0.8) contrast(1.2) saturate(0.8)'
                            }}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SideCat;