import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';
import { ColorSubtoneSelector } from './ColorSubtoneSelector';
import { 
  Sun,
  Moon,
  Sparkles,
  Eye,
  Settings
} from 'lucide-react';

const SetAppearance = memo(function SetAppearance() {
  const { theme, setTheme } = useTheme();
  const { colors, isDark, vintage, getCardColors } = useLayoutTheme();
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25
      }
    }
  };

  const themeOptions = [
    {
      id: 'light',
      label: 'Light',
      description: 'Clean and bright interface',
      icon: Sun,
      color: '#b8860b'
    },
    {
      id: 'dark',
      label: 'Dark', 
      description: 'Easy on the eyes',
      icon: Moon,
      color: '#8b5cf6'
    }
  ];

  // Sync theme changes
  useEffect(() => {
    if (theme) {
      handleThemeUpdate(theme as 'light' | 'dark' | 'system');
    }
  }, [theme]);

  const handleThemeUpdate = async (newTheme: 'light' | 'dark' | 'system') => {
    try {
      setTheme(newTheme);
    } catch (error) {
      console.error('Error updating theme:', error);
    } finally {
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <GlassContainer
        style="frosted"
        border="glow"
        rounded="3xl"
        shadow="glow"
        className="relative overflow-hidden p-2"
      >
        <div className="relative z-10 px-8 pb-12 space-y-16">
          {/* ✅ Enhanced Header */}
          <motion.div variants={itemVariants}>
            <div className="text-center mb-10">
              <motion.div
                className="inline-flex items-center justify-center gap-3 mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  className="relative p-3 rounded-2xl"
                  style={{ 
                    background: isDark 
                      ? `linear-gradient(135deg, ${colors.primary}25, ${colors.primary}10)`
                      : `linear-gradient(135deg, ${vintage.highlight}, ${vintage.paper})`,
                    border: isDark 
                      ? `1px solid ${colors.primary}30`
                      : `2px solid ${vintage.sepia}`,
                    boxShadow: isDark 
                      ? `0 8px 25px ${colors.primary}20`
                      : `0 8px 25px rgba(139, 69, 19, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)`
                  }}
                  whileHover={{ scale: 1.1, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Settings className="w-8 h-8" style={{ 
                    color: isDark ? colors.primary : vintage.ink 
                  }} />
                </motion.div>
              </motion.div>

              <motion.h2 
                className="text-4xl font-bold mb-4"
                style={{ 
                  color: isDark ? colors.foreground : vintage.ink,
                  fontFamily: '"Playfair Display", "Times New Roman", serif',
                  textShadow: isDark ? 'none' : '0 1px 2px rgba(139, 69, 19, 0.1)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Theme Selection
              </motion.h2>
              
              <motion.p 
                className="text-lg max-w-2xl mx-auto leading-relaxed"
                style={{ 
                  color: isDark ? colors.mutedForeground : vintage.faded,
                  fontFamily: '"Crimson Text", Georgia, serif'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Choose your preferred theme mode for the perfect viewing experience
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {themeOptions.map((option, index) => {
                const isSelected = theme === option.id;
                const isHovered = hoveredTheme === option.id;
                const IconComponent = option.icon;
                const cardColors = getCardColors(isSelected, isHovered); // ✅ Use universal function

                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleThemeUpdate(option.id as any)}
                    onMouseEnter={() => setHoveredTheme(option.id)}
                    onMouseLeave={() => setHoveredTheme(null)}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <motion.div
                      className="relative p-6 rounded-2xl transition-all duration-300 overflow-hidden"
                      style={{
                        background: cardColors.background, // ✅ Use universal colors
                        border: cardColors.border,
                        boxShadow: cardColors.shadow
                      }}
                    >
                      {/* ✅ Vintage paper texture overlay for light mode */}
                      {!isDark && (
                        <div 
                          className="absolute inset-0 opacity-30 pointer-events-none"
                          style={{
                            backgroundImage: `
                              radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
                              radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.015) 1px, transparent 1px)
                            `,
                            backgroundSize: '60px 60px, 40px 40px'
                          }}
                        />
                      )}

                      {/* Enhanced Icon Display */}
                      <div className="text-center mb-5">
                        <motion.div
                          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                          style={{
                            background: isDark
                              ? `linear-gradient(135deg, ${option.color}20, ${option.color}10)`
                              : `linear-gradient(135deg, ${option.color}15, ${option.color}08)`,
                            border: isDark
                              ? `2px solid ${option.color}30`
                              : `2px solid ${option.color}25`
                          }}
                          animate={{
                            scale: isSelected || isHovered ? 1.1 : 1,
                            rotate: isHovered ? 8 : 0
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <IconComponent className="w-8 h-8" style={{ color: option.color }} />
                        </motion.div>
                        
                        {/* Selection Indicator */}
                        <div className="h-6 flex justify-center">
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{ 
                                  background: isDark 
                                    ? colors.primary 
                                    : 'linear-gradient(135deg, #b8860b, #cd853f)'
                                }}
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 90 }}
                                transition={{ type: "spring", stiffness: 500 }}
                              >
                                <Eye className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* ✅ Enhanced Theme Information */}
                      <div className="text-center space-y-3">
                        <motion.h3 
                          className="text-xl font-bold leading-tight"
                          style={{ 
                            color: isSelected 
                              ? (isDark ? colors.primary : '#b8860b')
                              : (isDark ? colors.foreground : vintage.ink),
                            fontFamily: '"Playfair Display", serif'
                          }}
                        >
                          {option.label}
                        </motion.h3>

                        <div 
                          className="text-sm leading-relaxed"
                          style={{ 
                            color: isDark ? colors.mutedForeground : vintage.faded,
                            fontFamily: '"Crimson Text", serif'
                          }}
                        >
                          {option.description}
                        </div>

                        {/* ✅ Enhanced Status Badge */}
                        <motion.div
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{
                            background: isDark
                              ? `${option.color}15`
                              : `linear-gradient(135deg, ${option.color}10, ${option.color}05)`,
                            border: isDark
                              ? `1px solid ${option.color}30`
                              : `1px solid ${option.color}25`,
                            color: option.color
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{isSelected ? 'Active' : 'Available'}</span>
                        </motion.div>
                      </div>

                      {/* ✅ Enhanced Selection Pulse Effect */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          style={{ 
                            border: isDark 
                              ? `2px solid ${colors.primary}` 
                              : '2px solid rgba(184, 134, 11, 0.4)'
                          }}
                          animate={{
                            opacity: [0, 0.6, 0],
                            scale: [1, 1.02, 1]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}

                      {/* ✅ Vintage corner ornaments for light mode */}
                      {!isDark && isSelected && (
                        <>
                          <div 
                            className="absolute top-2 left-2 w-2 h-2 opacity-20"
                            style={{
                              background: vintage.ink,
                              clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                            }}
                          />
                          <div 
                            className="absolute bottom-2 right-2 w-2 h-2 opacity-20"
                            style={{
                              background: vintage.ink,
                              clipPath: 'polygon(100% 100%, 0 100%, 100% 0)'
                            }}
                          />
                        </>
                      )}
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Color Subtone Section */}
          <motion.div variants={itemVariants}>
            <ColorSubtoneSelector />
          </motion.div>
        </div>
      </GlassContainer>
    </motion.div>
  );
});

export default SetAppearance;