'use client';

import { motion } from 'framer-motion';
import { Play, Video } from 'lucide-react';

interface VideoThumbnailPlaceholderProps {
  title: string;
  source: string;
  className?: string;
}

export function VideoThumbnailPlaceholder({ title, source, className }: VideoThumbnailPlaceholderProps) {
  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'youtube':
        return 'from-red-500 to-red-600';
      case 'tiktok':
        return 'from-purple-500 to-pink-500';
      case 'twitter':
        return 'from-blue-400 to-blue-500';
      case 'facebook':
        return 'from-blue-600 to-blue-700';
      case 'instagram':
        return 'from-pink-500 to-purple-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${getSourceColor(source)} ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-3"
        >
          {/* Video Icon */}
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Video className="w-8 h-8" />
          </div>
          
          {/* Title */}
          <h3 className="text-sm font-semibold text-center line-clamp-2 leading-tight">
            {title}
          </h3>
          
          {/* Source Badge */}
          <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
            <span className="text-xs font-medium capitalize">
              {source}
            </span>
          </div>
        </motion.div>

        {/* Play Button Overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[1px]"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl border border-white/20 backdrop-blur-sm">
            <Play className="w-6 h-6 ml-1 text-slate-700" fill="currentColor" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}