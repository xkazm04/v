"use client";

import { colors } from "@/app/constants/colors";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useTheme } from "next-themes"; // If you're using next-themes

interface FactCheckBackgroundProps {
  factCheckCount: number;
  isActive: boolean;
}

export function FactCheckBackground({ factCheckCount, isActive }: FactCheckBackgroundProps) {
  const { theme } = useTheme(); // Optional: if using theme context
  
  const currentColors = colors[theme === 'dark' ? 'dark' : 'light'];

  return (
    <motion.div
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        background: isActive ? currentColors.active : currentColors.inactive,
        transition: 'all 0.5s ease'
      }}
      transition={{
        duration: isActive ? 2 : 0,
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {/* Placeholder Content */}
      {!isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{
              background: currentColors.iconBg,
              border: `1px solid ${currentColors.iconBorder}`
            }}
          >
            <Shield className="w-8 h-8" style={{ color: '#3b82f6' }} />
          </motion.div>
          
          <h3 className="text-lg font-semibold mb-2" style={{ color: currentColors.text }}>
            Monitor
          </h3>
          
          {factCheckCount > 0 && (
            <div 
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: currentColors.badgeBg,
                border: `1px solid ${currentColors.badgeBorder}`,
                color: currentColors.badgeText
              }}
            >
              {factCheckCount} statement{factCheckCount !== 1 ? 's' : ''} checked
            </div>
          )}
        </motion.div>
      )}

      {/* Active Glow Effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: theme === 'dark' 
              ? `linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent)`
              : `linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.08), transparent)`,
            backgroundSize: '200% 200%'
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}
    </motion.div>
  );
}