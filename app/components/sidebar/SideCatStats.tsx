import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion } from "framer-motion"
import { navItemVariants } from "../animations/variants/navVariants";
const SideCatStats = () => {
    const { colors, isDark } = useLayoutTheme();
    const mockStats = {
        totalArticles: 1247,
        todayArticles: 23,
        viewingRate: 92
    };
    return <motion.div variants={navItemVariants}>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 gap-2 px-1 mb-2"
            >
                <motion.div
                    className="text-center p-2 rounded-lg"
                    style={{
                        background: isDark
                            ? 'rgba(59, 130, 246, 0.1)'
                            : 'rgba(59, 130, 246, 0.08)',
                        border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'}`
                    }}
                    whileHover={{ scale: 1.02 }}
                    variants={navItemVariants}
                >
                    <div className="text-xs font-bold" style={{ color: colors.primary }}>
                        {mockStats.totalArticles.toLocaleString()}
                    </div>
                    <div className="text-xs" style={{ color: colors.mutedForeground }}>
                        Total
                    </div>
                </motion.div>

                <motion.div
                    className="text-center p-2 rounded-lg"
                    style={{
                        background: isDark
                            ? 'rgba(34, 197, 94, 0.1)'
                            : 'rgba(34, 197, 94, 0.08)',
                        border: `1px solid ${isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)'}`
                    }}
                    whileHover={{ scale: 1.02 }}
                    variants={navItemVariants}
                >
                    <div className="text-xs font-bold text-green-500">
                        +{mockStats.todayArticles}
                    </div>
                    <div className="text-xs" style={{ color: colors.mutedForeground }}>
                        Today
                    </div>
                </motion.div>
            </motion.div>
    </motion.div>
}

export default SideCatStats