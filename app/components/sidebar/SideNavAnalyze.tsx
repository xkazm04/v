import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FlaskConical, Zap } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';

interface SideNavAnalyzeProps {
  isActive: (path: string) => boolean;
  mounted: boolean;
}

const SideNavAnalyze: React.FC<SideNavAnalyzeProps> = ({
  isActive,
  mounted
}) => {
  const { colors, isDark, vintage } = useLayoutTheme();
  const { preferences } = useUserPreferences();
  const router = useRouter();

  const shouldShow = !preferences.language || preferences.language === 'en';

  if (!shouldShow || !mounted) {
    return null;
  }

  const isActiveRoute = isActive('/upload');

  const handleClick = () => {
    router.push('/upload');
  };

  const experimentalColors = isDark ? {
    // Dark mode: Futuristic neon theme
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(167, 139, 250, 0.1))',
    border: 'rgba(139, 92, 246, 0.4)',
    text: '#a78bfa',
    glow: '0 0 20px rgba(139, 92, 246, 0.3)',
    sparkle: '#fbbf24',
    accent: '#8b5cf6',
    hover: {
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(167, 139, 250, 0.2))',
      glow: '0 0 30px rgba(139, 92, 246, 0.5)',
      transform: 'translateY(-1px)'
    }
  } : {
    // Light mode: Vintage experimental theme
    background: vintage?.paper || '#f8f6f0',
    border: vintage?.sepia || '#d4c4a8',
    text: vintage?.ink || '#2c1810',
    glow: vintage?.shadow || 'rgba(139, 69, 19, 0.15)',
    sparkle: '#b45309',
    accent: '#92400e',
    hover: {
      background: vintage?.highlight || '#fff8e7',
      glow: 'rgba(139, 69, 19, 0.25)',
      transform: 'translateY(-1px)'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className="relative"
    >
      {/* Experimental label */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="absolute -top-2 -right-1 z-10"
      >
        <div 
          className="text-xs px-2 py-0.5 rounded-full font-bold"
          style={{
            background: isDark 
              ? 'linear-gradient(45deg, #fbbf24, #f59e0b)' 
              : 'linear-gradient(45deg, #b45309, #92400e)',
            color: isDark ? '#1f2937' : '#fff8e7',
            boxShadow: isDark 
              ? '0 2px 8px rgba(251, 191, 36, 0.3)'
              : '0 2px 8px rgba(139, 69, 19, 0.3)'
          }}
        >
          BETA
        </div>
      </motion.div>

      {/* Main button */}
      <motion.button
        onClick={handleClick}
        className={`
          relative w-full p-3 rounded-xl border-2 transition-all duration-300 group overflow-hidden
          ${isActiveRoute ? 'shadow-lg' : 'shadow-md'}
        `}
        style={{
          background: isActiveRoute 
            ? experimentalColors.hover.background 
            : (isDark ? experimentalColors.background : experimentalColors.background),
          borderColor: experimentalColors.border,
          color: experimentalColors.text,
          boxShadow: isActiveRoute 
            ? experimentalColors.hover.glow 
            : experimentalColors.glow
        }}
        whileHover={!isActiveRoute ? {
          background: experimentalColors.hover.background,
          boxShadow: experimentalColors.hover.glow,
          y: -1,
          transition: { duration: 0.2 }
        } : {}}
        whileTap={{ scale: 0.98 }}
      >

        {/* Floating sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: 1
            }}
            className="absolute bottom-2 left-2"
          >
            <Zap 
              className="h-2.5 w-2.5" 
              style={{ color: experimentalColors.sparkle }}
            />
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center gap-3">
          {/* Icon container */}
          <motion.div
            className="flex-shrink-0 relative"
            animate={isActiveRoute ? {
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{
              duration: 2,
              repeat: isActiveRoute ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <div 
              className="p-2 rounded-lg"
              style={{
                background: isDark 
                  ? 'rgba(139, 92, 246, 0.2)' 
                  : 'rgba(139, 69, 19, 0.1)',
                border: `1px solid ${experimentalColors.border}`
              }}
            >
              <FlaskConical 
                className="h-5 w-5" 
                style={{ color: experimentalColors.accent }}
              />
            </div>

            {isActiveRoute && (
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  border: `2px solid ${experimentalColors.accent}`,
                }}
              />
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Analyze</span>
            </div>
          </div>

          {/* Arrow indicator */}
          <motion.div
            animate={isActiveRoute ? {
              x: [0, 3, 0]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: isActiveRoute ? Infinity : 0,
              ease: "easeInOut"
            }}
            className="flex-shrink-0"
          >
            <div 
              className="text-lg font-bold"
              style={{ color: experimentalColors.accent }}
            >
              →
            </div>
          </motion.div>
        </div>
      </motion.button>

      {/* Glow effect for dark mode */}
      {isDark && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none -z-10"
          animate={{
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.2), transparent 70%)',
            filter: 'blur(10px)'
          }}
        />
      )}
    </motion.div>
  );
};

export default SideNavAnalyze;