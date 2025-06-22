import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";

type Props = {
    language: {
        nativeName: string;
        name: string;
        description?: string;
    };
    isSelected: boolean;
    isDefault: boolean;
    isHovered: boolean;
}

const SettingLanguageInfo = ({language, isSelected, isDefault, isHovered}: Props) => {
    const { colors, isDark, vintage } = useLayoutTheme();
    return <div className="space-y-4">
        <div>
            <motion.h3
                className="text-xl font-bold leading-tight mb-1"
                style={{
                    color: isSelected
                        ? (isDark ? colors.primary : '#b8860b')
                        : (isDark ? colors.foreground : vintage.ink),
                    fontFamily: '"Playfair Display", serif'
                }}
                animate={{
                    color: isSelected
                        ? (isDark ? colors.primary : '#b8860b')
                        : (isDark ? colors.foreground : vintage.ink)
                }}
            >
                {language.nativeName}
            </motion.h3>

            <div
                className="text-sm font-medium tracking-wide"
                style={{
                    color: isDark ? colors.mutedForeground : vintage.faded,
                    fontFamily: '"Crimson Text", serif'
                }}
            >
                {language.name}
            </div>
        </div>

        {/* ✅ Enhanced Language Features with better styling */}
        <div className="flex items-center gap-2">
            {isDefault ? (
                <motion.div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                        background: isDark
                            ? 'rgba(34, 197, 94, 0.15)'
                            : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
                        border: isDark
                            ? '1px solid rgba(34, 197, 94, 0.3)'
                            : '1px solid rgba(34, 197, 94, 0.25)',
                        color: isDark ? '#22c55e' : '#16a34a'
                    }}
                    whileHover={{ scale: 1.05 }}
                >
                    <Shield className="w-3 h-3" />
                    <span>Original</span>
                </motion.div>
            ) : (
                <motion.div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                        background: isDark
                            ? 'rgba(168, 85, 247, 0.15)'
                            : 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.05))',
                        border: isDark
                            ? '1px solid rgba(168, 85, 247, 0.3)'
                            : '1px solid rgba(168, 85, 247, 0.25)',
                        color: isDark ? '#a855f7' : '#9333ea'
                    }}
                    whileHover={{ scale: 1.05 }}
                >
                    <Sparkles className="w-3 h-3" />
                    <span>AI Translated</span>
                </motion.div>
            )}
        </div>

        {/* ✅ Enhanced Description */}
        {language.description && (
            <motion.div
                className="text-xs leading-relaxed pt-1"
                style={{
                    color: isDark ? 'rgba(255,255,255,0.6)' : vintage.faded,
                    fontStyle: 'italic'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0.7 }}
            >
                {language.description}
            </motion.div>
        )}
    </div>
}

export default SettingLanguageInfo;