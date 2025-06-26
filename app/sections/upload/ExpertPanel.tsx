'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/app/components/ui/card';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { 
  EXPERT_PROFILES, 
  mapExpertToProfile,
  type ExpertProfileKey 
} from '@/app/constants/experts';
import type { ExpertPerspective, ExpertOpinion } from '@/app/types/research';

interface ExpertPanelProps {
  experts?: ExpertOpinion;
  expert_perspectives?: ExpertPerspective[];
  isLoading?: boolean;
}

export function ExpertPanel({  
  expert_perspectives, 
  isLoading = false 
}: ExpertPanelProps) {
  const { colors, isDark } = useLayoutTheme();

  const expertData = expert_perspectives && expert_perspectives.length > 0 
    ? expert_perspectives 
    : null;



  const getStanceColor = (stance: string) => {
    switch (stance) {
      case 'SUPPORTING':
        return isDark ? '#22c55e' : '#16a34a';
      case 'OPPOSING':
        return isDark ? '#ef4444' : '#dc2626';
      case 'NEUTRAL':
        return isDark ? '#f59e0b' : '#d97706';
      default:
        return colors.mutedForeground;
    }
  };

  // ✅ NEW: Helper function to get stance icon
  const getStanceIcon = (stance: string) => {
    switch (stance) {
      case 'SUPPORTING':
        return '✅';
      case 'OPPOSING':
        return '❌';
      case 'NEUTRAL':
        return '⚖️';
      default:
        return '❓';
    }
  };

  // ✅ FIXED: Show section even if no data for debugging
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl sm:text-3xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3" style={{ color: colors.foreground }}>
          <span className="text-3xl sm:text-4xl">🎭</span>
          <span>Expert Panel Analysis</span>
        </h3>
        <p className="text-sm sm:text-lg max-w-2xl mx-auto px-4" style={{ color: colors.mutedForeground }}>
          {expertData 
            ? 'Diverse panel of experts provides multiple perspectives on your statement'
            : 'Loading expert analysis...'
          }
        </p>
        {isLoading && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="font-medium"
            style={{ color: colors.primary }}
          >
            Consulting with experts...
          </motion.div>
        )}
      </div>
      
      {/* Expert Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {expertData && expertData.map((perspective, index) => {
          const profileKey = mapExpertToProfile(perspective.expert_name, perspective.expertise_area);
          const profile = EXPERT_PROFILES[profileKey];
          
          if (!profile) {
            console.warn('No profile found for expert:', perspective.expert_name, 'with expertise:', perspective.expertise_area);
            return null;
          }
          
          const SvgComponent = profile.SvgComponent;

          return (
            <motion.div
              key={`${perspective.expert_name}-${index}`}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.6 + index * 0.15,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="h-full"
            >
              <Card 
                className={`h-full border-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
                  isLoading ? 'animate-pulse' : ''
                }`}
                style={{
                  background: colors.card.background,
                  border: `2px solid ${colors.border}`,
                  boxShadow: colors.card.shadow
                }}
              >
                {/* SVG Background */}
                <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
                  <SvgComponent 
                    width={280} 
                    height={280} 
                    color={isDark ? '#ffffff' : '#000000'} 
                  />
                </div>

                <CardContent className="p-6 relative z-10">
                  {/* Expert Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      {/* Left Side - Expert Info */}
                      <div className="flex-1">
                        <h4 
                          className="font-bold text-lg mb-1"
                          style={{ color: colors.foreground }}
                        >
                          {profile.title}
                        </h4>
                        <p 
                          className="text-sm opacity-80 mb-2"
                          style={{ color: colors.mutedForeground }}
                        >
                          {perspective.expertise_area}
                        </p>
                        
                        {/* Stance Badge */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">
                            {getStanceIcon(perspective.stance)}
                          </span>
                          <span 
                            className="text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full"
                            style={{ 
                              backgroundColor: `${getStanceColor(perspective.stance)}20`,
                              color: getStanceColor(perspective.stance),
                              border: `1px solid ${getStanceColor(perspective.stance)}40`
                            }}
                          >
                            {perspective.stance}
                          </span>
                        </div>
                      </div>

                      {/* Right Side - Confidence Score */}
                      <div className="flex-shrink-0">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center border-4"
                          style={{
                            backgroundColor: `${profile.color}20`,
                            borderColor: profile.color
                          }}
                        >
                          <div className="text-center">
                            <div 
                              className="text-lg font-bold"
                              style={{ color: profile.color }}
                            >
                              {Math.round(perspective.confidence_level)}
                            </div>
                            <div 
                              className="text-xs font-medium -mt-1"
                              style={{ color: profile.color }}
                            >
                              %
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div className="space-y-3 mb-4">
                    <div 
                      className="rounded-lg p-4 border"
                      style={{
                        background: isDark ? 'rgba(71, 85, 105, 0.1)' : 'rgba(248, 250, 252, 0.8)',
                        border: `1px solid ${colors.border}`
                      }}
                    >
                      <p 
                        className={`leading-relaxed ${isLoading ? 'animate-pulse' : ''}`}
                        style={{ color: colors.foreground }}
                      >
                        {perspective.summary}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Reasoning */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ background: profile.color }}
                      />
                      <span 
                        className="text-sm font-semibold uppercase tracking-wide"
                        style={{ color: colors.mutedForeground }}
                      >
                        Analysis
                      </span>
                    </div>
                    <div 
                      className="rounded-lg p-4 border"
                      style={{
                        background: isDark ? 'rgba(71, 85, 105, 0.05)' : 'rgba(248, 250, 252, 0.5)',
                        border: `1px solid ${colors.border}`
                      }}
                    >
                      <p 
                        className={`font-semibold leading-relaxed ${isLoading ? 'animate-pulse' : ''}`}
                        style={{ color: colors.mutedForeground }}
                      >
                        {perspective.reasoning}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: level <= Math.floor(perspective.confidence_level / 20)
                              ? profile.color
                              : isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.8)'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}