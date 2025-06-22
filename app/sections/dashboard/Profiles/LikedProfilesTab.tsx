'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Heart, Users, Star } from 'lucide-react';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';

const LikedProfilesTab: React.FC = () => {
  const { colors, isDark, vintage } = useLayoutTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <GlassContainer
        style={isDark ? 'crystal' : 'subtle'}
        border={isDark ? 'glow' : 'visible'}
        rounded="xl"
        shadow={isDark ? 'glow' : 'lg'}
        className="p-12"
      >
        {/* Vintage paper texture for light mode */}
        {!isDark && (
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none rounded-xl"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
                radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.015) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px, 40px 40px'
            }}
          />
        )}

        <div className="text-center space-y-6 relative z-10">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex justify-center"
          >
            <div className={`p-4 rounded-2xl ${
              isDark 
                ? `bg-gradient-to-br from-pink-600/20 to-red-600/20 border border-pink-500/30` 
                : `bg-gradient-to-br from-pink-100 to-red-100 border-2 border-pink-300/40`
            }`}>
              <Heart className={`w-12 h-12 ${
                isDark ? 'text-pink-400' : 'text-pink-600'
              }`} fill="currentColor" />
            </div>
          </motion.div>
          
          <h3 
            className="text-3xl font-bold"
            style={{ 
              color: isDark ? colors.foreground : vintage.ink,
              fontFamily: '"Playfair Display", serif'
            }}
          >
            Liked Profiles
          </h3>
          
          <p 
            className="max-w-md mx-auto leading-relaxed text-lg"
            style={{ 
              color: isDark ? colors.mutedForeground : vintage.faded,
              fontFamily: '"Crimson Text", serif'
            }}
          >
            Track your favorite public figures and get personalized updates on their fact-checking records.
          </p>

          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <Users className={`w-5 h-5 ${isDark ? colors.primary : '#b8860b'}`} />
              <span 
                className="font-medium"
                style={{ 
                  color: isDark ? colors.foreground : vintage.ink,
                  fontFamily: '"Crimson Text", serif'
                }}
              >
                Follow Profiles
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Star className={`w-5 h-5 ${isDark ? colors.primary : '#b8860b'}`} />
              <span 
                className="font-medium"
                style={{ 
                  color: isDark ? colors.foreground : vintage.ink,
                  fontFamily: '"Crimson Text", serif'
                }}
              >
                Get Updates
              </span>
            </div>
          </div>
          
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full mt-6"
            style={{
              background: isDark 
                ? `${colors.primary}15`
                : `linear-gradient(135deg, #b8860b15, #b8860b08)`,
              border: isDark 
                ? `1px solid ${colors.primary}30`
                : '1px solid rgba(184, 134, 11, 0.25)',
              color: isDark ? colors.primary : '#b8860b'
            }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm font-medium">🚀 Coming Soon</span>
          </motion.div>
        </div>
      </GlassContainer>
    </motion.div>
  );
};

export default LikedProfilesTab;