"use client";

import { LLMResearchResponse } from "@/app/types/research";
import { motion } from "framer-motion";
import { X, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";

interface FactCheckSummaryProps {
  factChecks: LLMResearchResponse[];
  onDismiss: () => void;
  onClear: () => void;
}

export function FactCheckSummary({ factChecks, onDismiss, onClear }: FactCheckSummaryProps) {
  const { colors, isDark } = useLayoutTheme();

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

  // Theme-aware colors
  const themeColors = {
    background: isDark
      ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
    border: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(203, 213, 225, 0.4)',
    headerBorder: isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.3)',
    shadow: isDark 
      ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(71, 85, 105, 0.2)'
      : '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(203, 213, 225, 0.3)',
    iconBackground: isDark
      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))'
      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
    iconBorder: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
    title: colors.foreground,
    subtitle: isDark ? 'rgba(148, 163, 184, 0.9)' : 'rgba(100, 116, 139, 0.9)',
    buttonBackground: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(241, 245, 249, 0.8)',
    buttonBorder: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(203, 213, 225, 0.4)',
    buttonHover: isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.8)',
    cardBackground: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(248, 250, 252, 0.8)',
    accuracyBackground: isDark
      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))'
      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))',
    accuracyBorder: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
    accuracyText: isDark ? '#60a5fa' : '#2563eb'
  };

  const statusColors = {
    true: isDark ? "#22c55e" : "#16a34a",
    false: isDark ? "#ef4444" : "#dc2626", 
    misleading: isDark ? "#f59e0b" : "#d97706",
    partial: isDark ? "#3b82f6" : "#2563eb"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="w-full max-w-4xl rounded-2xl overflow-hidden backdrop-blur-xl"
        style={{
          background: themeColors.background,
          border: `1px solid ${themeColors.border}`,
          boxShadow: themeColors.shadow
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-6 border-b"
          style={{ borderColor: themeColors.headerBorder }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: themeColors.iconBackground,
                  border: `1px solid ${themeColors.iconBorder}`
                }}
              >
                <BarChart3 className="w-6 h-6" style={{ color: themeColors.accuracyText }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: themeColors.title }}>
                  Fact-Check Summary
                </h2>
                <p style={{ color: themeColors.subtitle }}>
                  Analysis of {stats.total} statements
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                onClick={onClear}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: themeColors.buttonBackground,
                  border: `1px solid ${themeColors.buttonBorder}`,
                  color: themeColors.subtitle
                }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: themeColors.buttonHover
                }}
                whileTap={{ scale: 0.95 }}
              >
                Clear All
              </motion.button>
              
              <motion.button
                onClick={onDismiss}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                style={{
                  color: themeColors.subtitle,
                  backgroundColor: 'transparent'
                }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: themeColors.buttonHover,
                  color: themeColors.title
                }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto content-scroll">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Verified True", count: stats.true, color: statusColors.true, icon: CheckCircle },
              { label: "False Claims", count: stats.false, color: statusColors.false, icon: X },
              { label: "Misleading", count: stats.misleading, color: statusColors.misleading, icon: AlertTriangle },
              { label: "Partially True", count: stats.partial, color: statusColors.partial, icon: TrendingUp }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl backdrop-blur-sm"
                style={{
                  background: `${stat.color}${isDark ? '15' : '08'}`,
                  border: `1px solid ${stat.color}${isDark ? '30' : '20'}`
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon 
                    className="w-4 h-4" 
                    style={{ color: stat.color }}
                  />
                  <span className="text-xs" style={{ color: themeColors.subtitle }}>
                    {stat.label}
                  </span>
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
            className="text-center p-6 rounded-xl backdrop-blur-sm"
            style={{
              background: themeColors.accuracyBackground,
              border: `1px solid ${themeColors.accuracyBorder}`
            }}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.title }}>
              Overall Accuracy
            </h3>
            <div className="text-4xl font-black mb-2" style={{ color: themeColors.accuracyText }}>
              {accuracyScore}%
            </div>
            <p className="text-sm" style={{ color: themeColors.subtitle }}>
              Based on verifiable statements
            </p>
          </motion.div>

          {/* Recent Fact-Checks */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold" style={{ color: themeColors.title }}>
              Recent Checks
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {factChecks.slice(-5).reverse().map((factCheck, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm"
                  style={{ background: themeColors.cardBackground }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: factCheck.status === "TRUE" ? statusColors.true :
                                factCheck.status === "FALSE" ? statusColors.false :
                                factCheck.status === "MISLEADING" ? statusColors.misleading : statusColors.partial
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-sm line-clamp-1" style={{ color: themeColors.title }}>
                      {factCheck.verdict}
                    </div>
                    <div className="text-xs" style={{ color: themeColors.subtitle }}>
                      {factCheck.category} • {factCheck.valid_sources} sources
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