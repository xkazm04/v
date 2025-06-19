import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { 
  Globe, 
  Shield,
  Check,
  Brain
} from 'lucide-react';
import { AVAILABLE_LANGUAGES } from '@/app/helpers/countries';
import Image from 'next/image';

// Language Flag SVG Component
const LanguageFlagSvg = ({ flagSvg, alt, className = '' }: { flagSvg: string; alt: string; className?: string }) => {
  const [imageError, setImageError] = useState(false);
  
  if (imageError) {
    return <div className={`rounded-lg bg-gray-200 dark:bg-gray-700 ${className}`} />;
  }
  
  return (
    <div className={`relative overflow-hidden rounded-lg border-2 border-white/20 shadow-lg ${className}`}>
      <Image
        src={flagSvg}
        alt={alt}
        width={64}
        height={48}
        className="object-cover w-full h-full"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

const SettingLanguage = memo(function SettingLanguage() {
  const { colors, isDark } = useLayoutTheme();
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);
  
  const { preferences, setLanguage } = useUserPreferences();

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

  // Safe loading check
  if (!AVAILABLE_LANGUAGES || AVAILABLE_LANGUAGES.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-6 h-6 border-2 border-current border-t-transparent rounded-full mx-auto mb-4" 
             style={{ borderColor: colors.primary }} />
        <p style={{ color: colors.foreground }}>Loading languages...</p>
      </div>
    );
  }

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
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Globe className="w-7 h-7" style={{ color: colors.primary }} />
          </motion.div>
          Content Language
        </h2>
        <p className="text-lg text-muted-foreground">
          Select your preferred language for content consumption
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {AVAILABLE_LANGUAGES.map((language, index) => {
          const isSelected = preferences.language === language.code;
          const isHovered = hoveredLanguage === language.code;
          const isDefault = language.code === 'en';

          return (
            <motion.div
              key={language.code}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredLanguage(language.code)}
              onMouseLeave={() => setHoveredLanguage(null)}
              onClick={() => setLanguage(language.code)}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="relative p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden"
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
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    animate={{
                      scale: isSelected || isHovered ? 1.15 : 1,
                      rotate: isHovered ? 8 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <LanguageFlagSvg 
                      flagSvg={language.flagSvg} 
                      alt={language.name}
                      className="w-12 h-9"
                    />
                  </motion.div>
                  
                  <div className="w-6 h-6 flex items-center justify-center">
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: colors.primary }}
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Language Information */}
                <div className="space-y-3">
                  <motion.h3 
                    className="text-lg font-bold leading-tight"
                    style={{ 
                      color: isSelected ? colors.primary : colors.foreground 
                    }}
                    animate={{
                      color: isSelected ? colors.primary : colors.foreground
                    }}
                  >
                    {language.nativeName}
                  </motion.h3>
                  
                  <div className="text-sm opacity-70" style={{ color: colors.foreground }}>
                    {language.name}
                  </div>

                  {/* Language Features */}
                  <div className="flex items-center gap-2 pt-2">
                    {isDefault ? (
                      <motion.div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: `rgba(34, 197, 94, 0.15)`,
                          border: `1px solid rgba(34, 197, 94, 0.3)`
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Shield className="w-3 h-3" style={{ color: '#22c55e' }} />
                        <span style={{ color: '#22c55e' }}>Original</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: `rgba(168, 85, 247, 0.15)`,
                          border: `1px solid rgba(168, 85, 247, 0.3)`
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Brain className="w-3 h-3" style={{ color: '#a855f7' }} />
                        <span style={{ color: '#a855f7' }}>AI Translated</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Description */}
                  {language.description && (
                    <div className="text-xs opacity-60 pt-1" style={{ color: colors.foreground }}>
                      {language.description}
                    </div>
                  )}
                </div>

                {/* Selection Pulse */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
                    style={{ borderColor: colors.primary }}
                    animate={{
                      opacity: [0, 0.4, 0],
                      scale: [1, 1.02, 1]
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
                      className="absolute inset-0 rounded-2xl pointer-events-none"
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
          <Globe className="w-5 h-5" style={{ color: colors.primary }} />
          <span className="font-medium" style={{ color: colors.primary }}>
            {preferences.language === 'en' 
              ? 'Reading content in original English'
              : `Content will be translated to ${AVAILABLE_LANGUAGES.find(l => l.code === preferences.language)?.nativeName || 'your language'}`
            }
          </span>
        </div>
      </motion.div>
    </div>
  );
});

export default SettingLanguage;