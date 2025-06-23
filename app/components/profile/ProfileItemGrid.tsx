'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Profile } from '@/app/types/profile';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import Image from 'next/image';
import { 
  MapPin, 
  User, 
} from 'lucide-react';
import ScoreVerdictIcon from './ScoreVerdictIcon';
import DashProgressBar from '@/app/components/ui/Dashboard/DashProgressBar';
import { getScoreColor, getStatusIcon, getTrendIcon } from '@/app/helpers/scoreColors';
import { 
  AVAILABLE_COUNTRIES 
} from '@/app/helpers/countries';

interface ProfileItemGridProps {
  profile: Profile;
  index: number;
}

const ProfileItemGrid: React.FC<ProfileItemGridProps> = ({ profile, index }) => {
  const { colors, isDark, vintage, getCardColors } = useLayoutTheme();
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const displayScore = Math.round(profile.score || 0);
  const scoreColors = getScoreColor(displayScore);
  const cardColors = getCardColors(false, isHovered);

  // ✅ Enhanced country code resolution using existing helpers
  const getResolvedCountryInfo = (country: string | undefined) => {
    if (!country) {
      return {
        code: '',
        flagSvg: null,
        flagEmoji: '🌍',
        displayName: 'Unknown',
        isValid: false
      };
    }

    const normalizedCountry = country.toLowerCase().trim();
    
    // Try to find exact match first
    let matchedCountry = AVAILABLE_COUNTRIES.find(c => 
      c.code.toLowerCase() === normalizedCountry ||
      c.name.toLowerCase() === normalizedCountry ||
      c.nativeName.toLowerCase() === normalizedCountry
    );

    if (matchedCountry) {
      return {
        code: matchedCountry.code,
        flagSvg: matchedCountry.flagSvg,
        flagEmoji: matchedCountry.flag,
        displayName: matchedCountry.name,
        isValid: true
      };
    }

    // Fallback for unknown countries
    return {
      code: normalizedCountry.toUpperCase(),
      flagSvg: null,
      flagEmoji: '🌍',
      displayName: country.charAt(0).toUpperCase() + country.slice(1),
      isValid: false
    };
  };

  const handleCardClick = () => {
    router.push(`/dashboard/${profile.id}`);
  };

  // ✅ Use enhanced country resolution
  const countryInfo = getResolvedCountryInfo(profile.country);

  console.log('Country resolution:', {
    input: profile.country,
    resolved: countryInfo
  });

  const itemVariants: Variants = {
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
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative overflow-hidden transition-all duration-300 cursor-pointer"
        style={{
          background: cardColors.background,
          border: cardColors.border,
          boxShadow: cardColors.shadow,
          borderRadius: '20px'
        }}
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCardClick}
      >
        {/* ✅ Enhanced Flag Background with proper fallback */}
        {countryInfo.flagSvg && (
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <Image
              src={countryInfo.flagSvg}
              alt={`${countryInfo.displayName} flag`}
              fill
              className="object-cover"
              style={{
                objectPosition: 'center',
                borderRadius: '20px'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                console.warn(`Flag image failed to load: ${countryInfo.flagSvg}`);
              }}
            />
          </div>
        )}

        {/* Vintage paper texture for light mode */}
        {!isDark && (
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
                radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.015) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px, 25px 25px',
              borderRadius: '20px'
            }}
          />
        )}

        <div className="p-2 relative z-10">
          {/* Header with Enhanced Verdict Icon */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* ✅ Enhanced Country Badge with better flag handling */}
              {profile.country && (
                <motion.div
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-2"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.1)' : vintage.highlight,
                    color: isDark ? colors.mutedForeground : vintage.ink,
                    border: isDark ? '1px solid rgba(255,255,255,0.2)' : `1px solid ${vintage.aged}`
                  }}
                  whileHover={{ scale: 1.05 }}
                  title={`${countryInfo.displayName} ${countryInfo.isValid ? '(Verified)' : '(Unverified)'}`}
                >
                  {/* ✅ Enhanced flag display with fallback */}
                  {countryInfo.flagSvg ? (
                    <div className="w-3 h-3 rounded-sm overflow-hidden flex-shrink-0">
                      <Image
                        src={countryInfo.flagSvg}
                        alt={`${countryInfo.displayName} flag`}
                        width={12}
                        height={12}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // Fallback to emoji or icon
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = countryInfo.flagEmoji || '🌍';
                            parent.className = 'w-3 h-3 flex items-center justify-center text-xs';
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-3 h-3 flex items-center justify-center text-xs">
                      {countryInfo.flagEmoji || <MapPin className="w-3 h-3" />}
                    </div>
                  )}
                  
                  {/* ✅ Enhanced country display */}
                  <span className="truncate max-w-16">
                    {countryInfo.code || profile.country.toUpperCase()}
                  </span>
                  
                  {/* ✅ Verification indicator for known countries */}
                  {countryInfo.isValid && (
                    <div 
                      className="w-1 h-1 rounded-full bg-green-500 flex-shrink-0"
                      title="Verified country"
                    />
                  )}
                </motion.div>
              )}
            </div>

            {/* Enhanced Verdict Icon with Score Colors */}
            <ScoreVerdictIcon
              scoreColors={scoreColors}
              displayScore={displayScore}
              index={index}
            />
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-4">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div 
                className="w-40 h-40 rounded-2xl overflow-hidden transition-all duration-300"
              >
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ 
                      background: isDark ? 'rgba(255,255,255,0.1)' : vintage.highlight
                    }}
                  >
                    <User className={`w-10 h-10 ${isDark ? 'text-slate-400' : 'text-amber-600'}`} />
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <motion.div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm border-2"
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
            </motion.div>
          </div>

          {/* Profile Info */}
          <div className="text-center space-y-2">
            <motion.h3 
              className="text-lg font-bold leading-tight"
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

            <div 
              className="text-sm font-medium leading-tight"
              style={{ 
                color: isDark ? colors.mutedForeground : vintage.faded,
                fontFamily: '"Crimson Text", serif'
              }}
            >
              {profile.position || profile.type || 'Public Figure'}
            </div>
          </div>

          {/* Enhanced Score Bar at Bottom */}
          <div className="mt-4 pt-3 border-t border-opacity-20" style={{
            borderColor: isDark ? '#374151' : vintage.aged
          }}>
            <div className="flex items-center justify-between mb-2">
              <span 
                className="text-xs font-medium"
                style={{ 
                  color: isDark ? colors.mutedForeground : vintage.faded,
                  fontFamily: '"Crimson Text", serif'
                }}
              >
                In Last month
              </span>
              
              <div className="flex items-center gap-1" style={{ color: scoreColors.primary }}>
                {getTrendIcon(displayScore)}
                <span 
                  className="text-sm font-bold"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {displayScore}%
                </span>
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <DashProgressBar
              value={displayScore}
              color={scoreColors.primary}
              isDark={isDark}
              size="md"
              animated={true}
              showValue={false}
              delay={index * 0.05 + 0.6}
              className="mb-1"
            />
          </div>

          {/* Vintage corner ornaments for light mode */}
          {!isDark && isHovered && (
            <>
              <div 
                className="absolute top-3 left-3 w-3 h-3 opacity-20"
                style={{
                  background: scoreColors.primary,
                  clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                }}
              />
              <div 
                className="absolute bottom-3 right-3 w-3 h-3 opacity-20"
                style={{
                  background: scoreColors.primary,
                  clipPath: 'polygon(100% 100%, 0 100%, 100% 0)'
                }}
              />
            </>
          )}
        </div>

        {/* Enhanced Hover Effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${scoreColors.background}, transparent 70%)`,
                borderRadius: '20px'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ProfileItemGrid;