import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useRouter } from "next/navigation";
import { memo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const VintageBackButton = memo(function VintageBackButton() {
  const router = useRouter();
  const { colors, isDark, vintage, getCardColors } = useLayoutTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  const cardColors = getCardColors(false, isHovered);

  return (
    <motion.button
      onClick={() => router.push('/')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
        style={{
          background: cardColors.background,
          border: cardColors.border,
          boxShadow: cardColors.shadow
        }}
      >
        {/* Vintage paper texture overlay for light mode */}
        {!isDark && (
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none rounded-xl"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
                radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.015) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px, 20px 20px'
            }}
          />
        )}

        {/* Icon with vintage styling */}
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            x: isHovered ? -2 : 0,
            rotate: isHovered ? -5 : 0
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ArrowLeft 
            className="w-5 h-5 relative z-10" 
            style={{ 
              color: isDark ? colors.primary : vintage.ink,
              filter: !isDark ? 'drop-shadow(0 1px 1px rgba(139, 69, 19, 0.1))' : 'none'
            }} 
          />
        </motion.div>

        {/* Vintage corner decoration */}
        {!isDark && (
          <div 
            className="absolute top-1 right-1 w-2 h-2 opacity-30"
            style={{
              background: vintage.aged,
              clipPath: 'polygon(0 0, 100% 0, 0 100%)',
              transform: 'rotate(45deg)'
            }}
          />
        )}
      </motion.div>
    </motion.button>
  );
});

export default VintageBackButton;