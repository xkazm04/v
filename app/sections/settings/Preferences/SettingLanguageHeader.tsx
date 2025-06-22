import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

const SettingLanguageHeader = () => {
    const { colors, isDark, vintage } = useLayoutTheme();
    return <>
        <div className="text-center mb-10">
            <motion.div
                className="inline-flex items-center justify-center gap-3 mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.div
                    className="relative p-3 rounded-2xl"
                    style={{
                        background: isDark
                            ? `linear-gradient(135deg, ${colors.primary}25, ${colors.primary}10)`
                            : `linear-gradient(135deg, ${vintage.highlight}, ${vintage.paper})`,
                        border: isDark
                            ? `1px solid ${colors.primary}30`
                            : `2px solid ${vintage.sepia}`,
                        boxShadow: isDark
                            ? `0 8px 25px ${colors.primary}20`
                            : `0 8px 25px rgba(139, 69, 19, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)`
                    }}
                    whileHover={{ scale: 1.1, rotate: 8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Globe className="w-8 h-8" style={{
                        color: isDark ? colors.primary : vintage.ink
                    }} />

                    {/* ✅ Vintage newspaper corner decoration */}
                    {!isDark && (
                        <>
                            <div
                                className="absolute -top-1 -right-1 w-3 h-3 transform rotate-45"
                                style={{
                                    background: vintage.aged,
                                    clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                                }}
                            />
                            <div
                                className="absolute -bottom-1 -left-1 w-3 h-3 transform rotate-45"
                                style={{
                                    background: vintage.aged,
                                    clipPath: 'polygon(100% 100%, 0 100%, 100% 0)'
                                }}
                            />
                        </>
                    )}
                </motion.div>
            </motion.div>

            <motion.h2
                className="text-4xl font-bold mb-4"
                style={{
                    color: isDark ? colors.foreground : vintage.ink,
                    fontFamily: '"Playfair Display", "Times New Roman", serif',
                    textShadow: isDark ? 'none' : '0 1px 2px rgba(139, 69, 19, 0.1)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                Content Language
            </motion.h2>

            <motion.p
                className="text-lg max-w-2xl mx-auto leading-relaxed"
                style={{
                    color: isDark ? colors.mutedForeground : vintage.faded,
                    fontFamily: '"Crimson Text", Georgia, serif'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                Select your preferred language for content consumption.
                <span className="block mt-1 text-sm opacity-80">
                    Original articles are in English • Other languages are AI-translated
                </span>
            </motion.p>
        </div>
    </>
}

export default SettingLanguageHeader;