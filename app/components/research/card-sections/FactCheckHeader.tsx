"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { LLMResearchResponse } from "@/app/types/research";
import { getCategoryIcon } from "../utils/statusConfig";

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

  return (
    <motion.div
      variants={sectionVariants}
      className="p-4 border-b border-slate-700/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: config.bgColor,
              border: `2px solid ${config.borderColor}`,
              boxShadow: `0 0 15px ${config.color}40`
            }}
          >
            <IconComponent 
              className="w-5 h-5" 
              style={{ color: config.color }}
            />
          </motion.div>
          
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="font-bold text-white"
              style={{ color: config.color }}
            >
              {config.text}
            </motion.h3>
            
            {factCheck.category && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-1 text-xs text-slate-400"
              >
                <CategoryIcon className="w-3 h-3" />
                <span className="capitalize">{factCheck.category.toLowerCase()}</span>
              </motion.div>
            )}
          </div>
        </div>
        
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          onClick={onDismiss}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}