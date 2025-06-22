import { LanguageFlagSvg } from "@/app/components/userPreferences/LanguageFlagSvg";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Star } from "lucide-react";

type Props = {
    language: {
        nativeName: string;
        name: string;
        flagSvg: string;
    };
    isSelected: boolean;
    isHovered: boolean;
    isDefault: boolean;
}

const SettingLanguageFlagArea = ({language, isSelected, isHovered, isDefault}: Props) => {
    const { colors, isDark } = useLayoutTheme();
    return <>
        <div className="flex items-center justify-between mb-5">
            <motion.div
                className="relative"
                animate={{
                    scale: isSelected || isHovered ? 1.1 : 1,
                    rotate: isHovered ? 4 : 0
                }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <LanguageFlagSvg
                    flagSvg={language.flagSvg}
                    alt={language.name}
                    className={`w-14 h-10 ${!isDark ? 'border-amber-200/60' : 'border-white/20'}`}
                />

                {/* Flag glow effect when selected */}
                {isSelected && (
                    <motion.div
                        className="absolute inset-0 rounded-lg"
                        style={{
                            boxShadow: isDark
                                ? `0 0 20px ${colors.primary}40`
                                : '0 0 15px rgba(180, 135, 45, 0.3)'
                        }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
            </motion.div>

            <div className="flex items-center gap-2">
                {/* Quality indicator */}
                {isDefault && (
                    <motion.div
                        className="w-5 h-5 flex items-center justify-center"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                        <Star
                            className="w-4 h-4"
                            style={{
                                color: isDark ? '#fbbf24' : '#d97706',
                                fill: isDark ? '#fbbf24' : '#d97706'
                            }}
                        />
                    </motion.div>
                )}

                {/* Selection check */}
                <div className="w-7 h-7 flex items-center justify-center">
                    <AnimatePresence>
                        {isSelected && (
                            <motion.div
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{
                                    background: isDark
                                        ? colors.primary
                                        : 'linear-gradient(135deg, #b8860b, #cd853f)'
                                }}
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 90 }}
                                transition={{ type: "spring", stiffness: 500 }}
                            >
                                <Check className="w-3 h-3 text-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    </>
}

export default SettingLanguageFlagArea;