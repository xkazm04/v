'use client';

import { motion } from 'framer-motion';
import { useMemo, Suspense, lazy } from 'react';
import SideNavMainSection from './SideNavSections';
import SidebarSections from './SidebarSections';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';
import { getCountryFlag, getCountryName } from '@/app/helpers/countries';
import Divider from '../ui/divider';
import Image from 'next/image';
import { navItemVariants } from '../animations/variants/navVariants';
import { useSidebarState, LoadingStage } from './SidebarLayout';

const SideSettingButton = lazy(() => import('./SideSettingButton'));

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

    const availableCountries = getAvailableCountries();

    // ✅ Get user preferences
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
    );
};

export default SideCat;