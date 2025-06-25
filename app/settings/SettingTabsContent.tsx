import { AnimatePresence, motion } from "framer-motion"
import SettingLayout from "../sections/settings/Preferences/SettingLayout"
import SetAppearance from "../sections/settings/Appearance/SetApearance"
import { TabsContent } from "../components/ui/tabs"
import { useLayoutTheme } from "../hooks/use-layout-theme"

type Props = {
    activeTab: string
}

const SettingTabsContent = ({activeTab}: Props) => {
    const { colors, isDark, vintage } = useLayoutTheme();
    return <AnimatePresence mode="wait">
            <TabsContent key="preferences" value="preferences" className="mt-8">
                <SettingLayout />
            </TabsContent>

            <TabsContent key="appearance" value="appearance" className="mt-8">
                <SetAppearance />
            </TabsContent>

            <TabsContent key="profile" value="profile" className="mt-8">
                <motion.div
                    key={activeTab}
                    className="relative overflow-hidden rounded-3xl border p-8"
                    style={{
                        background: isDark
                            ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
                            : `linear-gradient(135deg, ${vintage.paper}, ${vintage.highlight}40)`,
                        border: isDark
                            ? '1px solid rgba(255,255,255,0.1)'
                            : `2px solid ${vintage.aged}`,
                        boxShadow: isDark
                            ? '0 8px 32px rgba(0,0,0,0.2)'
                            : `0 8px 32px rgba(139, 69, 19, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
                        backdropFilter: 'blur(20px)'
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Vintage paper texture for light mode */}
                    {!isDark && (
                        <div
                            className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{
                                backgroundImage: `
                              radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
                              radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.015) 1px, transparent 1px)
                            `,
                                backgroundSize: '60px 60px, 40px 40px'
                            }}
                        />
                    )}

                    <div className="text-center space-y-6 relative z-10">
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-6xl"
                        >
                            👤
                        </motion.div>

                        <h3
                            className="text-3xl font-bold"
                            style={{
                                color: isDark ? colors.foreground : vintage.ink,
                                fontFamily: '"Playfair Display", serif'
                            }}
                        >
                            Profile Settings
                        </h3>

                        <p
                            className="max-w-md mx-auto leading-relaxed"
                            style={{
                                color: isDark ? colors.mutedForeground : vintage.faded,
                                fontFamily: '"Crimson Text", serif'
                            }}
                        >
                            Advanced profile management and personalization features are coming soon.
                            Stay tuned for exciting updates!
                        </p>

                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                            style={{
                                background: isDark
                                    ? `${colors.primary}15`
                                    : `linear-gradient(135deg, #b8860b15, #b8860b08)`,
                                border: isDark
                                    ? `1px solid ${colors.primary}30`
                                    : '1px solid rgba(184, 134, 11, 0.25)',
                                color: isDark ? colors.primary : '#b8860b'
                            }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="text-sm font-medium">🚀 Coming Soon</span>
                        </motion.div>
                    </div>
                </motion.div>
            </TabsContent>
    </AnimatePresence>
}

export default SettingTabsContent