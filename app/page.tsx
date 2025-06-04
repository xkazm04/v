'use client';
import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/app/components/sidebar/sidebar';
import { FeaturedVideos } from '@/app/sections/home/FeaturedVideos';
import { Divider } from './components/ui/divider';
import FeedHeader from './sections/feed/FeedHeader';
import { FilterLayout } from './components/filters/FilterLayout';
import { FeaturedNewsSkeleton, FeaturedVideosSkeleton, FeedHeaderSkeleton, FilterLayoutSkeleton } from './components/ui/Skeletons/FeedSkeletons';
import LogoSectionDecor from './components/ui/Decorative/LogoSectionDecor';
import SidebarSkeleton from './components/ui/Skeletons/SidebarSkeleton';
import { containerVariants, sectionVariants, staggeredSectionVariants } from './components/animations/variants/feedVariants';
import AnimatedSection from './components/animations/AnimatedSection';
import { FirstTimeUserModal } from './sections/onboarding/FirstTimeUserModal';
import { useOnboarding } from './hooks/use-onboarding';

// Dynamic imports with loading components for code splitting
const FeaturedNews = dynamic(() => import('./sections/home/FeaturedNews'), {
  loading: () => <FeaturedNewsSkeleton />,
  ssr: false
});

function useProgressiveLoad() {
  const [loadedSections, setLoadedSections] = useState({
    sidebar: false,
    filters: false,
    header: false,
    videos: false,
    news: false,
    background: false
  });

  useEffect(() => {
    // Immediate load for critical above-fold content
    const immediateLoad = () => {
      setLoadedSections(prev => ({ ...prev, sidebar: true }));
      
      // Stagger subsequent loads for smooth UX
      setTimeout(() => setLoadedSections(prev => ({ ...prev, filters: true })), 100);
      setTimeout(() => setLoadedSections(prev => ({ ...prev, header: true })), 200);
      setTimeout(() => setLoadedSections(prev => ({ ...prev, videos: true })), 350);
      setTimeout(() => setLoadedSections(prev => ({ ...prev, news: true })), 500);
      setTimeout(() => setLoadedSections(prev => ({ ...prev, background: true })), 800);
    };

    // Use requestIdleCallback for non-critical loads
    if ('requestIdleCallback' in window) {
      requestIdleCallback(immediateLoad);
    } else {
      setTimeout(immediateLoad, 0);
    }
  }, []);

  return loadedSections;
}

export default function Home() {
  const loadedSections = useProgressiveLoad();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const { hasCompletedOnboarding, isLoading, completeOnboarding, skipOnboarding } = useOnboarding();

  useEffect(() => {
    // Mark page as fully loaded for final animations
    const timer = setTimeout(() => setIsPageLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking onboarding status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* First Time User Modal */}
      <FirstTimeUserModal
        isOpen={!hasCompletedOnboarding}
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
      />
      {/* Main Application */}
      <motion.div 
        className="flex relative min-h-screen"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Sidebar with immediate load */}
        <AnimatedSection
          className="shrink-0"
          variants={sectionVariants}
          threshold={0}
          once={true}
        >
          <Suspense fallback={<SidebarSkeleton />}>
            {loadedSections.sidebar && <Sidebar />}
          </Suspense>
        </AnimatedSection>

        {/* Main content area */}
        <motion.div 
          className="flex-1 relative overflow-hidden"
          variants={sectionVariants}
        >
          {/* Filter Layout */}
          <AnimatedSection 
            className="mb-6"
            variants={staggeredSectionVariants}
            threshold={0.1}
          >
            <Suspense fallback={<FilterLayoutSkeleton />}>
              {loadedSections.filters ? <FilterLayout /> : <FilterLayoutSkeleton />}
            </Suspense>
          </AnimatedSection>

          {/* Feed Header */}
          <AnimatedSection 
            className="mb-6 px-4"
            variants={staggeredSectionVariants}
            threshold={0.2}
          >
            <Suspense fallback={<FeedHeaderSkeleton />}>
              {loadedSections.header ? <FeedHeader /> : <FeedHeaderSkeleton />}
            </Suspense>
          </AnimatedSection>

          {/* Featured Videos */}
          <AnimatedSection 
            className="mb-8 px-8"
            variants={staggeredSectionVariants}
            threshold={0.1}
            rootMargin="100px"
          >
            <Suspense fallback={<FeaturedVideosSkeleton />}>
              {loadedSections.videos ? <FeaturedVideos /> : <FeaturedVideosSkeleton />}
            </Suspense>
          </AnimatedSection>

          {/* Animated Divider */}
          <AnimatedSection 
            className="my-8"
            variants={{
              hidden: { scaleX: 0, opacity: 0 },
              visible: { 
                scaleX: 1, 
                opacity: 1,
                transition: { 
                  duration: 0.6, 
                  ease: "easeInOut",
                  type: "spring",
                  stiffness: 100
                }
              }
            }}
            threshold={0.5}
          >
            <Divider />
          </AnimatedSection>

          {/* Featured News with lazy loading */}
          <AnimatedSection 
            className="mb-8 px-8"
            variants={staggeredSectionVariants}
            threshold={0.1}
            rootMargin="150px"
          >
            <Suspense fallback={<FeaturedNewsSkeleton />}>
              {loadedSections.news && <FeaturedNews />}
            </Suspense>
          </AnimatedSection>
        </motion.div>

        {/* Background Logo with enhanced animation */}
        <LogoSectionDecor condition={loadedSections.background} />

        {/* Loading Progress Indicator */}
        <AnimatePresence>
          {!isPageLoaded && hasCompletedOnboarding && (
            <motion.div
              className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 z-50"
              initial={{ scaleX: 0, transformOrigin: "left" }}
              animate={{ 
                scaleX: Object.values(loadedSections).filter(Boolean).length / Object.keys(loadedSections).length 
              }}
              exit={{ 
                scaleX: 1,
                transition: { duration: 0.3 }
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Page transition overlay */}
        <motion.div
          className="fixed inset-0 bg-background z-40 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </motion.div>
    </>
  );
}
