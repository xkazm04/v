import { Profile } from '@/app/types/profile';
import { FloatingVerdictIcon } from '@/app/components/ui/Decorative/FloatingVerdictIcon';
import Image from 'next/image';
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  MapPin,
  User
} from 'lucide-react';

interface ProfileRowProps {
  profile: Profile;
  index: number;
}

const ProfileRow: React.FC<ProfileRowProps> = ({ profile, index }) => {
  const { colors, isDark, vintage, getCardColors } = useLayoutTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Convert profile score to status for display
  const getProfileStatus = (score?: number): 'clean' | 'mixed' | 'liar' => {
    if (!score) return 'mixed';
    if (score >= 80) return 'clean';
    if (score >= 40) return 'mixed';
    return 'liar';
  };

  const getStatusColor = (status: string, score?: number) => {
    const actualScore = score || 0;
    if (status === 'clean' || actualScore >= 80) return isDark ? 'text-green-400' : 'text-green-700';
    if (status === 'liar' || actualScore < 40) return isDark ? 'text-red-400' : 'text-red-700';
    return isDark ? 'text-yellow-400' : 'text-yellow-700';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'clean') return <CheckCircle className="w-4 h-4" />;
    if (status === 'liar') return <XCircle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getScoreBarColor = (score?: number) => {
    const actualScore = score || 0;
    if (actualScore >= 80) return isDark ? 'bg-green-500' : 'bg-green-600';
    if (actualScore >= 40) return isDark ? 'bg-yellow-500' : 'bg-yellow-600';
    return isDark ? 'bg-red-500' : 'bg-red-600';
  };

  const getVerdictStatus = (score?: number): 'TRUE' | 'FALSE' | 'MISLEADING' | 'PARTIALLY_TRUE' | 'UNVERIFIABLE' => {
    if (!score) return 'UNVERIFIABLE';
    if (score >= 80) return 'TRUE';
    if (score >= 60) return 'PARTIALLY_TRUE';
    if (score >= 40) return 'MISLEADING';
    return 'FALSE';
  };

  const cardColors = getCardColors(false, isHovered);
  const profileStatus = getProfileStatus(profile.score);
  const displayScore = Math.round(profile.score || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative overflow-hidden transition-all duration-300 cursor-pointer"
        style={{
          background: cardColors.background,
          border: cardColors.border,
          boxShadow: cardColors.shadow,
          borderRadius: '16px'
        }}
        onClick={() => setShowDetails(!showDetails)}
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Vintage paper texture for light mode */}
        {!isDark && (
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
                radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.015) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px, 40px 40px'
            }}
          />
        )}

        <div className="p-6 relative z-10">
          {/* Main Profile Row */}
          <div className="flex items-center justify-between">
            {/* Left: Avatar & Info */}
            <div className="flex items-center space-x-4 flex-1">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative"
              >
                <div className={`
                  w-16 h-16 rounded-full overflow-hidden ring-4 transition-all duration-300
                  ${isDark ? 'ring-purple-500/30' : 'ring-amber-500/30'}
                  ${isHovered ? 'ring-opacity-60' : 'ring-opacity-20'}
                `}>
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className={`w-full h-full flex items-center justify-center ${
                        isDark ? 'bg-slate-700' : 'bg-amber-100'
                      }`}
                    >
                      <User className={`w-8 h-8 ${isDark ? 'text-slate-400' : 'text-amber-600'}`} />
                    </div>
                  )}
                </div>
                
                {/* Status Badge */}
                <motion.div
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  className={`
                    absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center
                    ${getStatusColor(profileStatus, profile.score)}
                    ${isDark ? 'bg-slate-800' : 'bg-white'}
                    ring-2 ring-current ring-opacity-30
                  `}
                >
                  {getStatusIcon(profileStatus)}
                </motion.div>
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <motion.h3 
                    className={`
                      text-lg font-bold transition-colors duration-300
                      ${isDark ? 'text-white' : vintage.ink}
                      ${isHovered ? (isDark ? 'text-purple-300' : 'text-amber-700') : ''}
                    `}
                    style={{ fontFamily: '"Playfair Display", serif' }}
                    animate={{
                      x: isHovered ? 2 : 0
                    }}
                  >
                    {profile.name}
                  </motion.h3>
                </div>
                
                <p className={`
                  text-sm font-medium
                  ${isDark ? 'text-gray-300' : vintage.faded}
                `} style={{ fontFamily: '"Crimson Text", serif' }}>
                  {profile.position || profile.type || 'Public Figure'}
                </p>
                
                <div className="flex items-center space-x-4 mt-2">
                  {profile.party && (
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${isDark ? 'bg-slate-700 text-gray-300' : 'bg-amber-100 text-amber-800'}
                    `}>
                      {profile.party}
                    </span>
                  )}
                  
                  {profile.country && (
                    <span className={`
                      text-xs flex items-center space-x-1
                      ${isDark ? 'text-gray-400' : vintage.faded}
                    `}>
                      <MapPin className="w-3 h-3" />
                      <span>{profile.country.toUpperCase()}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Center: Score Display */}
            <div className="flex items-center space-x-6 px-6">
              {/* Credibility Score */}
              <div className="text-center min-w-[80px]">
                <motion.div
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  className={`
                    text-2xl font-bold
                    ${getStatusColor(profileStatus, profile.score)}
                  `}
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {displayScore}%
                </motion.div>
                <div className={`
                  w-16 h-1.5 rounded-full mx-auto mt-1
                  ${isDark ? 'bg-slate-700' : 'bg-amber-200'}
                `}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${displayScore}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                    className={`h-full rounded-full ${getScoreBarColor(profile.score)}`}
                  />
                </div>
                <div className={`
                  text-xs mt-1
                  ${isDark ? 'text-gray-400' : vintage.faded}
                `} style={{ fontFamily: '"Crimson Text", serif' }}>
                  Credibility
                </div>
              </div>
            </div>

            {/* Right: Status & Decorative Elements */}
            <div className="flex items-center space-x-4">
              {/* Floating Verdict Icon */}
              <FloatingVerdictIcon
                size="md"
                confidence={displayScore}
                showConfidenceRing={true}
                autoAnimate={isHovered}
                delay={index * 0.1}
              />
            </div>
          </div>
          {/* Vintage corner ornaments for light mode */}
          {!isDark && isHovered && (
            <>
              <div 
                className="absolute top-2 left-2 w-2 h-2 opacity-20"
                style={{
                  background: vintage.ink,
                  clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                }}
              />
              <div 
                className="absolute bottom-2 right-2 w-2 h-2 opacity-20"
                style={{
                  background: vintage.ink,
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
                background: isDark
                  ? `radial-gradient(circle at center, ${colors.primary}08, transparent 70%)`
                  : `radial-gradient(circle at center, rgba(184, 134, 11, 0.06), transparent 70%)`,
                borderRadius: '16px'
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

export default ProfileRow;