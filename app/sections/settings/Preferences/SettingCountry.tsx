import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { 
  MapPin,
  Check,
  Star
} from 'lucide-react';
import { AVAILABLE_COUNTRIES } from '@/app/helpers/countries';
import Image from 'next/image';

// Country Flag SVG Background Component
const CountryFlagBackground = ({ flagSvg, alt, isSelected, isHovered }: { 
  flagSvg: string; 
  alt: string; 
  isSelected: boolean;
  isHovered: boolean;
}) => {
  const [imageError, setImageError] = useState(false);
  
  if (imageError) {
    return null;
  }
  
  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden rounded-xl"
      animate={{
        opacity: isSelected ? 0.7 : isHovered ? 0.7 : 0.15
      }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={flagSvg}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
      />
      {/* Overlay gradient for better text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"
        style={{
          background: isSelected 
            ? 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1), rgba(0,0,0,0.3))'
            : 'linear-gradient(135deg, rgba(0,0,0,0.2), rgba(0,0,0,0.05), rgba(0,0,0,0.2))'
        }}
      />
    </motion.div>
  );
};

const SettingCountry = memo(function SettingCountry() {
  const { colors, isDark } = useLayoutTheme();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  
  const { preferences, setCountries } = useUserPreferences();
  const selectedCountries = preferences.countries || ['worldwide'];

  const handleCountryToggle = (countryCode: string) => {
    if (countryCode === 'worldwide') {
      // If selecting worldwide, replace all selections
      setCountries(['worldwide']);
    } else {
      // Remove worldwide if selecting specific country
      let newCountries = selectedCountries.filter(c => c !== 'worldwide');
      
      if (newCountries.includes(countryCode)) {
        // Remove if already selected
        newCountries = newCountries.filter(c => c !== countryCode);
        // If no countries left, default to worldwide
        if (newCountries.length === 0) {
          newCountries = ['worldwide'];
        }
      } else {
        // Add new country
        newCountries = [...newCountries, countryCode];
      }
      
      setCountries(newCountries);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3" style={{ color: colors.foreground }}>
          <motion.div
            className="p-2 rounded-xl"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}10)`,
              border: `1px solid ${colors.primary}30`
            }}
            whileHover={{ scale: 1.1, rotate: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <MapPin className="w-7 h-7" style={{ color: colors.primary }} />
          </motion.div>
          Preferred Regions
        </h2>
        <p className="text-lg text-muted-foreground">
          Select regions for localized news content (multiple selections allowed)
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-w-6xl mx-auto">
        {AVAILABLE_COUNTRIES.map((country, index) => {
          const isSelected = selectedCountries.includes(country.code);
          const isHovered = hoveredCountry === country.code;
          const isGlobal = country.code === 'worldwide';

          return (
            <motion.div
              key={country.code}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredCountry(country.code)}
              onMouseLeave={() => setHoveredCountry(null)}
              onClick={() => handleCountryToggle(country.code)}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.03 }}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                className="relative p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden backdrop-blur-sm"
                style={{
                  background: isSelected || isHovered
                    ? `linear-gradient(135deg, ${colors.primary}25, ${colors.primary}15)`
                    : isDark 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))'
                      : 'linear-gradient(135deg, rgba(0,0,0,0.08), rgba(0,0,0,0.03))',
                  borderColor: isSelected ? colors.primary : 'transparent',
                  boxShadow: isSelected 
                    ? `0 8px 25px ${colors.primary}20`
                    : isHovered
                      ? `0 8px 25px rgba(0,0,0,0.08)`
                      : 'none'
                }}
              >
                {/* Flag Background */}
                <CountryFlagBackground 
                  flagSvg={country.flagSvg}
                  alt={country.name}
                  isSelected={isSelected}
                  isHovered={isHovered}
                />

                {/* Content Layer */}
                <div className={`relative z-10 ${isSelected && 'text-transparent'} font-bold`}>
                  {/* Flag Icon and Selection Check */}
                  <div className="flex items-center justify-between mb-3">
                    <motion.div
                      className="text-3xl drop-shadow-lg"
                      animate={{
                        scale: isSelected || isHovered ? 1.15 : 1,
                        rotate: isHovered ? 5 : 0
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {country.flag}
                    </motion.div>
                    
                    <div className="w-5 h-5 flex items-center justify-center">
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            className="w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
                            style={{ background: colors.primary }}
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 90 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <Check className="w-2.5 h-2.5 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Country Information */}
                  <div className="space-y-2">
                    <div
                      className={`text-sm font-bold leading-tight drop-shadow-sm`}
                    >
                      {country.nativeName}
                    </div>
                    
                    <div 
                      className="text-xs font-medium drop-shadow-sm"
                    >
                      {country.region}
                    </div>

                    {/* Special Badge for Global */}
                    {isGlobal && (
                      <motion.div
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                        style={{
                          background: `rgba(147, 51, 234, 0.25)`,
                          border: `1px solid rgba(147, 51, 234, 0.4)`
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Star className="w-2.5 h-2.5" style={{ color: '#9333ea' }} />
                        <span style={{ color: '#9333ea' }}>Global</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Selection Pulse */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 pointer-events-none"
                    style={{ borderColor: colors.primary }}
                    animate={{
                      opacity: [0, 0.4, 0],
                      scale: [1, 1.03, 1]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                {/* Hover Effect */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${colors.primary}15, transparent 70%)`
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
        })}
      </div>

      {/* Selection Summary */}
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full border backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}08)`,
            borderColor: `${colors.primary}40`
          }}
        >
          <MapPin className="w-5 h-5" style={{ color: colors.primary }} />
          <span className="font-medium" style={{ color: colors.primary }}>
            {selectedCountries.length === 1 && selectedCountries[0] === 'worldwide' 
              ? 'Global news coverage active'
              : `${selectedCountries.length} region${selectedCountries.length > 1 ? 's' : ''} selected for personalized content`
            }
          </span>
        </div>
      </motion.div>
    </div>
  );
});

export default SettingCountry;