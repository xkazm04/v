'use client';

import { motion } from 'framer-motion';
import { Play, Video } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { contentVariants, iconVariants, placeholderVariants } from '../animations/variants/placeholderVariants';

interface VideoThumbnailPlaceholderProps {
  title: string;
  source: string;
  className?: string;
}

export function VideoThumbnailPlaceholder({ title, source, className }: VideoThumbnailPlaceholderProps) {
  const { colors, mounted, isDark } = useLayoutTheme();

  const getSourceColors = (source: string) => {
    const baseColors = {
      youtube: {
        from: isDark ? '#ef4444' : '#dc2626',
        to: isDark ? '#dc2626' : '#b91c1c'
      },
      tiktok: {
        from: isDark ? '#a855f7' : '#9333ea',
        to: isDark ? '#ec4899' : '#db2777'
      },
      twitter: {
        from: isDark ? '#60a5fa' : '#3b82f6',
        to: isDark ? '#3b82f6' : '#2563eb'
      },
      facebook: {
        from: isDark ? '#3b82f6' : '#2563eb',
        to: isDark ? '#1d4ed8' : '#1e40af'
      },
      instagram: {
        from: isDark ? '#ec4899' : '#db2777',
        to: isDark ? '#a855f7' : '#9333ea'
      },
      default: {
        from: colors.primary,
        to: colors.secondary
      }
    };
    
    return baseColors[source.toLowerCase() as keyof typeof baseColors] || baseColors.default;
  };

  if (!mounted) {
    return null;
  }

  const sourceColors = getSourceColors(source);

  return (
    <motion.div 
      className={cn("relative overflow-hidden rounded-xl", className)}
      style={{
        background: `linear-gradient(135deg, ${sourceColors.from}, ${sourceColors.to})`
      }}
      variants={placeholderVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.background}20 0%, transparent 50%)`
          }}
        />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${colors.background} 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* Animated Background Shapes */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle at 20% 20%, ${colors.primary}20 0%, transparent 50%)`,
            `radial-gradient(circle at 80% 80%, ${colors.accent}20 0%, transparent 50%)`,
            `radial-gradient(circle at 20% 20%, ${colors.primary}20 0%, transparent 50%)`
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-white">
        <motion.div
          variants={contentVariants}
          className="flex flex-col items-center gap-3"
        >
          {/* Video Icon */}
          <motion.div
            variants={iconVariants}
            className="w-16 h-16 rounded-full flex items-center justify-center border backdrop-blur-sm"
            style={{
              backgroundColor: `${colors.background}20`,
              borderColor: `${colors.background}30`
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Video className="w-8 h-8" />
          </motion.div>
          
          {/* Title */}
          <motion.h3 
            className="text-sm font-semibold text-center line-clamp-2 leading-tight"
            variants={contentVariants}
          >
            {title}
          </motion.h3>
          
          {/* Source Badge */}
          <motion.div 
            className="px-3 py-1 rounded-full border backdrop-blur-sm"
            style={{
              backgroundColor: `${colors.background}20`,
              borderColor: `${colors.background}30`
            }}
            variants={contentVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-xs font-medium capitalize">
              {source}
            </span>
          </motion.div>
        </motion.div>

        {/* Play Button Overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]"
          style={{ backgroundColor: `${colors.background}20` }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div 
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border backdrop-blur-sm"
            style={{
              backgroundColor: `${colors.background}90`,
              borderColor: `${colors.border}20`,
              color: colors.foreground
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Play className="w-6 h-6 ml-1" fill="currentColor" />
          </motion.div>
        </motion.div>
      </div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(45deg, transparent 30%, ${colors.background}40 50%, transparent 70%)`
        }}
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 3
        }}
      />
    </motion.div>
  );
}