'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Quote } from 'lucide-react';
import type { ExpertOpinion } from './types';
import { EXPERT_ICONS, EXPERT_COLORS } from './types';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface ExpertPanelProps {
  experts?: ExpertOpinion;
  isLoading?: boolean;
}

const EXPERT_PROFILES = {
  critic: {
    title: 'The Critic',
    name: 'Dr. Sarah Chen',
    role: 'Investigative Researcher',
    description: 'Looks for hidden truths and gaps',
    mockQuote: 'There\'s always more beneath the surface',
    specialty: 'Critical Analysis'
  },
  devil: {
    title: "Devil's Advocate",
    name: 'Prof. Marcus Rivera',
    role: 'Contrarian Analyst',
    description: 'Represents minority viewpoints',
    mockQuote: 'Every story has an untold side',
    specialty: 'Alternative Perspectives'
  },
  nerd: {
    title: 'The Data Analyst',
    name: 'Dr. Alex Thompson',
    role: 'Statistical Expert',
    description: 'Provides statistical analysis',
    mockQuote: 'Numbers don\'t lie, but context matters',
    specialty: 'Data Science'
  },
  psychic: {
    title: 'The Psychologist',
    name: 'Dr. Elena Rossi',
    role: 'Behavioral Expert',
    description: 'Analyzes psychological motivations',
    mockQuote: 'Understanding why reveals the what',
    specialty: 'Human Psychology'
  }
};

export function ExpertPanel({ experts, isLoading = false }: ExpertPanelProps) {
  const { colors, isDark } = useLayoutTheme();
  const expertEntries = Object.entries(experts || {}).filter(([_, opinion]) => opinion);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold flex items-center justify-center gap-3" style={{ color: colors.foreground }}>
          <span className="text-4xl">🎭</span>
          Expert Panel Analysis
        </h3>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.mutedForeground }}>
          Our diverse panel of experts provides multiple perspectives on your statement
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
        {expertEntries.map(([expertType, opinion], index) => {
          const expert = expertType as keyof ExpertOpinion;
          const profile = EXPERT_PROFILES[expert];
          const icon = EXPERT_ICONS[expert];

          return (
            <motion.div
              key={expert}
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
                className={`h-full border-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isLoading ? 'animate-pulse' : ''
                }`}
                style={{
                  background: colors.card.background,
                  border: `2px solid ${colors.border}`,
                  boxShadow: colors.card.shadow
                }}
              >
                <CardHeader className="pb-4">
                  {/* New Layout: Left side = Title + Icon, Right side = Quote */}
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Side - Expert Identity */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
                          style={{
                            background: isDark 
                              ? 'linear-gradient(to br, rgba(71, 85, 105, 0.8), rgba(100, 116, 139, 0.9))'
                              : 'linear-gradient(to br, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))',
                            border: `2px solid ${colors.border}`
                          }}
                        >
                          {icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold mb-1" style={{ color: colors.foreground }}>
                          {profile.title}
                        </h4>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold" style={{ color: colors.mutedForeground }}>
                            {profile.name}
                          </p>
                          <p className="text-xs" style={{ color: colors.mutedForeground }}>
                            {profile.role}
                          </p>
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{
                              background: isDark ? 'rgba(71, 85, 105, 0.2)' : 'rgba(248, 250, 252, 0.8)',
                              color: colors.foreground,
                              border: `1px solid ${colors.border}`
                            }}
                          >
                            {profile.specialty}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Quote */}
                    <div className="flex-shrink-0 max-w-xs">
                      <div 
                        className="p-4 rounded-xl border-l-4 relative"
                        style={{
                          background: isDark 
                            ? 'rgba(59, 130, 246, 0.1)' 
                            : 'rgba(59, 130, 246, 0.05)',
                          borderLeftColor: colors.primary
                        }}
                      >
                        <Quote 
                          className="absolute -top-2 -left-2 h-6 w-6 p-1 rounded-full"
                          style={{
                            background: colors.primary,
                            color: 'white'
                          }}
                        />
                        <div className="pl-4">
                          <div 
                            className="text-xs font-medium uppercase tracking-wide mb-1"
                            style={{ color: colors.primary }}
                          >
                            Expert's Approach
                          </div>
                          <p 
                            className="text-sm italic font-semibold leading-relaxed"
                            style={{ color: colors.foreground }}
                          >
                            "{profile.mockQuote}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Analysis Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ background: colors.primary }}
                      ></div>
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
                        background: isDark ? 'rgba(71, 85, 105, 0.1)' : 'rgba(248, 250, 252, 0.8)',
                        border: `1px solid ${colors.border}`
                      }}
                    >
                      <p 
                        className={`text-sm leading-relaxed ${isLoading ? 'animate-pulse' : ''}`}
                        style={{ color: colors.foreground }}
                      >
                        {opinion}
                      </p>
                    </div>
                  </div>

                  {/* Confidence Indicator */}
                  <div className="mt-4 flex items-center justify-between">
                    <span 
                      className="text-xs font-medium"
                      style={{ color: colors.mutedForeground }}
                    >
                      Confidence Level
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: level <= Math.floor(Math.random() * 5) + 1
                              ? colors.primary
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

      {/* Panel Summary */}
      {expertEntries.length > 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center p-6 rounded-2xl border"
          style={{
            background: isDark 
              ? 'linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05))'
              : 'linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05))',
            border: `1px solid ${colors.border}`
          }}
        >
          <h4 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>
            Panel Consensus
          </h4>
          <p style={{ color: colors.mutedForeground }}>
            {expertEntries.length} expert{expertEntries.length > 1 ? 's' : ''} provided comprehensive analysis from different perspectives
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}