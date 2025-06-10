'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Profile } from '@/app/types/profile';
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  MinusIcon,
  MapPin,
  Users,
  MessageSquare,
  Calendar,
  Globe
} from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface DashSpeakerProfileProps {
  profile: Profile;
  isLoading?: boolean;
}

// Country mapping for display
const getCountryInfo = (countryCode?: string) => {
  const countryMap: Record<string, { flag: string; name: string }> = {
    'US': { flag: '🇺🇸', name: 'United States' },
    'CA': { flag: '🇨🇦', name: 'Canada' },
    'GB': { flag: '🇬🇧', name: 'United Kingdom' },
    'DE': { flag: '🇩🇪', name: 'Germany' },
    'FR': { flag: '🇫🇷', name: 'France' },
    'IT': { flag: '🇮🇹', name: 'Italy' },
    'ES': { flag: '🇪🇸', name: 'Spain' },
    'AU': { flag: '🇦🇺', name: 'Australia' },
    'JP': { flag: '🇯🇵', name: 'Japan' },
    'CN': { flag: '🇨🇳', name: 'China' },
    'IN': { flag: '🇮🇳', name: 'India' },
    'BR': { flag: '🇧🇷', name: 'Brazil' },
    'MX': { flag: '🇲🇽', name: 'Mexico' },
    'RU': { flag: '🇷🇺', name: 'Russia' },
    'ZA': { flag: '🇿🇦', name: 'South Africa' },
  };
  
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
  
  // Generate a default avatar using initials
  const initials = profile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  // Using a simple avatar service (you can replace with your preferred service)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random&color=fff&size=96&bold=true`;
};

// Format date for display
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Unknown';
  }
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

      {/* Floating accent elements */}
      <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse" />
      <div className="absolute top-12 right-8 w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-300" />
      <div className="absolute top-8 right-16 w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-700" />
      
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
              <div className="flex items-center gap-1 rounded-full px-3 py-1 backdrop-blur-sm"
                   style={{
                     background: themeColors.cardBackground,
                     border: `1px solid ${themeColors.cardBorder}`
                   }}>
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Profile
                </span>
              </div>
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
                {country.flag} {country.name}
              </span>
              <span className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: `${themeColors.accent}20`,
                      color: themeColors.accent
                    }}>
                {country.code}
              </span>
            </div>

            {/* Creation Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Member since {formatDate(profile.created_at)}</span>
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative rounded-2xl p-6 border backdrop-blur-sm shadow-lg text-center overflow-hidden"
            style={{
              background: themeColors.cardBackground,
              borderColor: themeColors.cardBorder
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
            <div className="relative z-10">
              <MessageSquare className="h-6 w-6 mx-auto mb-2" style={{ color: themeColors.accent }} />
              <div className="text-3xl font-black text-foreground mb-1">
                {profile.total_statements || 0}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                Statements
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative rounded-2xl p-6 border backdrop-blur-sm shadow-lg text-center overflow-hidden"
            style={{
              background: themeColors.cardBackground,
              borderColor: themeColors.cardBorder
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10" />
            <div className="relative z-10">
              <Users className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
              <div className="text-3xl font-black text-foreground mb-1">
                --
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                Reliability
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Coming Soon
              </div>
            </div>
          </motion.div>
        </div>

        {/* Profile ID for debugging (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 rounded text-xs text-muted-foreground"
               style={{ background: themeColors.cardBackground }}>
            <strong>Profile ID:</strong> {profile.id}
            <br />
            <strong>Normalized Name:</strong> {profile.name_normalized}
            <br />
            <strong>Last Updated:</strong> {formatDate(profile.updated_at)}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashSpeakerProfile;