'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { NewsArticle } from '@/app/types/article';
import { FakeStamp } from '../icons/stamps';

interface NewsCardHeaderProps {
  article: NewsArticle;
  layout: 'grid' | 'compact';
  isHovered: boolean;
}

const headerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export const NewsCardHeader = memo(function NewsCardHeader({
  article,
  layout,
  isHovered
}: NewsCardHeaderProps) {
  const isCompact = layout === 'compact';
  const isBreaking = article.isBreaking;
  const isRecent = Date.now() - new Date(article.publishedAt).getTime() < 3600000; // 1 hour
  
  return (
    <>
      {/* Fake Badge - positioned outside card boundaries */}
      {isBreaking && (
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-0 -right-5 z-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            className=""
          >
            <FakeStamp width={100} height={30} color={'#d11919'}/>
          </motion.div>
        </motion.div>
      )}
      
      {/* NEW Badge - positioned within card boundaries */}
      {isRecent && !isBreaking && (
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-2 right-2 z-20"
        >
          <div className="
            px-2 py-1 rounded-full text-xs font-semibold
            bg-gradient-to-r from-blue-500/90 to-indigo-500/90
            text-white shadow-sm
          ">
            NEW
          </div>
        </motion.div>
      )}
    </>
  );
});