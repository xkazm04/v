'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Profile } from '@/app/types/profile';
import { 
  MapPin,
} from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { countryMap } from '@/app/helpers/countries';
import DashRelScore from '@/app/components/ui/Dashboard/DashRelScore';

interface DashSpeakerProfileProps {
  profile: Profile;
  isLoading?: boolean;
}

// Country mapping for display
const getCountryInfo = (countryCode?: string) => {
  if (!countryCode) {
    return { flag: '🌍', name: 'International', code: 'INT' };
  }
  
  const country = countryMap[countryCode.toUpperCase()];
  return country 
    ? { ...country, code: countryCode.toUpperCase() }
    : { flag: '🌍', name: 'International', code: countryCode.toUpperCase() };
};

// Get default avatar if none provided
const getAvatarUrl = (profile: Profile) => {
  if (profile.avatar_url) {
    return profile.avatar_url;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random&color=fff&size=96&bold=true`;
};

const DashSpeakerProfile = ({ profile, isLoading = false }: DashSpeakerProfileProps) => {
  const { colors, isDark } = useLayoutTheme();
  const country = getCountryInfo(profile.country);
  const avatarUrl = getAvatarUrl(profile);

  const themeColors = {
    background: isDark
      ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.9) 100%)',
    border: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)',
    cardBackground: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(255, 255, 255, 0.6)',
    cardBorder: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(203, 213, 225, 0.4)',
    accent: colors.primary
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-3xl shadow-lg border backdrop-blur-sm p-8 overflow-hidden"
        style={{
          background: themeColors.background,
          borderColor: themeColors.border
        }}
      >
        <div className="animate-pulse space-y-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-1/3" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-muted rounded-2xl" />
            <div className="h-24 bg-muted rounded-2xl" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-3xl shadow-lg border backdrop-blur-sm p-8 overflow-hidden"
      style={{
        background: themeColors.background,
        borderColor: themeColors.border
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-gradient-to-br from-primary to-purple-500 transform -translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 transform translate-x-16 translate-y-16" />
        
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>      
      <div className="relative z-10">
        {/* Main Profile Section */}
        <div className="flex items-start gap-6 mb-8">
          <div className="relative">
            <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/50 dark:ring-gray-800/50">
              <Image
                src={avatarUrl}
                alt={profile.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials avatar if image fails
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=6366f1&color=fff&size=96&bold=true`;
                }}
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Name and basic info */}
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-3xl font-black text-foreground tracking-tight leading-tight">
                {profile.name}
              </h2>
            </div>
            
            {/* Party */}
            {profile.party && (
              <div className="space-y-1 mb-4">
                <p className="text-lg font-bold" style={{ color: themeColors.accent }}>
                  {profile.party}
                </p>
              </div>
            )}

            {/* Country Info */}
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
               {country.name}
              </span>
            </div>
            <DashRelScore
              score={90}
              />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashSpeakerProfile;