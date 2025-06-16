
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
import { AVAILABLE_LANGUAGES } from '@/app/components/userPreferences/LanguageSelector';

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
          Choose your preferred language for intelligent translation
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-w-6xl mx-auto">
        {AVAILABLE_LANGUAGES.map((language, index) => {
          const isSelected = preferences.language === language.code;
          const isHovered = hoveredLanguage === language.code;
          const isEnglish = language.code === 'en';

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
              whileHover={{ y: -6, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden"
                style={{
                  background: isSelected || isHovered
                    ? `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}10)`
                    : isDark 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
                      : 'linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.02))',
                  borderColor: isSelected ? colors.primary : 'transparent',
                  boxShadow: isSelected 
                    ? `0 10px 30px ${colors.primary}25`
                    : isHovered
                      ? `0 10px 30px rgba(0,0,0,0.1)`
                      : 'none'
                }}
                animate={{
                  scale: isSelected ? 1.02 : 1
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Flag Display */}
                <div className="text-center mb-4">
                  <motion.div
                    className="text-4xl mb-3"
                    animate={{
                      scale: isSelected || isHovered ? 1.2 : 1,
                      rotate: isHovered ? 8 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {language.flag}
                  </motion.div>
                  
                  {/* Selection Indicator */}
                  <div className="h-6 flex justify-center">
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: colors.primary }}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Language Information */}
                <div className="text-center space-y-3">
                  <motion.h3 
                    className="text-sm font-bold leading-tight"
                    style={{ 
                      color: isSelected ? colors.primary : colors.foreground 
                    }}
                    animate={{
                      color: isSelected ? colors.primary : colors.foreground
                    }}
                  >
                    {language.nativeName}
                  </motion.h3>

                  <div className="text-xs text-muted-foreground">
                    {language.name}
                  </div>

                  {/* Type Badge */}
                  <motion.div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: isEnglish 
                        ? `rgba(16, 185, 129, 0.15)`
                        : `rgba(59, 130, 246, 0.15)`,
                      border: `1px solid ${isEnglish ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {isEnglish ? (
                      <>
                        <Shield className="w-3 h-3" style={{ color: '#10b981' }} />
                        <span style={{ color: '#10b981' }}>Original</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-3 h-3" style={{ color: '#3b82f6' }} />
                        <span style={{ color: '#3b82f6' }}>AI</span>
                      </>
                    )}
                  </motion.div>
                </div>

                {/* Selection Pulse Effect */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
                    style={{ borderColor: colors.primary }}
                    animate={{
                      opacity: [0, 0.6, 0],
                      scale: [1, 1.04, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                {/* Hover Glow Effect */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
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
    </div>
  );
});

export default SettingLanguage;