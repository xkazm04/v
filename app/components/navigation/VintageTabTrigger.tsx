import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { memo, useState } from "react";
import { TabsTrigger } from "../ui/tabs";
import { motion } from "framer-motion";

const VintageTabTrigger = memo(function VintageTabTrigger({ 
  value, 
  label, 
  icon: Icon, 
  isActive, 
  onClick 
}: {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  isActive: boolean;
  onClick: () => void;
}) {
  const { colors, isDark, vintage, getCardColors } = useLayoutTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  const cardColors = getCardColors(isActive, isHovered);

  return (
    <TabsTrigger 
      value={value}
      className="relative overflow-hidden transition-all duration-300 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent bg-transparent border-none p-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 relative"
        style={{
          background: cardColors.background,
          border: cardColors.border,
          boxShadow: cardColors.shadow
        }}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={{
          scale: isActive ? 1.02 : 1
        }}
      >
        {/* Vintage paper texture for light mode */}
        {!isDark && (
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none rounded-xl"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(139, 69, 19, 0.02) 1px, transparent 1px)
              `,
              backgroundSize: '25px 25px'
            }}
          />
        )}

        {/* Icon */}
        <motion.div
          animate={{
            rotate: isHovered ? 8 : 0,
            scale: isActive ? 1.1 : 1
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon 
            className="w-5 h-5" 
            style={{ 
              color: isActive 
                ? (isDark ? colors.primary : '#b8860b')
                : (isDark ? colors.mutedForeground : vintage.faded)
            }} 
          />
        </motion.div>

        {/* Label */}
        <motion.span
          className="font-semibold text-sm whitespace-nowrap"
          style={{ 
            color: isActive 
              ? (isDark ? colors.primary : '#b8860b')
              : (isDark ? colors.foreground : vintage.ink),
            fontFamily: '"Playfair Display", serif',
            textShadow: !isDark && isActive ? '0 1px 1px rgba(139, 69, 19, 0.1)' : 'none'
          }}
          animate={{
            x: isHovered ? 2 : 0
          }}
        >
          {label}
        </motion.span>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-1/2 w-1/2 h-0.5 rounded-full"
            style={{ 
              background: isDark ? colors.primary : '#b8860b'
            }}
            initial={{ scaleX: 0, x: '-50%' }}
            animate={{ scaleX: 1, x: '-50%' }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        )}

        {/* Vintage corner ornament for active state */}
        {!isDark && isActive && (
          <div 
            className="absolute top-1 right-1 w-1.5 h-1.5 opacity-30"
            style={{
              background: vintage.aged,
              clipPath: 'polygon(0 0, 100% 0, 0 100%)'
            }}
          />
        )}

        {/* Selection pulse effect */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ 
              border: isDark 
                ? `1px solid ${colors.primary}40` 
                : '1px solid rgba(184, 134, 11, 0.3)'
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    </TabsTrigger>
  );
});

export default VintageTabTrigger;