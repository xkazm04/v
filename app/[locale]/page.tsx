'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Sidebar } from '../components/sidebar/sidebar';
import { FeaturedVideos } from '../sections/home/FeaturedVideos';
import { Divider } from '../components/ui/divider';
import FeedHeader from '../sections/feed/FeedHeader';
import LogoSectionDecor from '../components/ui/Decorative/LogoSectionDecor';
import { useViewport } from '../hooks/useViewport';
import { containerVariants, itemVariants } from '../components/animations/variants/votingVariants';
import BackgroundPattern from '../components/ui/Decorative/BackgroundPattern';

const SimpleSkeleton = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />
);

const FeaturedNews = dynamic(() => import('../sections/home/FeaturedNews'), {
  loading: () => <SimpleSkeleton />,
  ssr: false
});


type Props = {
  params: Promise<{ locale: string }>;
};

export default function LocalizedHome({ params }: Props) {
  const { isDesktop } = useViewport();

  return (
    <>
      <BackgroundPattern />

      <motion.div 
        className="flex relative min-h-screen overflow-y-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="shrink-0" variants={itemVariants}>
          <Sidebar />
        </motion.div>

        <motion.div className="flex-1 relative" variants={itemVariants}>
          <div className="mb-8 px-8">
            <Suspense fallback={<></>}>
              <FeedHeader />
            </Suspense>
          </div>
          
          {isDesktop && (
            <div className="mb-8 px-8">
              <Suspense fallback={<></>}>
                <FeaturedVideos />
              </Suspense>
            </div>
          )}

          <div className="my-8">
            <Divider />
          </div>

          <div className="pb-8 mb-20 px-8">
            <Suspense fallback={<></>}>
              <FeaturedNews />
            </Suspense>
          </div>
        </motion.div>
        
        <LogoSectionDecor condition={true} />
      </motion.div>
    </>
  );
}