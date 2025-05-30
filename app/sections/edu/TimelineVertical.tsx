'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sampleDiagram } from './sampleData';
import TimelineVerMilestone from './TimelineVerMilestone';
import TimelineVerModal from './TimelineVerModal';

export type MilestoneEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  reference_url?: string;
  text_1?: string;
  text_2?: string;
  text_3?: string;
  text_4?: string;
  order?: number;
}

export default function TimelineVertical() {
  const [selectedEvent, setSelectedEvent] = useState<MilestoneEvent | null>(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [visibleMilestones, setVisibleMilestones] = useState<Set<string>>(new Set());
  
  const diagram = sampleDiagram;
  const sortedMilestones = [...diagram.milestones].sort((a, b) => a.order - b.order);
  
  // Intersection Observer for milestone visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const milestoneId = entry.target.getAttribute('data-milestone-id');
          if (milestoneId) {
            setVisibleMilestones(prev => {
              const newSet = new Set(prev);
              if (entry.isIntersecting) {
                newSet.add(milestoneId);
              } else {
                newSet.delete(milestoneId);
              }
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const milestoneElements = document.querySelectorAll('[data-milestone-id]');
      milestoneElements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Auto-set active milestone based on visibility
  useEffect(() => {
    if (visibleMilestones.size > 0) {
      const firstVisible = Array.from(visibleMilestones)[0];
      setActiveMilestoneId(firstVisible);
      
      // Set first event of visible milestone as active
      const visibleMilestone = sortedMilestones.find(m => m.id === firstVisible);
      if (visibleMilestone && visibleMilestone.events.length > 0) {
        setActiveEventId(visibleMilestone.events[0].id);
      }
    }
  }, [visibleMilestones, sortedMilestones]);

  // Calculate total height needed
  const totalHeight = 120 + (sortedMilestones.length * 500) + 120;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background text-foreground relative">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Central light column */}
        <div className="absolute left-1/2 top-0 w-px bg-gradient-to-b from-transparent via-primary/5 to-transparent transform -translate-x-1/2" 
             style={{ height: `${totalHeight}px` }}></div>
        
        {/* Radial glow from center */}
        <div className="absolute left-1/2 top-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/3 via-primary/1 to-transparent rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-40"></div>
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            height: `${totalHeight}px`
          }}
        ></div>

        {/* Floating light orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/10 rounded-full"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i * 20)}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.6, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 sm:px-8 py-12">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-primary mb-4">
            {diagram.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            {diagram.question}
          </p>
        </motion.div>

        {/* Dimensions Legend */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-12 max-w-4xl mx-auto px-4">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-chart-1 to-chart-2 shadow-lg"></div>
            <span className="text-sm font-medium text-muted-foreground">{diagram.dimensionTopTitle}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-sm font-medium text-muted-foreground">{diagram.dimensionBottomTitle}</span>
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-chart-3 to-chart-4 shadow-lg"></div>
          </motion.div>
        </div>
      </div>

      {/* Vertical Timeline Container - Ensure proper height for scrolling */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8" style={{ minHeight: `${totalHeight}px` }}>
        {/* Central Timeline Line */}
        <div 
          className="absolute w-1 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 rounded-full shadow-lg"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            top: '0px',
            height: `${totalHeight}px`
          }}
        ></div>
        
        {/* Milestone Markers */}
        {sortedMilestones.map((milestone, index) => {
          const isActive = milestone.id === activeMilestoneId;
          const topPosition = 120 + (index * 500);
          
          return (
            <motion.div
              key={`marker-${milestone.id}`}
              className="absolute z-20"
              style={{ 
                left: '50%',
                transform: 'translateX(-50%)',
                top: `${topPosition}px`
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              onMouseEnter={() => setActiveMilestoneId(milestone.id)}
              data-milestone-id={milestone.id}
            >
              {/* Milestone Date Circle */}
              <motion.div 
                className={`relative flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-full border-3 shadow-xl backdrop-blur-sm ${
                  isActive 
                    ? 'bg-primary text-primary-foreground border-primary shadow-primary/40' 
                    : 'bg-card/95 text-card-foreground border-border shadow-black/20'
                }`}
                whileHover={{ scale: 1.1 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Pulse effect for active milestone */}
                {isActive && (
                  <motion.div
                    className="absolute w-full h-full rounded-full border-2 border-primary/50"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.8, 0.2, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                )}
                
                <span className="text-xs font-bold text-center leading-tight px-1">
                  {milestone.date}
                </span>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Timeline Milestones */}
        {sortedMilestones.map((milestone, index) => (
          <TimelineVerMilestone
            key={`milestone-${milestone.id}`}
            milestone={milestone}
            index={index}
            setSelectedEvent={setSelectedEvent}
            activeMilestoneId={activeMilestoneId}
            activeEventId={activeEventId}
            onEventHover={(eventId) => setActiveEventId(eventId)}
            onMilestoneHover={(milestoneId) => setActiveMilestoneId(milestoneId)}
            isVisible={visibleMilestones.has(milestone.id)}
          />
        ))}
        
        {/* Bottom spacing */}
        <div className="h-32"></div>
      </div>
      
      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <TimelineVerModal 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}