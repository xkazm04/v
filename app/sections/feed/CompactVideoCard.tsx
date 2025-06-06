'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { VideoMetadata } from '@/app/types/video';

interface CompactVideoCardProps {
  video: VideoMetadata;
  priority?: boolean;
  index?: number;
}

const CompactVideoCard = ({ video, priority = false, index = 0 }: CompactVideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.25, 0, 1]
      }}
      className="group relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/watch?v=${video.id}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="relative p-4 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(30, 41, 59, 0.4) 0%,
                rgba(51, 65, 85, 0.6) 50%,
                rgba(30, 41, 59, 0.4) 100%
              )
            `,
            backdropFilter: 'blur(10px)',
            border: isHovered ? '1px solid rgba(148, 163, 184, 0.3)' : '1px solid rgba(71, 85, 105, 0.2)'
          }}
        >
          {/* Background Glow Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-2xl"
          />
          
          {/* Main Content */}
          <div className="relative flex gap-4">

{/*             
            <CompactVideoContent 
              video={video}
              isHovered={isHovered}
            /> */}
          </div>
          
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default CompactVideoCard;