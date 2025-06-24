import { STAT_CONFIG } from "@/app/constants/stat";
import { motion } from "framer-motion";

const StatCard = ({
    config,
    value,
    isDark,
    isLast,
    index
}: {
    config: typeof STAT_CONFIG[number];
    value: number;
    isDark: boolean;
    isLast: boolean;
    index: number;
}) => {
    const theme = isDark ? config.colors.dark : config.colors.light;

    return (
        <motion.div
            className={`flex items-center justify-center gap-2 px-3 py-2 ${!isLast ? 'border-r' : ''}`}
            style={{
                backgroundColor: theme.background,
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 400,
                damping: 25
            }}
            whileHover={{
                scale: 1.02,
                transition: { duration: 0.15 }
            }}
        >
            {/* ✅ SINGLE ROW: Icon, Number, Label all in one line */}
            <span className="text-sm">{config.icon}</span>
            <div
                className="text-lg font-bold"
                style={{
                    color: theme.text
                }}
            >
                {value}{config.suffix || ''}
            </div>
            <div
                className="text-xs font-medium"
                style={{
                    color: theme.text,
                    opacity: 0.7
                }}
            >
                {config.label}
            </div>
        </motion.div>
    );
};

export default StatCard;