import { profiles_speakers } from "@/app/constants/speakers";
import { FloatingVerdictIcon } from '@/app/components/ui/Decorative/FloatingVerdictIcon';
import { VintageVerdictStamp } from '@/app/components/news/VintageVerdictStamp';
import Image from 'next/image';
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassContainer } from "@/app/components/ui/containers/GlassContainer";
import { BarChart3, CheckCircle, AlertTriangle, XCircle, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { Target, Users, Star, Trophy } from 'lucide-react';
import ProfileStatCard from "./ProfileStatCard";

type Speaker = typeof profiles_speakers[0];

interface SpeakerRowProps {
  speaker: Speaker;
  index: number;
}

const ProfilesRow: React.FC<SpeakerRowProps> = ({ speaker, index }) => {
  const { isDark, vintage } = useLayoutTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string, truthScore: number) => {
    if (status === 'clean') return isDark ? 'text-green-400' : 'text-green-700';
    if (status === 'liar') return isDark ? 'text-red-400' : 'text-red-700';
    return isDark ? 'text-yellow-400' : 'text-yellow-700';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'clean') return <CheckCircle className="w-4 h-4" />;
    if (status === 'liar') return <XCircle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <BarChart3 className="w-4 h-4 text-blue-500" />;
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return isDark ? 'bg-green-500' : 'bg-green-600';
    if (score >= 60) return isDark ? 'bg-yellow-500' : 'bg-yellow-600';
    return isDark ? 'bg-red-500' : 'bg-red-600';
  };

  // ✅ FIX: Convert speaker status to VintageVerdictStamp status
  const getVerdictStatus = (monthlyStatus: string): 'TRUE' | 'FALSE' | 'MISLEADING' | 'PARTIALLY_TRUE' | 'UNVERIFIABLE' => {
    switch(monthlyStatus) {
      case 'clean': return 'TRUE';
      case 'liar': return 'FALSE';
      case 'mixed': return 'PARTIALLY_TRUE';
      default: return 'UNVERIFIABLE';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GlassContainer
        style={isDark ? 'crystal' : 'subtle'}
        border={isDark ? 'glow' : 'visible'}
        rounded="xl"
        shadow={isDark ? 'glow' : 'lg'}
        className={`
          transition-all duration-300 cursor-pointer
          ${isHovered ? 'scale-[1.02] shadow-2xl' : ''}
          ${isDark ? 
            'bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-purple-500/20' : 
            'bg-gradient-to-r from-white/50 to-amber-50/50 border-amber-200/30'
          }
        `}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="p-6">
          {/* Main Speaker Row */}
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
                  <Image
                    src={speaker.avatar}
                    alt={speaker.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Status Badge */}
                <motion.div
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  className={`
                    absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center
                    ${getStatusColor(speaker.monthlyStatus, speaker.truthScore)}
                    ${isDark ? 'bg-slate-800' : 'bg-white'}
                    ring-2 ring-current ring-opacity-30
                  `}
                >
                  {getStatusIcon(speaker.monthlyStatus)}
                </motion.div>
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className={`
                    text-lg font-bold transition-colors duration-300
                    ${isDark ? 'text-white' : vintage.ink}
                    ${isHovered ? (isDark ? 'text-purple-300' : 'text-amber-700') : ''}
                  `}>
                    {speaker.name}
                  </h3>
                  {getTrendIcon(speaker.trend)}
                </div>
                
                <p className={`
                  text-sm font-medium
                  ${isDark ? 'text-gray-300' : vintage.faded}
                `}>
                  {speaker.position}
                </p>
                
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${isDark ? 'bg-slate-700 text-gray-300' : 'bg-amber-100 text-amber-800'}
                  `}>
                    {speaker.category}
                  </span>
                  
                  <span className={`
                    text-xs flex items-center space-x-1
                    ${isDark ? 'text-gray-400' : vintage.faded}
                  `}>
                    <Clock className="w-3 h-3" />
                    <span>{speaker.recentActivity}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Stats */}
            <div className="flex items-center space-x-6 px-6">
              {/* Monthly Statements */}
              <div className="text-center">
                <motion.div
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  className={`
                    text-2xl font-bold
                    ${isDark ? 'text-blue-400' : 'text-amber-700'}
                  `}
                >
                  {speaker.monthlyStatements}
                </motion.div>
                <div className={`
                  text-xs
                  ${isDark ? 'text-gray-400' : vintage.faded}
                `}>
                  Statements
                </div>
              </div>

              {/* Truth Score with Progress Bar */}
              <div className="text-center min-w-[80px]">
                <motion.div
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  className={`
                    text-2xl font-bold
                    ${getStatusColor(speaker.monthlyStatus, speaker.truthScore)}
                  `}
                >
                  {speaker.truthScore}%
                </motion.div>
                <div className={`
                  w-16 h-1.5 rounded-full mx-auto mt-1
                  ${isDark ? 'bg-slate-700' : 'bg-amber-200'}
                `}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${speaker.truthScore}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                    className={`h-full rounded-full ${getScoreBarColor(speaker.truthScore)}`}
                  />
                </div>
                <div className={`
                  text-xs mt-1
                  ${isDark ? 'text-gray-400' : vintage.faded}
                `}>
                  Truth Score
                </div>
              </div>
            </div>

            {/* Right: Status & Decorative Elements */}
            <div className="flex items-center space-x-4">
              {/* Vintage Verdict Stamp - ✅ FIXED */}
              <motion.div
                animate={{ 
                  rotate: isHovered ? 5 : 0,
                  scale: isHovered ? 1.05 : 1 
                }}
                transition={{ duration: 0.2 }}
              >
                <VintageVerdictStamp
                  status={getVerdictStatus(speaker.monthlyStatus)}
                  size="md"
                  animated={isHovered}
                />
              </motion.div>

              {/* Floating Verdict Icon */}
              <FloatingVerdictIcon
                size="md"
                confidence={speaker.truthScore}
                showConfidenceRing={true}
                autoAnimate={isHovered}
                delay={index * 0.1}
              />

              {/* Expand Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  p-2 rounded-full transition-colors duration-300
                  ${isDark ? 
                    'bg-slate-700 hover:bg-slate-600 text-gray-300' : 
                    'bg-amber-100 hover:bg-amber-200 text-amber-700'
                  }
                `}
              >
                <BarChart3 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Expandable Details */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-opacity-20"
                style={{
                  borderColor: isDark ? '#374151' : '#D4C4A8'
                }}
              >
                {/* Detailed Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <ProfileStatCard
                    icon={<Target className="w-4 h-4" />}
                    label="Topic Expertise"
                    value={`${speaker.topicExpertise}%`}
                    isDark={isDark}
                  />
                  <ProfileStatCard
                    icon={<Users className="w-4 h-4" />}
                    label="Public Trust"
                    value={`${speaker.publicTrust}%`}
                    isDark={isDark}
                  />
                  <ProfileStatCard
                    icon={<Star className="w-4 h-4" />}
                    label="Media Presence"
                    value={`${speaker.mediaPresence}%`}
                    isDark={isDark}
                  />
                  <ProfileStatCard
                    icon={<Trophy className="w-4 h-4" />}
                    label="Consistency"
                    value={`${speaker.consistencyScore}%`}
                    isDark={isDark}
                  />
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                  {speaker.specialties.map((specialty, idx) => (
                    <motion.span
                      key={specialty}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`
                        px-3 py-1 rounded-full text-sm font-medium
                        ${isDark ? 
                          'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 
                          'bg-amber-600/20 text-amber-700 border border-amber-500/30'
                        }
                      `}
                    >
                      {specialty}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassContainer>
    </motion.div>
  );
};

export default ProfilesRow;