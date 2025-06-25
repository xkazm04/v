'use client';

import { motion } from 'framer-motion';
import { useMemo, Suspense, lazy, useEffect, createContext, useContext } from 'react';
import SideNavMainSection from './SideNavSections';
import SidebarSections from './SidebarSections';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';
import { getCountryFlag, getCountryName } from '@/app/helpers/countries';
import Divider from '../ui/divider';
import Image from 'next/image';
import { navItemVariants } from '../animations/variants/navVariants';
import { useSidebarState, LoadingStage } from './SidebarLayout';
import { useNewsCount } from '@/app/hooks/useNewsCount';
import { useFilterStore } from '@/app/stores/filterStore'; // ✅ Import filter store

const SideSettingButton = lazy(() => import('./SideSettingButton'));

// ✅ Context to share news counts across all country items
const NewsCountContext = createContext<{
  getCountForCountry: (countryCode: string) => number;
  loading: boolean;
  error: string | null;
} | null>(null);

export const useNewsCountContext = () => {
  const context = useContext(NewsCountContext);
  if (!context) {
    return { getCountForCountry: () => 0, loading: false, error: null };
  }
  return context;
};

const ComponentSkeleton = ({ height = "h-8" }: { height?: string }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${height} bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse`}
    />
);

type Props = {
    isCollapsed: boolean;
    isActive: (path: string) => boolean;
}

const SideCat = ({ isCollapsed, isActive }: Props) => {
    const { isDark } = useLayoutTheme();
    const { preferences, getAvailableCountries } = useUserPreferences();
    const {
        mounted,
        loadingStage,
        expandedSections,
        containerRef,
        toggleSection
    } = useSidebarState();

    // ✅ Get filter store actions
    const { applyAutoCountrySelection, resetAutoSelection } = useFilterStore(
        (state) => ({ 
            applyAutoCountrySelection: state.applyAutoCountrySelection,
            resetAutoSelection: state.resetAutoSelection
        })
    );

    const availableCountries = getAvailableCountries();

    const userPreferredCountries = useMemo(() => {
        const countries = preferences.countries && preferences.countries.length > 0
            ? preferences.countries
            : ['worldwide'];
        return [...countries].sort();
    }, [preferences.countries?.join(',')]); 

    const userPreferredCategories = preferences.categories || [];

    const { getCountForCountry, loading: countsLoading, error: countsError } = useNewsCount(userPreferredCountries);

    const sidebarCountries = useMemo(() => {
        console.log('🔄 SideCat: Updating sidebar countries based on preferences:', userPreferredCountries);
        
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


    useEffect(() => {
        if (mounted && userPreferredCountries.length > 0) {
            console.log('🌍 SideCat: Applying auto country selection for:', userPreferredCountries);
            applyAutoCountrySelection(userPreferredCountries);
        }
    }, [userPreferredCountries.join(','), mounted, applyAutoCountrySelection]);


    useEffect(() => {
        if (preferences.lastUpdated) {
            console.log('🔄 SideCat: Preferences updated, resetting auto-selection');
            resetAutoSelection();
        }
    }, [preferences.lastUpdated, resetAutoSelection]);

    useEffect(() => {
        if (mounted) {
            console.log('🌍 SideCat: Country selection updated - sidebar now shows:');
            sidebarCountries.forEach((country, index) => {
                const count = getCountForCountry(country.code);
                console.log(`   ${index + 1}. ${country.name} (${country.code}) - ${count} articles`);
            });
        }
    }, [userPreferredCountries.join(','), mounted]); 

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
        <NewsCountContext.Provider value={{ getCountForCountry, loading: countsLoading, error: countsError }}>
            <div className="relative" ref={containerRef}>
                <motion.div 
                    className="space-y-4 px-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key={`sidebar-${preferences.lastUpdated}`} 
                >
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

 
                    <SidebarSections
                        isCollapsed={isCollapsed}
                        isActive={isActive}
                        mounted={mounted}
                        loadingStage={loadingStage}
                        expandedSections={expandedSections}
                        toggleSection={toggleSection}
                        sidebarCountries={sidebarCountries}
                        userPreferredCategories={userPreferredCategories}
                        preferences={preferences}
                        key={`sections-${userPreferredCountries.join('-')}`} 
                    />

                    {loadingStage >= LoadingStage.SETTINGS ? (
                        <motion.div variants={navItemVariants} className='py-5'>
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
        </NewsCountContext.Provider>
    );
};

export default SideCat;