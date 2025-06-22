'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Profile } from '@/app/types/profile';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import Image from 'next/image';
import { 
  User, 
  MapPin,
  Star,
} from 'lucide-react';
import { getScoreColor, getStatusIcon, getTrendIcon } from '@/app/helpers/scoreColors';

interface ProfileItemListProps {
  profile: Profile;
  index: number;
}

const ProfileItemList: React.FC<ProfileItemListProps> = ({ profile, index }) => {
  const { colors, isDark, vintage, getCardColors } = useLayoutTheme();
  const [isHovered, setIsHovered] = useState(false);

  const displayScore = Math.round(profile.score || 0);
  const scoreColors = getScoreColor(displayScore);
  const cardColors = getCardColors(false, isHovered);

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative overflow-hidden transition-all duration-300 cursor-pointer p-4 rounded-xl"
        style={{
          background: cardColors.background,
          border: cardColors.border,
          boxShadow: cardColors.shadow
        }}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Vintage paper texture for light mode */}
        {!isDark && (
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none rounded-xl"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
                radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.015) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px, 25px 25px'
            }}
          />
        )}

        <div className="flex items-center justify-between relative z-10">
          {/* Left: Avatar & Info */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Avatar */}
            <div className="relative">
              <motion.div 
                className="w-14 h-14 rounded-full overflow-hidden ring-2 transition-all duration-300"
                style={{ ringColor: scoreColors.secondary }}
                whileHover={{ scale: 1.05 }}
              >
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ 
                      background: isDark ? 'rgba(255,255,255,0.1)' : vintage.highlight
                    }}
                  >
                    <User className={`w-7 h-7 ${isDark ? 'text-slate-400' : 'text-amber-600'}`} />
                  </div>
                )}
              </motion.div>

              {/* Status Badge */}
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center backdrop-blur-sm border"
                style={{ 
                  background: scoreColors.background,
                  color: scoreColors.primary,
                  borderColor: scoreColors.primary
                }}
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {getStatusIcon(displayScore)}
              </motion.div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <motion.h3 
                  className="font-bold text-base truncate"
                  style={{ 
                    color: isDark ? colors.foreground : vintage.ink,
                    fontFamily: '"Playfair Display", serif'
                  }}
                  animate={{
                    color: isHovered 
                      ? scoreColors.primary 
                      : (isDark ? colors.foreground : vintage.ink)
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {profile.name}
                </motion.h3>

                {/* Country Badge */}
                {profile.country && (
                  <motion.div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.08)' : vintage.highlight,
                      color: isDark ? colors.mutedForeground : vintage.ink,
                      border: isDark ? '1px solid rgba(255,255,255,0.15)' : `1px solid ${vintage.aged}`
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{profile.country.toUpperCase()}</span>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <p 
                  className="text-sm font-medium truncate"
                  style={{ 
                    color: isDark ? colors.mutedForeground : vintage.faded,
                    fontFamily: '"Crimson Text", serif'
                  }}
                >
                  {profile.position || profile.type || 'Public Figure'}
                </p>

                {/* Party Badge */}
                {profile.party && (
                  <motion.div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.05)' : vintage.paper,
                      color: isDark ? colors.mutedForeground : vintage.ink,
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${vintage.aged}`
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Star className="w-2.5 h-2.5" />
                    <span className="truncate max-w-20">{profile.party}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Score Display */}
          <div className="flex items-center space-x-4 ml-4">
            {/* Score Percentage */}
            <div className="text-center min-w-0">
              <motion.div 
                className="text-xl font-bold"
                style={{ 
                  color: scoreColors.primary,
                  fontFamily: '"Playfair Display", serif'
                }}
                animate={{ scale: isHovered ? 1.05 : 1 }}
              >
                {displayScore}%
              </motion.div>
              
              {/* Progress Bar */}
              <div 
                className="w-16 h-1.5 rounded-full mt-1"
                style={{ background: scoreColors.secondary }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${displayScore}%` }}
                  transition={{ 
                    delay: index * 0.05 + 0.3, 
                    duration: 0.8,
                    ease: "easeOut"
                  }}
                  className="h-full rounded-full relative overflow-hidden"
                  style={{ background: scoreColors.primary }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 opacity-60"
                    style={{
                      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)`
                    }}
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.05 + 1,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </div>

              {/* Credibility Label */}
              <div 
                className="text-xs mt-1 font-medium"
                style={{ 
                  color: isDark ? colors.mutedForeground : vintage.faded,
                  fontFamily: '"Crimson Text", serif'
                }}
              >
                Credibility
              </div>
            </div>

            {/* Trend & Status Icons */}
            <div className="flex flex-col items-center space-y-1">
              <motion.div 
                style={{ color: scoreColors.primary }}
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {getTrendIcon(displayScore)}
              </motion.div>
              
              <motion.div 
                style={{ color: scoreColors.primary }}
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {getStatusIcon(displayScore)}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Enhanced Hover Effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              background: `radial-gradient(circle at center, ${scoreColors.background}, transparent 70%)`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Vintage corner ornaments for light mode */}
        {!isDark && isHovered && (
          <>
            <div 
              className="absolute top-2 left-2 w-2 h-2 opacity-20"
              style={{
                background: scoreColors.primary,
                clipPath: 'polygon(0 0, 100% 0, 0 100%)'
              }}
            />
            <div 
              className="absolute bottom-2 right-2 w-2 h-2 opacity-20"
              style={{
                background: scoreColors.primary,
                clipPath: 'polygon(100% 100%, 0 100%, 100% 0)'
              }}
            />
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProfileItemList;