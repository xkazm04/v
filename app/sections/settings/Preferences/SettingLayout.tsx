'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';
import SettingLanguage from './SettingLanguage';
import SettingCountry from './SettingCountry';
import { AVAILABLE_LANGUAGES } from '@/app/helpers/countries';

const SettingLayout = memo(function SettingLayout() {
  const { colors } = useLayoutTheme();
  const {
    preferences,
    needsTranslation,
    getTranslationTarget
  } = useUserPreferences();

  const selectedLanguage = AVAILABLE_LANGUAGES?.find(lang => lang.code === preferences.language) || AVAILABLE_LANGUAGES?.[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <GlassContainer
        style="frosted"
        border="glow"
        rounded="3xl"
        shadow="glow"
        className="relative overflow-hidden py-5"
      >
        {/* Settings Content */}
        <div className="relative z-10 px-8 pb-12">
          {/* Language Settings */}
          <motion.div variants={itemVariants} className="mb-16">
            <SettingLanguage />
          </motion.div>

          {/* Country Settings */}
          <motion.div variants={itemVariants} className="mb-16">
            <SettingCountry />
          </motion.div>

          {/* Translation Status Banner */}
          <AnimatePresence>
            {needsTranslation && selectedLanguage && (
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <GlassContainer
                  style="crystal"
                  border="glow"
                  rounded="2xl"
                  shadow="glow"
                  className="relative overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{selectedLanguage.flag}</div>
                      <div>
                        <h3 className="font-semibold" style={{ color: colors.foreground }}>
                          Translation Active
                        </h3>
                        <p className="text-sm opacity-70" style={{ color: colors.foreground }}>
                          Content will be translated to {selectedLanguage.nativeName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full opacity-20"
                        style={{ 
                          background: colors.primary,
                          left: `${10 + i * 8}%`,
                          top: `${20 + (i % 3) * 40}%`
                        }}
                        animate={{
                          y: [0, -8, 0],
                          opacity: [0.2, 0.6, 0.2],
                          scale: [1, 1.3, 1]
                        }}
                        transition={{
                          duration: 3 + i * 0.2,
                          repeat: Infinity,
                          delay: i * 0.3
                        }}
                      />
                    ))}
                  </div>
                </GlassContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassContainer>
    </motion.div>
  );
});

export default SettingLayout;