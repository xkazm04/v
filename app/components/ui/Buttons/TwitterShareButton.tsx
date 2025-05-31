'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { useTwitterShare } from '@/app/hooks/useTwitterShare';

interface TwitterShareButtonProps {
  url?: string;
  text?: string;
  hashtags?: string[];
  children?: React.ReactNode;
}


export const TwitterShareButton = memo(function TwitterShareButton({
  url,
  text = 'V',
  hashtags = [],
  children,
}: TwitterShareButtonProps) {
  const { shareOnTwitter } = useTwitterShare();

  const handleShare = () => {
    shareOnTwitter({
      url,
      text,
      hashtags
    });
  };

  return (
    <motion.button
      onClick={handleShare}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <svg
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      
      {children}
    </motion.button>
  );
});