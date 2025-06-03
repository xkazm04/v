"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, AlertCircle, HelpCircle, X } from "lucide-react";
import { LLMResearchResponse } from "@/app/types/research";

interface FactCheckNotificationProps {
  factCheck: LLMResearchResponse;
  onDismiss: () => void;
  onClick: () => void;
  animationPhase: 'notification' | 'card' | 'complete' | 'idle';
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "TRUE":
      return {
        icon: CheckCircle,
        color: "#22c55e",
        bgColor: "rgba(34, 197, 94, 0.1)",
        borderColor: "rgba(34, 197, 94, 0.3)",
        text: "Verified",
        glow: "rgba(34, 197, 94, 0.4)"
      };
    case "FALSE":
      return {
        icon: XCircle,
        color: "#ef4444",
        bgColor: "rgba(239, 68, 68, 0.1)",
        borderColor: "rgba(239, 68, 68, 0.3)",
        text: "False",
        glow: "rgba(239, 68, 68, 0.4)"
      };
    case "MISLEADING":
      return {
        icon: AlertTriangle,
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
        borderColor: "rgba(245, 158, 11, 0.3)",
        text: "Misleading",
        glow: "rgba(245, 158, 11, 0.4)"
      };
    case "PARTIALLY_TRUE":
      return {
        icon: AlertCircle,
        color: "#3b82f6",
        bgColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.3)",
        text: "Partial",
        glow: "rgba(59, 130, 246, 0.4)"
      };
    default:
      return {
        icon: HelpCircle,
        color: "#6b7280",
        bgColor: "rgba(107, 114, 128, 0.1)",
        borderColor: "rgba(107, 114, 128, 0.3)",
        text: "Unknown",
        glow: "rgba(107, 114, 128, 0.4)"
      };
  }
};

// Typewriter animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export function FactCheckNotification({ factCheck, onDismiss, onClick, animationPhase }: FactCheckNotificationProps) {
  const config = getStatusConfig(factCheck.status);
  const IconComponent = config.icon;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full cursor-pointer"
      onClick={onClick}
    >
      <motion.div
        className="relative p-4 rounded-xl border backdrop-blur-md"
        style={{
          background: `linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95) 0%,
            rgba(30, 41, 59, 0.98) 100%
          )`,
          borderColor: config.borderColor,
          boxShadow: `
            0 8px 25px rgba(0, 0, 0, 0.3),
            0 0 20px ${config.glow}
          `
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start gap-3">
            {/* Status Icon */}
            <motion.div
              variants={itemVariants}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: config.bgColor,
                border: `1px solid ${config.borderColor}`,
                boxShadow: `0 0 10px ${config.glow}`
              }}
            >
              <IconComponent 
                className="w-4 h-4" 
                style={{ color: config.color }}
              />
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 mb-2"
              >
                <span 
                  className="text-sm font-bold"
                  style={{ color: config.color }}
                >
                  {config.text}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-current to-transparent opacity-30" />
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-sm text-slate-300 leading-relaxed"
              >
                Statement detected and being analyzed...
              </motion.p>

              {/* Source indicator */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 mt-2"
              >
                <div className="flex -space-x-1">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="w-3 h-3 rounded-full border-2 border-slate-700"
                      style={{
                        background: `linear-gradient(135deg, ${config.color}40, ${config.color}20)`,
                        borderColor: config.color
                      }}
                    />
                  ))}
                </div>
                <motion.span 
                  variants={itemVariants}
                  className="text-xs text-slate-400"
                >
                  Checking sources...
                </motion.span>
              </motion.div>
            </div>

            {/* Dismiss button */}
            <motion.button
              variants={itemVariants}
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-3 h-3" />
            </motion.button>
          </div>
        </div>

        {/* Progress indicator */}
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 h-1 rounded-b-xl"
          style={{ backgroundColor: config.color, opacity: 0.6 }}
        />
      </motion.div>
    </motion.div>
  );
}