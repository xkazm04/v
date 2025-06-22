'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { Timeline } from '@/app/types/timeline';
import { Users, Quote, Calendar, ChevronDown } from 'lucide-react';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';

const getTimelineStatements = async (timelineId: string) => {
  try {
    const statementsModule = await import(`./timeline_statements_${timelineId.split('-')[0]}.json`);
    return statementsModule.default;
  } catch (error) {
    console.warn(`No statements file found for timeline: ${timelineId}`);
    return [];
  }
};

interface TimelineStatement {
  name: string;
  statement: string;
  context: string;
  date: string;
}

interface GroupedStatements {
  [personName: string]: TimelineStatement[];
}

interface TimelineSummaryStatementsProps {
  timeline: Timeline;
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
}

export default function TimelineSummaryStatements({
  timeline,
  isLoading,
  onLoadingChange
}: TimelineSummaryStatementsProps) {
  const { colors, isDark, vintage } = useLayoutTheme();
  const { isMobile, isTablet } = useViewport();
  const [statements, setStatements] = useState<TimelineStatement[]>([]);
  const [groupedStatements, setGroupedStatements] = useState<GroupedStatements>({});
  const [expandedPersons, setExpandedPersons] = useState<Set<string>>(new Set());

  // Load timeline statements
  useEffect(() => {
    onLoadingChange(true);
    getTimelineStatements(timeline.id)
      .then((loadedStatements) => {
        setStatements(loadedStatements);
        
        // Group statements by person and limit to 5 per person
        const grouped: GroupedStatements = {};
        loadedStatements.forEach((statement) => {
          if (!grouped[statement.name]) {
            grouped[statement.name] = [];
          }
          if (grouped[statement.name].length < 5) {
            grouped[statement.name].push(statement);
          }
        });
        
        setGroupedStatements(grouped);
        
        // Auto-expand first person
        const firstPerson = Object.keys(grouped)[0];
        if (firstPerson) {
          setExpandedPersons(new Set([firstPerson]));
        }
      })
      .finally(() => onLoadingChange(false));
  }, [timeline.id, onLoadingChange]);

  const togglePersonExpansion = (personName: string) => {
    setExpandedPersons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(personName)) {
        newSet.delete(personName);
      } else {
        newSet.add(personName);
      }
      return newSet;
    });
  };

  const getPersonColor = (index: number) => {
    const personColors = [
      colors.primary,
      '#dc2626', // red
      '#2563eb', // blue
      '#059669', // green
      '#7c3aed', // purple
      '#ea580c', // orange
    ];
    return personColors[index % personColors.length];
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <motion.div
          className="inline-block w-8 h-8 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ borderColor: colors.primary }}
        />
        <p className="mt-4 text-sm opacity-60">Loading key statements...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-6 px-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <Users className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
        <h3
          className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}
          style={{ color: colors.primary }}
        >
          Key Political Statements
        </h3>
      </motion.div>

      {/* Statements List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {Object.keys(groupedStatements).length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Quote 
              className="w-12 h-12 mx-auto mb-4 opacity-30" 
              style={{ color: colors.mutedForeground }} 
            />
            <p
              className="text-sm opacity-60"
              style={{ color: isDark ? colors.mutedForeground : vintage.faded }}
            >
              No statements available for this timeline
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {Object.entries(groupedStatements).map(([personName, personStatements], personIndex) => {
              const isExpanded = expandedPersons.has(personName);
              const personColor = getPersonColor(personIndex);
              
              return (
                <motion.div
                  key={personName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.5 + personIndex * 0.1 }}
                  className="mb-6"
                >
                  {/* Person Header */}
                  <motion.button
                    className="w-full text-left mb-3 p-3 rounded-xl border transition-all duration-200"
                    style={{
                      backgroundColor: isDark ? colors.muted : vintage.highlight,
                      borderColor: personColor + '30',
                      boxShadow: isExpanded ? `0 4px 20px ${personColor}15` : 'none'
                    }}
                    onClick={() => togglePersonExpansion(personName)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: personColor }}
                        />
                        <h4
                          className="font-semibold text-base"
                          style={{ color: personColor }}
                        >
                          {personName}
                        </h4>
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: personColor + '15',
                            color: personColor
                          }}
                        >
                          {personStatements.length} statements
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown 
                          className="w-5 h-5" 
                          style={{ color: personColor }} 
                        />
                      </motion.div>
                    </div>
                  </motion.button>

                  {/* Person Statements */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="space-y-3 overflow-hidden"
                      >
                        {personStatements.map((statement, statementIndex) => (
                          <motion.div
                            key={statementIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              delay: statementIndex * 0.1,
                              duration: 0.3 
                            }}
                          >
                            <GlassContainer
                              style="frosted"
                              border="subtle"
                              shadow="sm"
                              rounded="lg"
                              className="p-4 ml-6"
                            >
                              {/* Statement Date */}
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-3 h-3 opacity-60" />
                                <span
                                  className="text-xs font-medium opacity-70"
                                  style={{ color: personColor }}
                                >
                                  {statement.date}
                                </span>
                              </div>

                              {/* Statement Quote */}
                              <blockquote className="relative mb-3">
                                <div
                                  className="absolute -left-2 -top-1 text-2xl opacity-30"
                                  style={{ color: personColor }}
                                >
                                  "
                                </div>
                                <p
                                  className="text-sm italic leading-relaxed pl-4"
                                  style={{ 
                                    color: isDark ? colors.foreground : vintage.ink,
                                    borderLeft: `3px solid ${personColor}30`,
                                    paddingLeft: '1rem'
                                  }}
                                >
                                  {statement.statement}
                                </p>
                              </blockquote>

                              {/* Context (expandable on hover/click) */}
                              <motion.div
                                className="group"
                                whileHover={{ backgroundColor: `${personColor}05` }}
                                style={{ borderRadius: '0.5rem', padding: '0.5rem' }}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div
                                    className="w-2 h-2 rounded-full opacity-60"
                                    style={{ backgroundColor: personColor }}
                                  />
                                  <span
                                    className="text-xs font-medium opacity-70"
                                    style={{ color: isDark ? colors.mutedForeground : vintage.faded }}
                                  >
                                    Context
                                  </span>
                                </div>
                                <p
                                  className="text-xs leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity"
                                  style={{ color: isDark ? colors.mutedForeground : vintage.faded }}
                                >
                                  {statement.context}
                                </p>
                              </motion.div>
                            </GlassContainer>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Summary Footer */}
      {Object.keys(groupedStatements).length > 0 && (
        <motion.div
          className="mt-6 p-4 rounded-xl"
          style={{
            backgroundColor: isDark ? colors.muted + '50' : vintage.aged + '50',
            border: `1px solid ${colors.border}`
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-between text-sm">
            <span
              style={{ color: isDark ? colors.mutedForeground : vintage.faded }}
            >
              Total: {Object.keys(groupedStatements).length} key figures
            </span>
            <span
              style={{ color: colors.primary }}
              className="font-medium"
            >
              {statements.length} statements analyzed
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}