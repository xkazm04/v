"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { LLMResearchResponse } from "@/app/types/research";
import { getCategoryIcon } from "../utils/statusConfig";
import { getStampText } from "../../ui/Decorative/StampText";

interface FactCheckHeaderProps {
  factCheck: LLMResearchResponse;
  config: any;
  onDismiss: () => void;
}


const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export function FactCheckHeader({ factCheck, config, onDismiss }: FactCheckHeaderProps) {
  const IconComponent = config.icon;
  const CategoryIcon = getCategoryIcon(factCheck.category || "");
  const stampText = getStampText(factCheck.status);

  return (
    <motion.div
      variants={sectionVariants}
      className="relative p-6 border-b border-slate-200/60 dark:border-slate-700/50 overflow-hidden
                 bg-gradient-to-br from-white/95 to-slate-50/90 dark:from-slate-900/90 dark:to-slate-800/95"
    >

      {/* Content Layer */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Status Icon with Enhanced Glow */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: "spring", bounce: 0.3 }}
              className="relative w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${config.bgColor}, ${config.color}20)`,
                border: `3px solid ${config.borderColor}`,
                boxShadow: `
                  0 0 25px ${config.color}40,
                  0 0 50px ${config.color}20,
                  inset 0 2px 10px ${config.color}15
                `
              }}
            >
              <IconComponent 
                className="w-6 h-6" 
                style={{ color: config.color }}
              />
              
              {/* Pulsing Ring */}
              <motion.div
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 0, 0.6]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: config.color }}
              />
            </motion.div>
            
            <div className="space-y-1">
              {/* Main Status Text - Stamp Style Typography */}
              <motion.h3
                initial={{ opacity: 0, x: -30, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="text-2xl font-black tracking-tight leading-none"
                style={{ 
                  color: config.color,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 900,
                  textShadow: `0 2px 10px ${config.color}30`,
                  letterSpacing: '-0.02em'
                }}
              >
                {stampText}
              </motion.h3>
              
              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                className="text-sm font-semibold text-slate-600 dark:text-slate-300"
              >
                {config.text}
              </motion.div>
              
              {/* Category Badge */}
              {factCheck.category && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex items-center gap-2 px-3 py-1 rounded-full 
                           bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm
                           border border-slate-200/80 dark:border-slate-700/50"
                  style={{ 
                    borderColor: `${config.color}30`,
                    boxShadow: `0 2px 8px ${config.color}15`
                  }}
                >
                  <CategoryIcon className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {factCheck.category.toLowerCase()}
                  </span>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Dismiss Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 }}
            onClick={onDismiss}
            className="group relative w-10 h-10 rounded-full flex items-center justify-center 
                     text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white 
                     transition-all duration-300
                     bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm
                     border border-slate-200/60 dark:border-slate-700/50"
          >
            <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <div className="absolute inset-0 rounded-full bg-slate-100/50 dark:bg-slate-600/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
          </motion.button>
        </div>
      </div>

      {/* Animated Underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-0 left-0 h-1 origin-left"
        style={{
          background: `linear-gradient(90deg, ${config.color}, transparent)`,
          boxShadow: `0 0 10px ${config.color}40`
        }}
      />
    </motion.div>
  );
}