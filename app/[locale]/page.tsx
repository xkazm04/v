'use client';

import { Suspense, memo, use } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSimpleTranslations } from '../hooks/useSimpleTranslations';
import { Sidebar } from '../components/sidebar/sidebar';
import { FeaturedVideos } from '../sections/home/FeaturedVideos';
import { Divider } from '../components/ui/divider';
import FeedHeader from '../sections/feed/FeedHeader';
import LogoSectionDecor from '../components/ui/Decorative/LogoSectionDecor';
import { useTheme } from 'next-themes';
import { useViewport } from '../hooks/useViewport';

const SimpleSkeleton = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />
);

const FeaturedNews = dynamic(() => import('../sections/home/FeaturedNews'), {
  loading: () => <SimpleSkeleton />,
  ssr: false
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

const NewsBackground = memo(() => (
  <div 
    className="fixed inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `url('/background/news_bg_1.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  />
));

NewsBackground.displayName = 'NewsBackground';

type Props = {
  params: Promise<{ locale: string }>;
};

export default function LocalizedHome({ params }: Props) {
  const { locale } = use(params);
  const t = useSimpleTranslations(locale);
  const { isDesktop } = useViewport();
  const { theme } = useTheme();

  return (
    <>
      {theme !== 'dark' && <NewsBackground />}

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