'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import Image from 'next/image';
import { Globe } from 'lucide-react';
import { itemVariants } from '../animations/variants/votingVariants';

export interface CountryFilter {
  value: string;
  label: string;
  flag?: string;
}

interface ProfileFilterBarProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  className?: string;
}

const ProfileFilterBar: React.FC<ProfileFilterBarProps> = ({
  selectedCountry,
  onCountryChange,
  className = ''
}) => {
  const { colors, isDark, vintage } = useLayoutTheme();

  // Available country filters
  const countryFilters: CountryFilter[] = [
    { value: 'all', label: 'All Countries' },
    { value: 'us', label: 'United States', flag: '/flags/us.svg' },
    { value: 'cs', label: 'Czech Republic', flag: '/flags/cz.svg' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div
        className="inline-flex items-center rounded-2xl gap-2"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))'
            : `linear-gradient(135deg, ${vintage.paper}f0, ${vintage.highlight}80)`,
          border: isDark 
            ? '1px solid rgba(255,255,255,0.1)'
            : `2px solid ${vintage.aged}`,
          boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.2)'
            : `0 8px 32px rgba(139, 69, 19, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Vintage paper texture for light mode */}
        {!isDark && (
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none rounded-2xl"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
                radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.015) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px, 20px 20px'
            }}
          />
        )}

        {countryFilters.map((filter) => {
          const isActive = selectedCountry === filter.value;
          
          return (
            <motion.button
              key={filter.value}
              variants={itemVariants}
              onClick={() => onCountryChange(filter.value)}
              className="relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group"
              style={{
                background: isActive 
                  ? (isDark 
                      ? `linear-gradient(135deg, ${colors.primary}40, ${colors.primary}20)`
                      : `linear-gradient(135deg, ${vintage.sepia}, ${vintage.aged})`)
                  : 'transparent',
                border: isActive 
                  ? (isDark 
                      ? `2px solid ${colors.primary}60`
                      : `2px solid ${vintage.sepia}`)
                  : '2px solid transparent',
                boxShadow: isActive 
                  ? (isDark 
                      ? `0 4px 16px ${colors.primary}30`
                      : `0 4px 16px rgba(139, 69, 19, 0.2)`)
                  : 'none'
              }}
              whileHover={{ 
                scale: 1.05,
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect for active state */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl blur-lg opacity-30"
                    style={{
                      background: isDark ? colors.primary : vintage.sepia
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon/Flag Content */}
              <div className="relative z-10 flex items-center justify-center w-8 h-8">
                {filter.value === 'all' ? (
                  <motion.div
                    animate={{ 
                      rotate: isActive ? 360 : 0,
                      scale: isActive ? 1.1 : 1
                    }}
                    transition={{ 
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                  >
                    <Globe 
                      className="w-6 h-6" 
                      style={{ 
                        color: isActive 
                          ? (isDark ? colors.primary : vintage.ink)
                          : (isDark ? colors.mutedForeground : vintage.faded)
                      }} 
                    />
                  </motion.div>
                ) : filter.flag ? (
                  <motion.div
                    className="w-6 h-6 rounded-sm overflow-hidden ring-1 ring-white/20"
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                      rotateY: isActive ? [0, 20, 0] : 0
                    }}
                    transition={{ 
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                  >
                    <Image
                      src={filter.flag}
                      alt={filter.label}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </motion.div>
                ) : (
                  <div 
                    className="w-6 h-6 bg-gray-300 rounded-sm flex items-center justify-center text-xs"
                    style={{ 
                      color: isDark ? colors.mutedForeground : vintage.faded 
                    }}
                  >
                    ?
                  </div>
                )}
              </div>

              {/* Active indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                    style={{
                      background: isDark ? colors.primary : vintage.sepia,
                      boxShadow: `0 0 8px ${isDark ? colors.primary : vintage.sepia}60`
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ 
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                  >
                    <motion.div
                      className="w-full h-full rounded-full"
                      style={{
                        background: isDark ? colors.primary : vintage.sepia
                      }}
                      animate={{
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProfileFilterBar;