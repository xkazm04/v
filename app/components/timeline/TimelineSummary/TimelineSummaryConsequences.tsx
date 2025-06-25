'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { Timeline } from '@/app/types/timeline';
import { TrendingUp, DollarSign, Users, Globe, Building, AlertTriangle, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TimelineSummaryConsMd from './TimelineSummaryConsMd';

interface TimelineSummaryConsequencesProps {
  timeline: Timeline;
}

export default function TimelineSummaryConsequences({
  timeline
}: TimelineSummaryConsequencesProps) {
  const { colors, isDark, vintage } = useLayoutTheme();
  const { isMobile } = useViewport();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Parse markdown content into sections
  const parseConsequenceSections = (markdown: string) => {
    const sections = [];
    const lines = markdown.split('\n');
    let currentSection = null;
    let currentContent = [];

    for (const line of lines) {
      if (line.startsWith('**') && line.endsWith(':**')) {
        // Save previous section
        if (currentSection) {
          sections.push({
            title: currentSection,
            content: currentContent.join('\n').trim(),
            icon: getSectionIcon(currentSection)
          });
        }
        // Start new section
        currentSection = line.replace(/\*\*/g, '').replace(':', '');
        currentContent = [];
      } else if (line.trim()) {
        currentContent.push(line);
      }
    }

    // Add final section
    if (currentSection) {
      sections.push({
        title: currentSection,
        content: currentContent.join('\n').trim(),
        icon: getSectionIcon(currentSection)
      });
    }

    return sections;
  };

  const getSectionIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('cost') || titleLower.includes('economic') || titleLower.includes('financial')) {
      return DollarSign;
    }
    if (titleLower.includes('casualties') || titleLower.includes('human') || titleLower.includes('deaths')) {
      return Users;
    }
    if (titleLower.includes('corporate') || titleLower.includes('beneficiaries') || titleLower.includes('companies')) {
      return Building;
    }
    if (titleLower.includes('international') || titleLower.includes('global')) {
      return Globe;
    }
    if (titleLower.includes('impact') || titleLower.includes('consequences')) {
      return AlertTriangle;
    }
    return CheckCircle;
  };

  const getSectionColor = (index: number) => {
    const sectionColors = [
      '#dc2626', // red for costs/casualties
      '#2563eb', // blue for economic
      '#059669', // green for beneficiaries
      '#7c3aed', // purple for international
      '#ea580c', // orange for impacts
      colors.primary
    ];
    return sectionColors[index % sectionColors.length];
  };

  const sections = parseConsequenceSections(timeline.consequences ?? "");

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <TrendingUp className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
        <h3
          className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}
          style={{ color: colors.primary }}
        >
          Historical Impact & Consequences
        </h3>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {sections.length > 0 ? (
          <div className="space-y-6">
            {sections.map((section, index) => {
              const SectionIcon = section.icon;
              const sectionColor = getSectionColor(index);
              const isActive = activeSection === section.title;

              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {/* Using a custom card instead of GlassContainer to avoid theme issues */}
                  <div
                    className={`
                      relative overflow-hidden rounded-xl border transition-all duration-300
                      ${isActive ? 'ring-2 ring-opacity-50' : ''}
                    `}
                    style={{
                      backgroundColor: isDark ? colors.muted : vintage.paper,
                      borderColor: isDark ? colors.border : vintage.sepia,
                      boxShadow: isActive 
                        ? `0 8px 25px -5px ${sectionColor}20, 0 0 0 2px ${sectionColor}30`
                        : `0 4px 15px -3px ${colors.primary}10`
                    }}
                  >
                    {/* Paper texture for vintage effect */}
                    {!isDark && (
                      <div 
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                          backgroundImage: `
                            radial-gradient(circle at 30% 40%, rgba(139, 69, 19, 0.1) 1px, transparent 1px),
                            radial-gradient(circle at 70% 60%, rgba(139, 69, 19, 0.1) 1px, transparent 1px)
                          `,
                          backgroundSize: '30px 30px'
                        }}
                      />
                    )}

                    {/* Section Header */}
                    <motion.button
                      className="relative w-full p-4 text-left z-10"
                      onClick={() => setActiveSection(isActive ? null : section.title)}
                      whileHover={{ backgroundColor: `${sectionColor}05` }}
                      style={{ borderRadius: '0.75rem 0.75rem 0 0' }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: sectionColor + '15' }}
                        >
                          <SectionIcon 
                            className="w-5 h-5" 
                            style={{ color: sectionColor }} 
                          />
                        </div>
                        <h4
                          className={`font-bold ${isMobile ? 'text-base' : 'text-lg'}`}
                          style={{ color: sectionColor }}
                        >
                          {section.title}
                        </h4>
                      </div>
                    </motion.button>

                    {/* Section Content */}
                    <TimelineSummaryConsMd 
                        section={section}
                        sectionColor={sectionColor}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Fallback for non-structured markdown
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div
              className="p-6 rounded-xl border relative overflow-hidden"
              style={{
                backgroundColor: isDark ? colors.muted : vintage.paper,
                borderColor: isDark ? colors.border : vintage.sepia,
                boxShadow: `0 4px 15px -3px ${colors.primary}10`
              }}
            >
              {/* Paper texture for vintage effect */}
              {!isDark && (
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 30% 40%, rgba(139, 69, 19, 0.1) 1px, transparent 1px),
                      radial-gradient(circle at 70% 60%, rgba(139, 69, 19, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px'
                  }}
                />
              )}

              <div
                className={`relative z-10 prose prose-sm max-w-none ${
                  isDark ? 'prose-invert' : ''
                }`}
                style={{
                  '--tw-prose-body': isDark ? colors.foreground : vintage.ink,
                  '--tw-prose-headings': colors.primary,
                  '--tw-prose-bold': colors.primary,
                  '--tw-prose-bullets': colors.primary,
                  '--tw-prose-counters': colors.primary,
                } as React.CSSProperties}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {timeline.consequences}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}