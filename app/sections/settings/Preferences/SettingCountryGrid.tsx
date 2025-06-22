import { AnimatePresence, motion } from "framer-motion";
import { AVAILABLE_COUNTRIES } from '@/app/helpers/countries';
import { Check, Globe2 } from 'lucide-react';
import { useState } from "react";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { itemVariants } from "@/app/components/animations/variants/votingVariants";
import CountryFlagBackground from "./CountryFlagBackground";
import { useUserPreferences } from "@/app/hooks/use-user-preferences";


const SettingCountryGrid = () => {
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
    const { colors, isDark, vintage, getCardColors, universalCard } = useLayoutTheme();
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
    return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-w-6xl mx-auto">
        {AVAILABLE_COUNTRIES.map((country, index) => {
            const isSelected = selectedCountries.includes(country.code);
            const isHovered = hoveredCountry === country.code;
            const isGlobal = country.code === 'worldwide';

            // ✅ Use universal card colors
            const cardColors = getCardColors(isSelected, isHovered);

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
                        className="relative p-4 rounded-xl transition-all duration-300 overflow-hidden backdrop-blur-sm"
                        style={{
                            background: cardColors.background,
                            border: cardColors.border,
                            boxShadow: cardColors.shadow
                        }}
                    >
                        {/* ✅ Vintage paper texture overlay for light mode */}
                        {!isDark && (
                            <div
                                className="absolute inset-0 opacity-20 pointer-events-none"
                                style={{
                                    backgroundImage: `
                        radial-gradient(circle at 25% 35%, rgba(139, 69, 19, 0.015) 1px, transparent 1px),
                        radial-gradient(circle at 75% 65%, rgba(139, 69, 19, 0.01) 1px, transparent 1px)
                      `,
                                    backgroundSize: '40px 40px, 30px 30px'
                                }}
                            />
                        )}

                        {/* Flag Background */}
                        <CountryFlagBackground
                            flagSvg={country.flagSvg}
                            alt={country.name}
                            isSelected={isSelected}
                            isHovered={isHovered}
                        />

                        {/* Content Layer */}
                        <div className="relative z-10">
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
                                                style={{
                                                    background: isDark ? colors.primary : universalCard.accent
                                                }}
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
                                    className="text-sm font-bold leading-tight drop-shadow-sm"
                                    style={{
                                        color: isSelected
                                            ? (isDark ? colors.primary : universalCard.textAccent)
                                            : (isDark ? colors.foreground : vintage.ink),
                                        fontFamily: '"Playfair Display", serif'
                                    }}
                                >
                                    {country.nativeName}
                                </div>

                                <div
                                    className="text-xs font-medium drop-shadow-sm"
                                    style={{
                                        color: isDark ? colors.mutedForeground : vintage.faded,
                                        fontFamily: '"Crimson Text", serif'
                                    }}
                                >
                                    {country.region}
                                </div>

                                {/* Special Badge for Global */}
                                {isGlobal && (
                                    <motion.div
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                                        style={{
                                            background: isDark
                                                ? 'rgba(147, 51, 234, 0.25)'
                                                : 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(147, 51, 234, 0.05))',
                                            border: isDark
                                                ? '1px solid rgba(147, 51, 234, 0.4)'
                                                : '1px solid rgba(147, 51, 234, 0.25)',
                                            color: isDark ? '#a855f7' : '#9333ea'
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <Globe2 className="w-2.5 h-2.5" />
                                        <span>Global</span>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Selection Pulse */}
                        {isSelected && (
                            <motion.div
                                className="absolute inset-0 rounded-xl border-2 pointer-events-none"
                                style={{
                                    borderColor: isDark ? colors.primary : universalCard.accent
                                }}
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
                                        background: isDark
                                            ? `radial-gradient(circle at center, ${colors.primary}15, transparent 70%)`
                                            : `radial-gradient(circle at center, ${universalCard.accent}15, transparent 70%)`
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
                                    className="absolute top-1 left-1 w-1.5 h-1.5 opacity-20"
                                    style={{
                                        background: vintage.ink,
                                        clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                                    }}
                                />
                                <div
                                    className="absolute bottom-1 right-1 w-1.5 h-1.5 opacity-20"
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

}

export default SettingCountryGrid;