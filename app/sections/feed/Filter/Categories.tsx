import { Divider } from "@/app/components/ui/divider"
import { CategoryItem } from "./CategoryItem"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useMemo } from "react";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { ChevronDown, Users, Shield, Leaf, TrendingUp, Heart, Zap, Globe, Briefcase, Building } from "lucide-react";
import { Category } from "@/app/types/category";

const BASE_CATEGORIES: Omit<Category, 'count'>[] = [
  // Default categories (always visible)
  { id: 'politics', label: 'Politics', icon: Users, color: '#3b82f6', isDefault: true },
  { id: 'military', label: 'Military', icon: Shield, color: '#ef4444', isDefault: true },
  { id: 'environment', label: 'Environment', icon: Leaf, color: '#22c55e', isDefault: true },
  
  // Expandable categories
  { id: 'economy', label: 'Economy', icon: TrendingUp, color: '#f59e0b' },
  { id: 'healthcare', label: 'Healthcare', icon: Heart, color: '#ec4899' },
  { id: 'technology', label: 'Technology', icon: Zap, color: '#8b5cf6' },
  { id: 'international', label: 'International', icon: Globe, color: '#06b6d4' },
  { id: 'education', label: 'Education', icon: Briefcase, color: '#84cc16' },
  { id: 'social', label: 'Social', icon: Building, color: '#64748b' },
  { id: 'other', label: 'Other', icon: Building, color: '#64748b' },
];

type Props = {
    categoryCounts?: Record<string, number>;
    selectedCategories: string[];
    showCounts?: boolean;
    countsLoading?: boolean;
    hasCountsError?: boolean;
    pendingSelection?: string | null;
    handleCategoryClick: (categoryId: string) => void;
}

const Categories = ({ categoryCounts, selectedCategories, showCounts = true, countsLoading = false, hasCountsError = false, pendingSelection, handleCategoryClick }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { colors, isDark } = useLayoutTheme();

    // Merge base categories with actual counts from API (with fallback)
    const allCategories = useMemo(() => {
        return BASE_CATEGORIES.map(cat => ({
            ...cat,
            count: categoryCounts?.[cat.id] || 0
        }));
    }, [categoryCounts]);

    // Split categories into default and expandable
    const defaultCategories = useMemo(() =>
        allCategories.filter(cat => cat.isDefault),
        [allCategories]
    );

    const expandableCategories = useMemo(() =>
        allCategories.filter(cat => !cat.isDefault),
        [allCategories]
    );

    return <>
        <div className="flex flex-wrap gap-3">
            {defaultCategories.map(category => (
                <CategoryItem
                    key={category.id}
                    category={category}
                    isSelected={selectedCategories.includes(category.id)}
                    isPending={pendingSelection === category.id}
                    showAnimation={true}
                    onClick={handleCategoryClick}
                    showCounts={showCounts && !countsLoading && !hasCountsError}
                />
            ))}

            {/* Expand/Collapse Toggle */}
            <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                    background: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(148, 163, 184, 0.2)',
                    border: `1px solid ${isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(148, 163, 184, 0.3)'}`,
                    color: colors.mutedForeground
                }}
                whileHover={{
                    background: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(148, 163, 184, 0.3)',
                    scale: 1.02
                }}
                whileTap={{ scale: 0.98 }}
            >
                <span>{isExpanded ? 'Less' : 'More'}</span>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <ChevronDown className="h-4 w-4" />
                </motion.div>
            </motion.button>
        </div>

        {/* Expandable Categories */}
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <Divider />
                    <motion.div
                        className="flex flex-wrap gap-3"
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        {expandableCategories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.05,
                                    ease: "easeOut"
                                }}
                            >
                                <CategoryItem
                                    category={category}
                                    isSelected={selectedCategories.includes(category.id)}
                                    isPending={pendingSelection === category.id}
                                    showAnimation={false}
                                    onClick={handleCategoryClick}
                                    showCounts={showCounts && !countsLoading && !hasCountsError}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </>
}

export default Categories;