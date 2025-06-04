'use client';

import { motion } from "framer-motion";  
import { cn } from "@/app/lib/utils";
import { Category } from "./CategoryFilter";
import { colors } from "@/app/constants/colors";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Props = {
    category: Category;
    isSelected: boolean;
    isPendingItem?: boolean;
    showAnimation?: boolean;
    showCounts?: boolean;
    handleCategoryClick: (categoryId: string) => void;
    isPending?: boolean;
}

const CategoryItem = ({ 
    category, 
    isSelected, 
    isPendingItem,
    showAnimation = true,
    showCounts = true,
    handleCategoryClick,
    isPending = false 
}: Props) => {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // or a loading skeleton
    }

    const Icon = category.icon;
    const isDark = resolvedTheme === 'dark';
    const themeColors = isDark ? colors.dark : colors.light;
    
    // Enhanced color calculations based on theme
    const getBackgroundColor = () => {
        if (isSelected) {
            return isDark 
                ? `linear-gradient(135deg, ${category.color}15 0%, ${category.color}08 100%)`
                : `linear-gradient(135deg, ${category.color}12 0%, ${category.color}06 100%)`;
        }
        return themeColors.inactive;
    };

    const getBorderColor = () => {
        if (isSelected) {
            return category.color;
        }
        return isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)';
    };

    const getHoverGradient = () => {
        return isDark 
            ? `linear-gradient(135deg, ${category.color}12, ${category.color}04)`
            : `linear-gradient(135deg, ${category.color}15, ${category.color}05)`;
    };

    const getIconBackground = () => {
        if (isSelected) {
            return category.color;
        }
        return isDark 
            ? `${category.color}25`
            : `${category.color}20`;
    };

    const getIconColor = () => {
        if (isSelected) {
            return 'white';
        }
        return category.color;
    };

    const getTextColor = () => {
        if (isSelected) {
            return category.color;
        }
        return isDark ? themeColors.text : themeColors.text;
    };

    const getBadgeStyles = () => {
        if (isSelected) {
            return {
                backgroundColor: isDark ? `${category.color}20` : `${category.color}15`,
                color: category.color,
                borderColor: `${category.color}40`
            };
        }
        return {
            backgroundColor: isDark ? themeColors.badgeBg : themeColors.badgeBg,
            color: isDark ? themeColors.badgeText : themeColors.badgeText,
            borderColor: isDark ? themeColors.badgeBorder : themeColors.badgeBorder
        };
    };

    const getRingColor = () => {
        return `${category.color}60`;
    };

    return (
        <motion.div
            key={category.id}
            layout={showAnimation}
            initial={showAnimation ? { opacity: 0, scale: 0.9 } : false}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
        >
            <button
                onClick={() => handleCategoryClick(category.id)}
                disabled={isPending}
                className={cn(
                    "relative p-3 overflow-hidden group transition-all duration-300",
                    "border-2 backdrop-blur-sm rounded-xl",
                    "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2",
                    isPendingItem && "animate-pulse",
                    // Enhanced disabled state
                    isPending && "opacity-60 cursor-not-allowed"
                )}
                style={{
                    background: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    // Enhanced focus ring
                    '--tw-ring-color': getRingColor(),
                } as React.CSSProperties}
            >
                {/* Enhanced background gradient effect */}
                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: getHoverGradient()
                    }}
                />
                
                {/* Subtle border glow effect for selected items */}
                {isSelected && (
                    <motion.div
                        className="absolute inset-0 rounded-xl opacity-30"
                        style={{
                            background: `linear-gradient(135deg, ${category.color}20, transparent 50%, ${category.color}10)`,
                        }}
                        animate={{
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                )}
                
                {/* Content */}
                <div className="relative z-10 flex items-center space-x-3">
                    {/* Enhanced icon with better dark mode support */}
                    <motion.div
                        animate={isPendingItem ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                            "p-2 rounded-lg transition-all duration-300",
                            "shadow-sm",
                            isSelected && "shadow-md"
                        )}
                        style={{
                            backgroundColor: getIconBackground(),
                            color: getIconColor(),
                            boxShadow: isSelected 
                                ? `0 4px 12px ${category.color}25`
                                : isDark 
                                    ? '0 2px 4px rgba(0, 0, 0, 0.3)'
                                    : '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Icon className="h-4 w-4" />
                    </motion.div>
                    
                    {/* Enhanced text with better typography */}
                    <div className="flex flex-col items-start">
                        <span 
                            className={cn(
                                "text-sm font-medium transition-all duration-300",
                                isSelected && "font-semibold tracking-wide"
                            )}
                            style={{ 
                                color: getTextColor(),
                                textShadow: isSelected && isDark 
                                    ? `0 0 8px ${category.color}40`
                                    : 'none'
                            }}
                        >
                            {category.label}
                        </span>
                    </div>
                    
                    {/* Enhanced badge with better dark mode */}
                    {showCounts && category.count && (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div
                                style={getBadgeStyles()}
                                className={cn(
                                    "inline-flex items-center justify-center text-xs h-6 px-2 font-medium border rounded-md transition-all duration-300",
                                    isSelected && "shadow-sm"
                                )}
                            >
                                {category.count > 999 ? '999+' : category.count}
                            </div>
                        </motion.div>
                    )}
                
                </div>
                
                {/* Enhanced loading indicator */}
                {isPendingItem && (
                    <motion.div
                        className={cn(
                            "absolute inset-0 flex items-center justify-center rounded-xl",
                            isDark ? "bg-gray-900/70" : "bg-white/70"
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ backdropFilter: 'blur(2px)' }}
                    >
                        <div className="flex flex-col items-center space-y-2">
                            <div 
                                className="h-4 w-4 border-2 border-transparent rounded-full animate-spin"
                                style={{ 
                                    borderTopColor: category.color,
                                    borderRightColor: `${category.color}40`
                                }}
                            />
                            <span 
                                className="text-xs font-medium"
                                style={{ color: category.color }}
                            >
                                Updating...
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* Accessibility improvements */}
                <span className="sr-only">
                    {isSelected ? `Remove ${category.label} filter` : `Add ${category.label} filter`}
                    {category.count && ` - ${category.count} items`}
                </span>
            </button>
        </motion.div>
    );
};

export default CategoryItem;