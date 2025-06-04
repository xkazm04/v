import { cn } from "@/app/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
const OnboardingSelectionButton = ({
    item,
    isSelected,
    onClick,
    type = 'default'
}: {
    item: any;
    isSelected: boolean;
    onClick: () => void;
    type?: 'country' | 'category' | 'theme' | 'default';
}) => {
    const Icon = item.icon;

    return (
        <motion.button
            onClick={onClick}
            className={cn(
                "relative p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 group overflow-hidden",
                "hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg shadow-blue-500/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600"
            )}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {/* Background Effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                {/* Icon Container */}
                <motion.div
                    className={cn(
                        "w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center relative",
                        isSelected
                            ? "bg-blue-500 text-white shadow-lg"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    )}
                    style={{
                        backgroundColor: isSelected && item.color ? item.color : undefined
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {type === 'country' && item.flag ? (
                        <span className="text-2xl md:text-3xl">{item.flag}</span>
                    ) : (
                        <Icon className="w-6 h-6 md:w-8 md:h-8" />
                    )}

                    {/* Selection indicator */}
                    <AnimatePresence>
                        {isSelected && (
                            <motion.div
                                className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 500 }}
                            >
                                <Check className="w-3 h-3 text-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Text Content */}
                <div className="space-y-1">
                    <h3 className={cn(
                        "font-semibold text-sm md:text-base transition-colors",
                        isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-gray-100"
                    )}>
                        {item.label}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-tight">
                        {item.description}
                    </p>
                </div>
            </div>

            {/* Hover glow */}
            <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(circle at center, ${item.color || '#3b82f6'}15, transparent 70%)`
                }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    );
};
export default OnboardingSelectionButton;