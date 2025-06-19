'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Quote } from 'lucide-react';
import type { ExpertOpinion } from './types';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import ExpertStatsIcon from '../../components/icons/expert_stats';
import ExpertPsychIcon from '../../components/icons/expert_psych';
import ExpertAnalystIcon from '../../components/icons/expert_analyst';
import ExpertAdvocateIcon from '../../components/icons/expert_advocate';

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
    specialty: 'Critical Analysis',
    SvgComponent: ExpertAnalystIcon
  },
  devil: {
    title: "Devil's Advocate",
    name: 'Prof. Marcus Rivera',
    role: 'Contrarian Analyst',
    description: 'Represents minority viewpoints',
    mockQuote: 'Every story has an untold side',
    specialty: 'Alternative Perspectives',
    SvgComponent: ExpertAdvocateIcon
  },
  nerd: {
    title: 'The Data Analyst',
    name: 'Dr. Alex Thompson',
    role: 'Statistical Expert',
    description: 'Provides statistical analysis',
    mockQuote: 'Numbers don\'t lie, but context matters',
    specialty: 'Data Science',
    SvgComponent: ExpertStatsIcon
  },
  psychic: {
    title: 'The Psychologist',
    name: 'Dr. Elena Rossi',
    role: 'Behavioral Expert',
    description: 'Analyzes psychological motivations',
    mockQuote: 'Understanding why reveals the what',
    specialty: 'Human Psychology',
    SvgComponent: ExpertPsychIcon
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
        <h3 className="text-2xl sm:text-3xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3" style={{ color: colors.foreground }}>
          <span className="text-3xl sm:text-4xl">🎭</span>
          <span>Expert Panel Analysis</span>
        </h3>
        <p className="text-sm sm:text-lg max-w-2xl mx-auto px-4" style={{ color: colors.mutedForeground }}>
          Diverse panel of experts provides multiple perspectives on your statement
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
          const SvgComponent = profile.SvgComponent;

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
                      {/* Right Side - Quote */}
                      <div className="flex-shrink-0 max-w-xs">
                        <div 
                          className="p-3 rounded-xl border-l-4 relative"
                          style={{
                            background: isDark 
                              ? 'rgba(59, 130, 246, 0.1)' 
                              : 'rgba(59, 130, 246, 0.05)',
                            borderLeftColor: colors.primary
                          }}
                        >
                          <Quote 
                            className="absolute -top-2 -left-2 h-5 w-5 p-1 rounded-full"
                            style={{
                              background: colors.primary,
                              color: 'white'
                            }}
                          />
                          <div className="pl-3">
                            <p 
                              className="text-xs italic font-semibold leading-relaxed"
                              style={{ color: colors.foreground }}
                            >
                              "{profile.mockQuote}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

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
                        {profile.title}
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
    </motion.div>
  );
}