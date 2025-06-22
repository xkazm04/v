import { motion, AnimatePresence } from 'framer-motion';
import { Check, Eye } from 'lucide-react';
import { ColorSubtone, SubtoneConfig } from '@/app/stores/appearance';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface SetAppearanceSubtoneProps {
  subtone: ColorSubtone;
  config: SubtoneConfig;
  isSelected: boolean;
  isHovered: boolean;
  index: number;
  onSelect: (subtone: ColorSubtone) => void;
  onHover: (subtone: ColorSubtone | null) => void;
}

export function SetAppearanceSubtone({
  subtone,
  config,
  isSelected,
  isHovered,
  index,
  onSelect,
  onHover
}: SetAppearanceSubtoneProps) {
  const { colors, isDark } = useLayoutTheme();

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.9 },
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
      onClick={() => onSelect(subtone)}
      onMouseEnter={() => onHover(subtone)}
      onMouseLeave={() => onHover(null)}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 }}
      whileHover={{ 
        scale: 1.08, 
        y: -6,
        transition: { type: "spring", stiffness: 300 }
      }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
    >
      <motion.div
        className="relative flex flex-col items-center gap-4 p-5 rounded-2xl transition-all duration-300 overflow-hidden"
        style={{
          background: isSelected || isHovered
            ? `linear-gradient(135deg, ${config.preview}20, ${config.preview}10)`
            : isDark 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
              : 'linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.02))',
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
        {/* Animated background particles */}
        <AnimatePresence>
          {(isSelected || isHovered) && (
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.4, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ 
                    background: config.preview,
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 2) * 60}%`
                  }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Enhanced Color Preview */}
        <div className="relative">
          <motion.div
            className="relative w-12 h-12 rounded-2xl shadow-lg overflow-hidden"
            style={{ borderColor: isSelected ? colors.primary : colors.border }}
            animate={{
              boxShadow: isSelected || isHovered
                ? `0 8px 25px ${config.preview}40`
                : `0 2px 8px rgba(0,0,0,0.1)`
            }}
          >
            {/* Base color */}
            <div
              className="w-full h-full"
              style={{
                background: subtone === 'neutral' 
                  ? `linear-gradient(45deg, 
                      ${isDark ? '#374151' : '#f8f9fa'} 25%, 
                      ${isDark ? '#4b5563' : '#e9ecef'} 25%, 
                      ${isDark ? '#4b5563' : '#e9ecef'} 50%, 
                      ${isDark ? '#374151' : '#f8f9fa'} 50%, 
                      ${isDark ? '#374151' : '#f8f9fa'} 75%, 
                      ${isDark ? '#4b5563' : '#e9ecef'} 75%, 
                      ${isDark ? '#4b5563' : '#e9ecef'})`
                  : `linear-gradient(135deg, ${config.preview}, ${config.preview}dd)`,
                backgroundSize: subtone === 'neutral' ? '8px 8px' : undefined
              }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)`,
              }}
              animate={{
                x: [-48, 48],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          
          {/* Enhanced Selection indicator */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 180 }}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: colors.primary }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hover indicator */}
          <AnimatePresence>
            {isHovered && !isSelected && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: `${config.preview}80` }}
              >
                <Eye className="w-2.5 h-2.5 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Enhanced Label */}
        <div className="text-center space-y-2">
          <motion.div 
            className="text-sm font-bold text-foreground"
            animate={{
              color: isSelected || isHovered ? config.preview : colors.foreground
            }}
          >
            {config.label}
          </motion.div>
          <div className="text-xs text-muted-foreground line-clamp-2 h-8">
            {config.description}
          </div>
        </div>
        
        {/* Selection ring with animation */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              layoutId="subtone-selection"
              className="absolute inset-0 rounded-2xl border-1 pointer-events-none"
              style={{ borderColor: colors.primary }}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </AnimatePresence>

        {/* Pulse effect for selected item */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-1 pointer-events-none"
            style={{ borderColor: colors.primary }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.05, 1]
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
                background: `radial-gradient(circle at center, ${config.preview}15, transparent 70%)`
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