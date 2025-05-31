'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import type { ExpertOpinion } from './types';
import { EXPERT_ICONS, EXPERT_COLORS } from './types';

interface ExpertPanelProps {
  experts: ExpertOpinion;
  isLoading?: boolean;
}

const EXPERT_TITLES = {
  critic: 'The Critic',
  devil: "Devil's Advocate", 
  nerd: 'The Data Analyst',
  psychic: 'The Psychologist'
};

const EXPERT_DESCRIPTIONS = {
  critic: 'Looks for hidden truths and gaps',
  devil: 'Represents minority viewpoints',
  nerd: 'Provides statistical analysis',
  psychic: 'Analyzes psychological motivations'
};

export function ExpertPanel({ experts, isLoading = false }: ExpertPanelProps) {
  const expertEntries = Object.entries(experts).filter(([_, opinion]) => opinion);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-semibold mb-4 text-neutral-200 flex items-center gap-2">
        🎭 Expert Perspectives
        {isLoading && (
          <span className="text-sm font-normal text-neutral-800 animate-pulse">
            (Analyzing...)
          </span>
        )}
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {expertEntries.map(([expertType, opinion], index) => {
          const expert = expertType as keyof ExpertOpinion;
          const icon = EXPERT_ICONS[expert];
          const colorClass = EXPERT_COLORS[expert];
          const title = EXPERT_TITLES[expert];
          const description = EXPERT_DESCRIPTIONS[expert];

          return (
            <motion.div
              key={expert}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
            >
              <Card className={`h-full border-2 rounded-xl ${colorClass} hover:shadow-lg transition-shadow ${isLoading ? 'animate-pulse' : ''}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <div className="font-bold text-neutral-800">{title}</div>
                      <Badge variant="outline" className="text-xs font-normal mt-1 text-neutral-800">
                        {description}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm leading-relaxed text-neutral-900 ${isLoading ? 'animate-pulse' : ''}`}>
                    {opinion}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}