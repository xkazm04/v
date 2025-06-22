import { useTransform } from "framer-motion";
import { memo } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

const FloatingSummaryButton = memo(({ 
  onClick, 
  colors, 
  isDark, 
  vintage, 
  isMobile,
  scrollProgress 
}: any) => {
  const buttonOpacity = useTransform(scrollProgress, [0.7, 0.85], [0, 1]);
  const buttonY = useTransform(scrollProgress, [0.7, 0.85], [50, 0]);

  return (
    <motion.div
      className={`fixed ${isMobile ? 'bottom-16 left-6' : 'bottom-[400px] left-[10%]'} z-[9998]`}
      style={{
        opacity: buttonOpacity,
        y: buttonY
      }}
    >
      <motion.button
        className="group relative overflow-hidden rounded-full p-4 backdrop-blur-md shadow-2xl"
        style={{
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(248, 250, 252, 0.95)',
          border: `2px solid ${colors.primary}`,
          boxShadow: `0 8px 32px ${colors.primary}30`
        }}
        onClick={onClick}
        whileHover={{ 
          scale: 1.1,
          boxShadow: `0 12px 40px ${colors.primary}40`
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 0.5
        }}
      >
        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: colors.primary }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Sparkle particles */}
        <motion.div
          className="absolute inset-0"
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: colors.primary,
                left: '50%',
                top: '50%',
                transformOrigin: `0 ${20 + i * 5}px`
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Button content */}
        <div className="relative z-10 flex items-center justify-center">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <BookOpen 
              className="w-10 h-10" 
              style={{ color: colors.primary }} 
            />
          </motion.div>
        </div>

        {/* Tooltip */}
        <motion.div
          className="absolute bottom-full right-0 mb-2 px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            backgroundColor: isDark ? colors.background : vintage.paper,
            color: isDark ? colors.foreground : vintage.ink,
            border: `1px solid ${colors.border}`,
            boxShadow: `0 4px 12px ${colors.primary}20`
          }}
        >
          View Timeline Summary
          <div 
            className="absolute top-full right-4 w-2 h-2 rotate-45"
            style={{
              backgroundColor: isDark ? colors.background : vintage.paper,
              borderRight: `1px solid ${colors.border}`,
              borderBottom: `1px solid ${colors.border}`
            }}
          />
        </motion.div>
      </motion.button>
    </motion.div>
  );
});

FloatingSummaryButton.displayName = 'FloatingSummaryButton';

export default FloatingSummaryButton;