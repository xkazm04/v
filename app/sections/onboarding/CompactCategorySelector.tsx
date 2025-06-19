import { motion } from 'framer-motion';
import { 
  Users, 
  Shield, 
  Leaf, 
  TrendingUp, 
  Heart, 
  Zap, 
  Globe, 
  Briefcase, 
  Building 
} from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface Category {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}

// Categories from the main app (matching Categories.tsx)
const AVAILABLE_CATEGORIES: Category[] = [
  { id: 'politics', label: 'Politics', icon: Users, color: '#3b82f6' },
  { id: 'military', label: 'Military', icon: Shield, color: '#ef4444' },
  { id: 'environment', label: 'Environment', icon: Leaf, color: '#22c55e' },
  { id: 'economy', label: 'Economy', icon: TrendingUp, color: '#f59e0b' },
  { id: 'healthcare', label: 'Healthcare', icon: Heart, color: '#ec4899' },
  { id: 'technology', label: 'Technology', icon: Zap, color: '#8b5cf6' },
  { id: 'international', label: 'International', icon: Globe, color: '#06b6d4' },
  { id: 'education', label: 'Education', icon: Briefcase, color: '#84cc16' },
  { id: 'social', label: 'Social', icon: Building, color: '#64748b' },
];

interface CompactCategorySelectorProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  className?: string;
}

const CompactCategorySelector: React.FC<CompactCategorySelectorProps> = ({
  selectedCategories,
  onChange,
  className = ''
}) => {
  const { colors, isDark } = useLayoutTheme();

  const handleCategoryToggle = (categoryId: string) => {
    const isSelected = selectedCategories.includes(categoryId);
    if (isSelected) {
      onChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Category Icons Grid */}
      <div className="flex flex-wrap gap-3">
        {AVAILABLE_CATEGORIES.map((category, index) => {
          const Icon = category.icon;
          const isSelected = selectedCategories.includes(category.id);
          
          return (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryToggle(category.id)}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl text-xs font-medium transition-all duration-200 group ${
                isSelected 
                  ? 'text-white shadow-lg scale-105' 
                  : 'hover:scale-105'
              }`}
              style={{
                background: isSelected 
                  ? category.color
                  : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                borderColor: isSelected ? category.color : colors.border,
                color: isSelected ? 'white' : colors.foreground,
                border: `1px solid ${isSelected ? category.color : colors.border}`
              }}
              whileHover={{ 
                scale: 1.05,
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              {/* Icon */}
              <motion.div
                className="w-8 h-8 flex items-center justify-center"
                animate={{
                  rotate: isSelected ? [0, 10, 0] : 0,
                  scale: isSelected ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              
              {/* Label */}
              <span className="text-xs leading-tight text-center max-w-[60px]">
                {category.label}
              </span>

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </motion.div>
              )}

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20"
                style={{ backgroundColor: category.color }}
                animate={{
                  opacity: isSelected ? 0 : 0
                }}
                whileHover={{ opacity: 0.2 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CompactCategorySelector;