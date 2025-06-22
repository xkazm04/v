import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { 
  Monitor,
  Sun,
  Moon,
  Sparkles,
  Eye
} from 'lucide-react';

interface ThemeOption {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  color: string;
}

interface SetAppearanceThemeProps {
  option: ThemeOption;
  isSelected: boolean;
  isHovered: boolean;
  isUpdating: boolean;
  index: number;
  onSelect: (themeId: string) => void;
  onHover: (themeId: string | null) => void;
}

export function SetAppearanceTheme({
  option,
  isSelected,
  isHovered,
  isUpdating,
  index,
  onSelect,
  onHover
}: SetAppearanceThemeProps) {
  const { colors, isDark } = useLayoutTheme();
  const IconComponent = option.icon;

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <motion.button
      onClick={() => onSelect(option.id)}
      onMouseEnter={() => onHover(option.id)}
      onMouseLeave={() => onHover(null)}
      disabled={isUpdating}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
    >
      <motion.div
        className="relative p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden"
        style={{
          background: isSelected || isHovered
            ? `linear-gradient(135deg, ${option.color}20, ${option.color}10)`
            : isDark 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
              : 'linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.02))',
          borderColor: isSelected ? colors.primary : 'transparent',
          boxShadow: isSelected 
            ? `0 10px 30px ${colors.primary}25`
            : isHovered
              ? `0 10px 30px rgba(0,0,0,0.1)`
              : 'none'
        }}
        animate={{
          scale: isSelected ? 1.02 : 1
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Animated background particles for selected/hovered */}
        <AnimatePresence>
          {(isSelected || isHovered) && (
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.3, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ 
                    background: option.color,
                    left: `${10 + i * 12}%`,
                    top: `${15 + (i % 3) * 30}%`
                  }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Icon Display */}
        <div className="text-center mb-4">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background: `linear-gradient(135deg, ${option.color}20, ${option.color}10)`,
              border: `2px solid ${option.color}30`
            }}
            animate={{
              scale: isSelected || isHovered ? 1.1 : 1,
              rotate: isHovered ? 8 : 0
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <IconComponent 
              className="w-8 h-8" 
              style={{ color: option.color }} 
            />
          </motion.div>
          
          {/* Selection Indicator */}
          <div className="h-6 flex justify-center">
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: colors.primary }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <Eye className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Theme Information */}
        <div className="text-center space-y-2">
          <motion.h3 
            className="text-lg font-bold leading-tight"
            style={{ 
              color: isSelected ? colors.primary : colors.foreground 
            }}
            animate={{
              color: isSelected ? colors.primary : colors.foreground
            }}
          >
            {option.label}
          </motion.h3>

          <div className="text-sm text-muted-foreground">
            {option.description}
          </div>

          {/* Status Badge */}
          <motion.div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: `${option.color}15`,
              border: `1px solid ${option.color}30`
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-3 h-3" style={{ color: option.color }} />
            <span style={{ color: option.color }}>
              {isSelected ? 'Active' : 'Available'}
            </span>
          </motion.div>
        </div>

        {/* Selection Pulse Effect */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
            style={{ borderColor: colors.primary }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [1, 1.04, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Hover Glow Effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${option.color}15, transparent 70%)`
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}

// Export theme options configuration
export const THEME_OPTIONS = [
  {
    id: 'light',
    label: 'Light',
    description: 'Clean and bright',
    icon: Sun,
    gradient: 'from-amber-400 to-orange-500',
    color: '#f59e0b'
  },
  {
    id: 'dark',
    label: 'Dark',
    description: 'Easy on the eyes',
    icon: Moon,
    gradient: 'from-indigo-600 to-purple-600',
    color: '#8b5cf6'
  },
  {
    id: 'system',
    label: 'System',
    description: 'Matches your device',
    icon: Monitor,
    gradient: 'from-gray-600 to-gray-800',
    color: '#6b7280'
  }
];