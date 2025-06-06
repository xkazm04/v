'use client';

import { motion } from 'framer-motion';
import { cn } from '@/app/lib/utils';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Category } from '@/app/types/category';

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  isPending: boolean;
  showAnimation: boolean;
  onClick: (categoryId: string) => void;
  showCounts: boolean;
}

export function CategoryItem({ 
  category, 
  isSelected, 
  isPending, 
  showAnimation, 
  onClick, 
  showCounts 
}: CategoryItemProps) {
  const { colors, isDark } = useLayoutTheme();
  const IconComponent = category.icon;

  const categoryStyles = {
    base: {
      background: isSelected 
        ? isDark 
          ? `linear-gradient(135deg, ${category.color}20, ${category.color}10)`
          : `linear-gradient(135deg, ${category.color}15, ${category.color}08)`
        : isDark
          ? 'rgba(30, 41, 59, 0.5)'
          : 'rgba(248, 250, 252, 0.8)',
      border: `1px solid ${isSelected 
        ? category.color 
        : isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.6)'
      }`,
      color: isSelected 
        ? category.color 
        : colors.foreground,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      boxShadow: isSelected 
        ? `0 4px 20px ${category.color}20, 0 0 0 1px ${category.color}30`
        : isDark
          ? '0 2px 8px rgba(0, 0, 0, 0.3)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    hover: {
      background: isSelected
        ? isDark 
          ? `linear-gradient(135deg, ${category.color}30, ${category.color}15)`
          : `linear-gradient(135deg, ${category.color}20, ${category.color}10)`
        : isDark
          ? 'rgba(51, 65, 85, 0.6)'
          : 'rgba(241, 245, 249, 0.9)',
      borderColor: category.color,
      boxShadow: `0 6px 25px ${category.color}25, 0 0 0 1px ${category.color}40`
    }
  };

  const motionProps = showAnimation ? {
    whileHover: categoryStyles.hover,
    whileTap: { scale: 0.95 },
    animate: isPending ? { scale: [1, 1.05, 1] } : {},
    transition: { duration: 0.2 }
  } : {};

  return (
    <motion.button
      {...motionProps}
      onClick={() => onClick(category.id)}
      disabled={isPending}
      className={cn(
        "relative inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium",
        "transition-all duration-200 cursor-pointer select-none",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        isPending && "opacity-70 cursor-not-allowed"
      )}
      style={categoryStyles.base}
    >
      {/* Icon */}
      <motion.div
        animate={isPending ? { rotate: 360 } : {}}
        transition={{ duration: 0.5 }}
      >
        <IconComponent 
          className={cn("h-4 w-4", isSelected && "drop-shadow-sm")}
          style={{ color: isSelected ? category.color : colors.mutedForeground }}
        />
      </motion.div>

      {/* Label */}
      <span className="font-medium">
        {category.label}
      </span>

      {/* Count Badge */}
      {showCounts && typeof category.count === 'number' && category.count > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-1 px-1.5 py-0.5 rounded-md text-xs font-semibold"
          style={{
            background: isSelected 
              ? `${category.color}20` 
              : isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(148, 163, 184, 0.3)',
            color: isSelected ? category.color : colors.mutedForeground
          }}
        >
          {category.count}
        </motion.div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
          style={{ 
            background: category.color,
            boxShadow: `0 2px 8px ${category.color}50`
          }}
        />
      )}

      {/* Loading indicator */}
      {isPending && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-transparent"
          style={{ borderColor: category.color }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
    </motion.button>
  );
}