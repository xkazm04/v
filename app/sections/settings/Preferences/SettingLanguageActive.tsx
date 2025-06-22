import { itemVariants } from "@/app/components/animations/variants/votingVariants";
import { TranslationProgressIndicator } from "@/app/components/ui/TranslationProgressIndicator"
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useUserPreferences } from "@/app/hooks/use-user-preferences";
import { motion, AnimatePresence } from "framer-motion"
import { AVAILABLE_LANGUAGES } from '@/app/helpers/countries';
import { GlassContainer } from "@/app/components/ui/containers/GlassContainer";

const SettingLanguageActive = () => {
    const { colors } = useLayoutTheme();
    const {
        preferences,
        needsTranslation,
    } = useUserPreferences();
    const selectedLanguage = AVAILABLE_LANGUAGES?.find(lang => lang.code === preferences.language) || AVAILABLE_LANGUAGES?.[0];
    return <AnimatePresence>
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
                    <TranslationProgressIndicator />
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
}

export default SettingLanguageActive