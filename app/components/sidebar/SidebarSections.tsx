'use client';

import { Globe, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Suspense, lazy } from 'react';
import SideSectionHeader from './SideSectionHeader';
import Divider from '../ui/divider';
import { navItemVariants } from '../animations/variants/navVariants';

const SideCountryItem = lazy(() => import('./SideCountryItem'));
const SideHotTopics = lazy(() => import('./SideHotTopics'));

const ComponentSkeleton = ({ height = "h-8" }: { height?: string }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${height} bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse`}
    />
);

interface SidebarSectionsProps {
  isCollapsed: boolean;
  isActive: (path: string) => boolean;
  mounted: boolean;
  loadingStage: number;
  expandedSections: Set<string>;
  toggleSection: (sectionId: string) => void;
  sidebarCountries: Array<{
    name: string;
    flag: string;
    href: string;
    code: string;
    isDefault?: boolean;
  }>;
  userPreferredCategories: string[];
  preferences: any;
}

const SidebarSections: React.FC<SidebarSectionsProps> = ({
  isCollapsed,
  isActive,
  mounted,
  loadingStage,
  expandedSections,
  toggleSection,
  sidebarCountries,
  userPreferredCategories,
  preferences,
}) => {
  const LoadingStage = {
    NAVIGATION: 0,
    COUNTRIES: 1,
    CATEGORIES: 2,
    HOT_TOPICS: 3,
    SETTINGS: 4,
    COMPLETE: 5
  };

  return (
    <>
      {loadingStage >= LoadingStage.HOT_TOPICS ? (
        <motion.div variants={navItemVariants}>
          <SideSectionHeader
            title="Hot Topics"
            icon={Flame}
            sectionId="hot-topics"
            isExpanded={expandedSections.has('hot-topics')}
            isCollapsed={isCollapsed}
            mounted={mounted}
            toggleSection={toggleSection}
          />

          <AnimatePresence initial={false}>
            {expandedSections.has('hot-topics') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-2 overflow-hidden"
              >
                <Suspense fallback={<ComponentSkeleton height="h-16" />}>
                  <SideHotTopics
                    isCollapsed={isCollapsed}
                    mounted={mounted}
                  />
                </Suspense>
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

      {userPreferredCategories.length > 0 && (
        <motion.div variants={navItemVariants}>
          <Divider />
        </motion.div>
      )}
    </>
  );
};

export default SidebarSections;