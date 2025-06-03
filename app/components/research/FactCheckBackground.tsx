"use client";

import { motion } from "framer-motion";
import { Shield, Activity } from "lucide-react";

interface FactCheckBackgroundProps {
  factCheckCount: number;
  isActive: boolean;
}

export function FactCheckBackground({ factCheckCount, isActive }: FactCheckBackgroundProps) {
  return (
    <motion.div
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        background: isActive 
          ? `linear-gradient(135deg, 
              rgba(15, 23, 42, 0.95) 0%,
              rgba(30, 41, 59, 0.98) 100%
            )`
          : `linear-gradient(135deg, 
              rgba(71, 85, 105, 0.1) 0%,
              rgba(100, 116, 139, 0.15) 100%
            )`,
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
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}
          >
            <Shield className="w-8 h-8 text-blue-400" />
          </motion.div>
          
          <h3 className="text-lg font-semibold mb-2 text-slate-300">
            Monitor
          </h3>
          
          {factCheckCount > 0 && (
            <div 
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#3b82f6'
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
            background: `linear-gradient(45deg, 
              transparent, 
              rgba(59, 130, 246, 0.1), 
              transparent
            )`,
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