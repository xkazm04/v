'use client';

import { Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/app/components/sidebar/sidebar';
import { FeaturedVideos } from '@/app/sections/home/FeaturedVideos';
import { Divider } from './components/ui/divider';
import FeedHeader from './sections/feed/Daily/FeedHeader';
import LogoSectionDecor from './components/ui/Decorative/LogoSectionDecor';
import { FirstTimeUserModal } from './sections/onboarding/FirstTimeUserModal';
import { useOnboarding } from './hooks/use-onboarding';
import { useViewport } from './hooks/useViewport';
import { containerVariants, itemVariants } from './components/animations/variants/votingVariants';
import BackgroundPattern from './components/ui/Decorative/BackgroundPattern';
import LoaderComponent from './components/animations/LoaderComponent';

const FeaturedNews = dynamic(() => import('./sections/home/FeaturedNews'), {
  loading: () => <LoaderComponent
    loading={true}
    variant="default"
    speedMultiplier={1.2}
  />,
  ssr: false
});


export default function Home() {
  const { hasCompletedOnboarding, isLoading, completeOnboarding, skipOnboarding } = useOnboarding();
  const { isDesktop } = useViewport();

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      // Disable body scroll when modal is open
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [hasCompletedOnboarding]);


  if (!isLoading) return (
    <>
      <BackgroundPattern />
      <FirstTimeUserModal
        isOpen={!hasCompletedOnboarding}
        //@ts-expect-error Ignore
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
      />

      {/* Main Content */}
      <motion.div
        className={`flex relative min-h-screen ${
          // FIXED: Only hide overflow when modal is closed
          hasCompletedOnboarding ? 'overflow-y-auto' : 'overflow-y-hidden'
          }`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Sidebar */}
        <motion.div className="shrink-0" variants={itemVariants}>
          <Sidebar />
        </motion.div>

        {/* Main Content */}
        <motion.div className="flex-1 relative" variants={itemVariants}>
          <div className="mb-8 px-8">
            <Suspense fallback={<></>}>
              <FeedHeader />
            </Suspense>
          </div>

          {/* Divider */}
          <div className="my-8">
            <Divider />
          </div>

          {/* Featured News */}
          <div className="pb-8 mb-20 px-8">
            <Suspense fallback={<></>}>
              <FeaturedNews
                limit={10}
                showBreaking={false}
                autoRefresh={true}
              />
            </Suspense>
          </div>
          {isDesktop && <div className="mb-8 px-8">
            <Suspense fallback={<>
              <LoaderComponent
                loading={true}
                variant="default"
                speedMultiplier={1.2}
              /></>}>
              <FeaturedVideos />
            </Suspense>
          </div>}
        </motion.div>
        {/* Background Logo */}
        <LogoSectionDecor condition={true} />
      </motion.div>
    </>
  );
}