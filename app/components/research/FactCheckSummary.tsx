"use client";

import { LLMResearchResponse } from "@/app/types/research";
import { motion } from "framer-motion";
import { X, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";

interface FactCheckSummaryProps {
  factChecks: LLMResearchResponse[];
  onDismiss: () => void;
  onClear: () => void;
}

export function FactCheckSummary({ factChecks, onDismiss, onClear }: FactCheckSummaryProps) {
  const stats = {
    total: factChecks.length,
    true: factChecks.filter(f => f.status === "TRUE").length,
    false: factChecks.filter(f => f.status === "FALSE").length,
    misleading: factChecks.filter(f => f.status === "MISLEADING").length,
    partial: factChecks.filter(f => f.status === "PARTIALLY_TRUE").length
  };

  const accuracyScore = stats.total > 0 
    ? Math.round(((stats.true + stats.partial * 0.5) / stats.total) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="w-full max-w-4xl rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95) 0%,
            rgba(30, 41, 59, 0.98) 100%
          )`,
          border: '1px solid rgba(71, 85, 105, 0.4)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}
              >
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Fact-Check Summary</h2>
                <p className="text-slate-400">Analysis of {stats.total} statements</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                onClick={onClear}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors"
                style={{
                  background: 'rgba(71, 85, 105, 0.3)',
                  border: '1px solid rgba(71, 85, 105, 0.4)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear All
              </motion.button>
              
              <motion.button
                onClick={onDismiss}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Verified True", count: stats.true, color: "#22c55e", icon: CheckCircle },
              { label: "False Claims", count: stats.false, color: "#ef4444", icon: X },
              { label: "Misleading", count: stats.misleading, color: "#f59e0b", icon: AlertTriangle },
              { label: "Partially True", count: stats.partial, color: "#3b82f6", icon: TrendingUp }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl"
                style={{
                  background: `${stat.color}10`,
                  border: `1px solid ${stat.color}30`
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon 
                    className="w-4 h-4" 
                    style={{ color: stat.color }}
                  />
                  <span className="text-xs text-slate-400">{stat.label}</span>
                </div>
                <div 
                  className="text-2xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.count}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Accuracy Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center p-6 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}
          >
            <h3 className="text-lg font-semibold text-slate-300 mb-2">Overall Accuracy</h3>
            <div className="text-4xl font-black text-blue-400 mb-2">
              {accuracyScore}%
            </div>
            <p className="text-sm text-slate-400">
              Based on verifiable statements
            </p>
          </motion.div>

          {/* Recent Fact-Checks */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-300">Recent Checks</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {factChecks.slice(-5).reverse().map((factCheck, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50"
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: factCheck.status === "TRUE" ? "#22c55e" :
                                factCheck.status === "FALSE" ? "#ef4444" :
                                factCheck.status === "MISLEADING" ? "#f59e0b" : "#3b82f6"
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-sm text-slate-200 line-clamp-1">
                      {factCheck.verdict}
                    </div>
                    <div className="text-xs text-slate-400">
                      {factCheck.category} • {factCheck.valid_sources}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}