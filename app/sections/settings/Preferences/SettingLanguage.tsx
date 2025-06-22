import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { AVAILABLE_LANGUAGES } from '@/app/helpers/countries';
import SettingLanguageActive from './SettingLanguageActive';
import SettingLanguageHeader from './SettingLanguageHeader';
import SettingLanguageInfo from './SettingLanguageInfo';
import SettingLanguageFlagArea from './SettingLanguageFlagArea';

const SettingLanguage = memo(function SettingLanguage() {
  const { colors, isDark, vintage, getCardColors } = useLayoutTheme();
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);
  
  const { preferences, setLanguage } = useUserPreferences();

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
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
      <SettingLanguageHeader />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto my-8">
        {AVAILABLE_LANGUAGES.map((language, index) => {
          const isSelected = preferences.language === language.code;
          const isHovered = hoveredLanguage === language.code;
          const isDefault = language.code === 'en';
          
          // ✅ Use universal card colors
          const cardColors = getCardColors(isSelected, isHovered);

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
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="relative p-6 rounded-2xl transition-all duration-300 overflow-hidden"
                style={{
                  background: cardColors.background,
                  border: cardColors.border,
                  boxShadow: cardColors.shadow
                }}
              >
                {/* ✅ Vintage paper texture overlay for light mode */}
                {!isDark && (
                  <div 
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
                        radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.015) 1px, transparent 1px)
                      `,
                      backgroundSize: '60px 60px, 40px 40px'
                    }}
                  />
                )}

                <SettingLanguageFlagArea
                  language={language}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  isDefault={isDefault}
                />

                <SettingLanguageInfo 
                  language={language}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  isDefault={isDefault}
                />

                {/* ✅ Enhanced Selection Pulse Effect */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ 
                      border: isDark 
                        ? `2px solid ${colors.primary}` 
                        : '2px solid rgba(184, 134, 11, 0.4)'
                    }}
                    animate={{
                      opacity: [0, 0.6, 0],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                {/* ✅ Enhanced Hover Effect */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: isDark
                          ? `radial-gradient(circle at center, ${colors.primary}08, transparent 70%)`
                          : `radial-gradient(circle at center, rgba(184, 134, 11, 0.06), transparent 70%)`
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>

                {/* ✅ Vintage corner ornaments for light mode */}
                {!isDark && isSelected && (
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
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <SettingLanguageActive />
    </div>
  );
});

export default SettingLanguage;