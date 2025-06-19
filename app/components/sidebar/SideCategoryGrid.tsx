'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useFilterStore, useSelectedCategories } from '@/app/stores/filterStore';
import { 
  Users, 
  Shield, 
  Leaf, 
  TrendingUp, 
  Heart, 
  Zap, 
  Globe, 
  Briefcase, 
  Building, 
  GraduationCap 
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/app/lib/utils';

// Category icon mapping - matching CompactCategorySelector
const CATEGORY_ICONS: Record<string, any> = {
  politics: Users,
  military: Shield,
  environment: Leaf,
  economy: TrendingUp,
  healthcare: Heart,
  technology: Zap,
  international: Globe,
  education: GraduationCap,
  social: Building,
  other: Briefcase,
};

// Category color mapping - matching CompactCategorySelector
const CATEGORY_COLORS: Record<string, string> = {
  politics: '#3b82f6',
  military: '#ef4444',
  environment: '#22c55e',
  economy: '#f59e0b',
  healthcare: '#ec4899',
  technology: '#8b5cf6',
  international: '#06b6d4',
  education: '#84cc16',
  social: '#64748b',
  other: '#64748b',
};

type Props = {
    categories: string[];
    isCollapsed: boolean;
    mounted: boolean;
}

const SideCategoryGrid = ({ categories, isCollapsed, mounted }: Props) => {
    const { colors, isDark } = useLayoutTheme();
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    
    // Get current filter state
    const selectedCategories = useSelectedCategories();
    const { toggleCategory } = useFilterStore();

    const handleCategoryClick = (categoryId: string) => {
        toggleCategory(categoryId);
    };

    if (!mounted) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={cn(
                    "grid gap-2 px-1",
                    isCollapsed 
                        ? "grid-cols-2" 
                        : categories.length <= 4 
                            ? "grid-cols-3" 
                            : "grid-cols-4"
                )}
            >
                {categories.map((categoryId, index) => {
                    const IconComponent = CATEGORY_ICONS[categoryId] || Building;
                    const categoryColor = CATEGORY_COLORS[categoryId] || '#64748b';
                    const isSelected = selectedCategories.includes(categoryId);
                    const isHovered = hoveredCategory === categoryId;
                    
                    return (
                        <motion.button
                            key={categoryId}
                            onClick={() => handleCategoryClick(categoryId)}
                            onHoverStart={() => setHoveredCategory(categoryId)}
                            onHoverEnd={() => setHoveredCategory(null)}
                            className={cn(
                                "relative flex items-center justify-center rounded-xl transition-all duration-200 group",
                                isCollapsed ? "h-8 w-8" : "h-10 w-10"
                            )}
                            style={{
                                background: isSelected
                                    ? categoryColor
                                    : isDark 
                                        ? 'rgba(255,255,255,0.05)' 
                                        : 'rgba(0,0,0,0.03)',
                                border: `1px solid ${isSelected ? categoryColor : isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(148, 163, 184, 0.2)'}`,
                                color: isSelected ? 'white' : (isDark ? colors.mutedForeground : colors.foreground),
                                boxShadow: isSelected 
                                    ? `0 4px 12px ${categoryColor}30`
                                    : 'none'
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{
                                scale: 1.05,
                                y: -2,
                                backgroundColor: isSelected 
                                    ? categoryColor 
                                    : isDark 
                                        ? 'rgba(255,255,255,0.08)' 
                                        : 'rgba(0,0,0,0.06)'
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Icon */}
                            <motion.div
                                className="relative z-10"
                                animate={{
                                    rotate: isSelected ? [0, 10, 0] : isHovered ? [0, 5, 0] : 0,
                                    scale: isSelected ? [1, 1.1, 1] : isHovered ? 1.05 : 1
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <IconComponent 
                                    className={cn(
                                        "drop-shadow-sm",
                                        isCollapsed ? "w-3 h-3" : "w-4 h-4"
                                    )}
                                />
                            </motion.div>

                            {/* Selection indicator */}
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        className={cn(
                                            "absolute bg-white rounded-full flex items-center justify-center shadow-lg",
                                            isCollapsed 
                                                ? "-top-1 -right-1 w-3 h-3" 
                                                : "-top-1 -right-1 w-4 h-4"
                                        )}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <div 
                                            className={cn(
                                                "rounded-full",
                                                isCollapsed ? "w-1.5 h-1.5" : "w-2 h-2"
                                            )}
                                            style={{ backgroundColor: categoryColor }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Hover glow effect - matching CompactCategorySelector */}
                            <motion.div
                                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20"
                                style={{ backgroundColor: categoryColor }}
                                animate={{
                                    opacity: isSelected ? 0 : 0
                                }}
                                whileHover={{ opacity: 0.2 }}
                                transition={{ duration: 0.2 }}
                            />

                            {/* Selection pulse effect */}
                            {isSelected && (
                                <motion.div
                                    className="absolute inset-0 rounded-xl border-2 pointer-events-none"
                                    style={{ borderColor: categoryColor }}
                                    animate={{
                                        opacity: [0, 0.4, 0],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </motion.div>

            {/* Category count indicator */}
            {!isCollapsed && categories.length > 0 && selectedCategories.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="px-2 py-1.5 mt-2 rounded-md text-xs"
                    style={{
                        background: isDark 
                            ? 'rgba(71, 85, 105, 0.2)' 
                            : 'rgba(148, 163, 184, 0.15)',
                        color: colors.mutedForeground
                    }}
                >
                    <div className="flex items-center justify-between">
                        <span>{selectedCategories.length} topic{selectedCategories.length > 1 ? 's' : ''} active</span>
                        <div className="flex -space-x-1">
                            {selectedCategories.slice(0, 3).map((categoryId, index) => {
                                const categoryColor = CATEGORY_COLORS[categoryId] || '#64748b';
                                return (
                                    <motion.div
                                        key={categoryId}
                                        className="w-2 h-2 rounded-full border"
                                        style={{ 
                                            backgroundColor: categoryColor,
                                            borderColor: isDark ? '#1e293b' : '#ffffff'
                                        }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                    />
                                );
                            })}
                            {selectedCategories.length > 3 && (
                                <motion.div
                                    className="w-2 h-2 rounded-full border text-xs flex items-center justify-center"
                                    style={{ 
                                        backgroundColor: colors.mutedForeground,
                                        borderColor: isDark ? '#1e293b' : '#ffffff',
                                        fontSize: '6px'
                                    }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    +
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SideCategoryGrid;