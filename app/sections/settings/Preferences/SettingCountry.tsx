
import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { 
  MapPin,
  Check,
  Star
} from 'lucide-react';
import Image from 'next/image';

// Countries with their flag emojis and regions
const AVAILABLE_COUNTRIES = [
  { code: 'worldwide', name: 'Worldwide', nativeName: 'Global', flag: '🌍', region: 'Global' },
  { code: 'us', name: 'United States', nativeName: 'United States', flag: '🇺🇸', region: 'North America' },
  { code: 'uk', name: 'United Kingdom', nativeName: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
  { code: 'ca', name: 'Canada', nativeName: 'Canada', flag: '🇨🇦', region: 'North America' },
  { code: 'au', name: 'Australia', nativeName: 'Australia', flag: '🇦🇺', region: 'Oceania' },
  { code: 'de', name: 'Germany', nativeName: 'Deutschland', flag: '🇩🇪', region: 'Europe' },
  { code: 'fr', name: 'France', nativeName: 'France', flag: '🇫🇷', region: 'Europe' },
  { code: 'es', name: 'Spain', nativeName: 'España', flag: '🇪🇸', region: 'Europe' },
  { code: 'it', name: 'Italy', nativeName: 'Italia', flag: '🇮🇹', region: 'Europe' },
  { code: 'jp', name: 'Japan', nativeName: '日本', flag: '🇯🇵', region: 'Asia' },
  { code: 'cn', name: 'China', nativeName: '中国', flag: '🇨🇳', region: 'Asia' },
  { code: 'in', name: 'India', nativeName: 'भारत', flag: '🇮🇳', region: 'Asia' },
  { code: 'br', name: 'Brazil', nativeName: 'Brasil', flag: '🇧🇷', region: 'South America' },,
  { code: 'ru', name: 'Russia', nativeName: 'Россия', flag: '🇷🇺', region: 'Europe/Asia' },
];

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
                className="relative p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden"
                style={{
                  background: isSelected || isHovered
                    ? `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}08)`
                    : isDark 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))'
                      : 'linear-gradient(135deg, rgba(0,0,0,0.03), rgba(0,0,0,0.01))',
                  borderColor: isSelected ? colors.primary : 'transparent',
                  boxShadow: isSelected 
                    ? `0 8px 25px ${colors.primary}20`
                    : isHovered
                      ? `0 8px 25px rgba(0,0,0,0.08)`
                      : 'none'
                }}
              >
                {/* Flag and Selection Check */}
                <div className="flex items-center justify-between mb-3">
                  <motion.div
                    className="text-2xl"
                    animate={{
                      scale: isSelected || isHovered ? 1.15 : 1,
                      rotate: isHovered ? 5 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {country.flag}

                    <Image
                      src={`/flags/${country.code.toLowerCase()}.svg`}
                      alt={`${country.name} flag`}
                      width={32}
                      height={32}
                      className="inline-block ml-2 rounded opacity-70"
                      />
                  </motion.div>
                  
                  <div className="w-5 h-5 flex items-center justify-center">
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
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
                  <motion.h4 
                    className="text-sm font-bold leading-tight"
                    style={{ 
                      color: isSelected ? colors.primary : colors.foreground 
                    }}
                    animate={{
                      color: isSelected ? colors.primary : colors.foreground
                    }}
                  >
                    {country.nativeName}
                  </motion.h4>
                  
                  <div className="text-xs text-muted-foreground">
                    {country.region}
                  </div>

                  {/* Special Badge for Global */}
                  {isGlobal && (
                    <motion.div
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: `rgba(147, 51, 234, 0.15)`,
                        border: `1px solid rgba(147, 51, 234, 0.3)`
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Star className="w-2.5 h-2.5" style={{ color: '#9333ea' }} />
                      <span style={{ color: '#9333ea' }}>Global</span>
                    </motion.div>
                  )}
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
                        background: `radial-gradient(circle at center, ${colors.primary}10, transparent 70%)`
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
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full border"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}10, ${colors.primary}05)`,
            borderColor: `${colors.primary}30`
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