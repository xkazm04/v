'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sampleDiagram } from './sampleData';
import TimelineEventModal from './TimelineEventModal';
import TimelineMilestone from './TimelineMilestone';

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

export default function EduLayout() {
  const [selectedEvent, setSelectedEvent] = useState<MilestoneEvent | null>(null);
  // Initialize with first milestone and first event
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(sampleDiagram.milestones[0].id);
  const [activeEventId, setActiveEventId] = useState<string | null>(sampleDiagram.milestones[0].events[0].id);
  
  const diagram = sampleDiagram;
  
  // Sort milestones by order
  const sortedMilestones = [...diagram.milestones].sort((a, b) => a.order - b.order);
  
  return (
    <div className="bg-gradient-to-b px-16 from-gray-950/50 py-20 to-black/50 rounded-lg min-h-[800px] text-white p-6 relative overflow-y-auto overflow-x-hidden">
      <div className="h-full py-[200px] flex flex-col justify-center z-10">
          {/* Top section */}
          <div className="mb-6">
            <motion.h2 
              className="text-2xl tracking-wide absolute top-10 left-5 font-thin"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {diagram.dimensionTopTitle}
            </motion.h2>
            {/* Top events container */}
            <div className="relative mt-5"> 
              {sortedMilestones
                .filter(milestone => milestone.isTop)
                .map((milestone) => ( 
                    <TimelineMilestone
                        key={`${milestone.id}`}
                        milestone={milestone}
                        sortedMilestones={sortedMilestones}
                        setSelectedEvent={setSelectedEvent}
                        isTop={true}
                        activeMilestoneId={activeMilestoneId}
                        activeEventId={activeEventId}
                        onEventHover={(eventId) => setActiveEventId(eventId)}
                        onMilestoneHover={(milestoneId) => setActiveMilestoneId(milestoneId)}
                    />
                ))}
            </div>
          </div>
          
          <div className="relative flex items-center ">
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-teal-700 to-yellow-300"></div>
            
            {sortedMilestones.slice(0, -1).map((milestone, index) => { 
              const positionPercent = (milestone.order - 1) / (sortedMilestones.length - 1) * 80;
              const isActive = milestone.id === activeMilestoneId;

              if (positionPercent > 88) return null; 

              return (
                <div 
                  key={`marker-${milestone.id}`} 
                  className="absolute"
                  style={{ 
                    left: `${positionPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    top: '50%'
                  }}
                  onMouseEnter={() => setActiveMilestoneId(milestone.id)}
                >
                  {/* Milestone marker with pulse effect */}
                  <motion.div 
                    className={`w-6 h-6 rounded-full bg-gradient-to-r ${
                      isActive ? 'from-blue-400 to-blue-300 border-blue-200' : 'from-blue-600 to-blue-400 border-blue-300'
                    } border-2 relative z-10 shadow-lg shadow-blue-500/30 flex items-center justify-center`}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ scale: isActive ? 1.2 : 1 }}
                  >
                    <motion.div
                      className="absolute w-full h-full rounded-full bg-blue-500 opacity-50"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 0.2, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    />
                    <motion.div
                      className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-blue-100'}`}
                    />
                  </motion.div>
                  
                  {/* Milestone date */}
                  <div className={`absolute left-12 transform -translate-x-1/2 mt-2 text-xs ${
                    isActive ? 'text-blue-200 font-semibold' : 'text-blue-300 font-medium'
                  } whitespace-nowrap`}>
                    {milestone.date}
                  </div>
                </div>
              );
            })}

            {/* Main Diagram Event Element */}
            <motion.div
              className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.7, type: 'spring' }}
            >
              <div className="w-0.5 h-12 bg-yellow-300/70 mb-2"></div>
              <motion.div 
                className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-yellow-500/50 rounded-xl p-4 shadow-2xl shadow-yellow-700/30 text-center w-64"
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(192, 132, 252, 0.5)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="text-lg font-thin text-transparent bg-clip-text tracking-wide text-yellow-200 mb-1">
                  {diagram.title}
                </h3>
                <p className="text-sm italic text-gray-400">
                  {diagram.question}
                </p>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Bottom section */}
            {/* Bottom events container */}
            <div className="relative ">
              {sortedMilestones
                .filter(milestone => !milestone.isTop)
                .map((milestone) => (
                  <TimelineMilestone
                      key={`bottom-${milestone.id}`}
                      milestone={milestone}
                      sortedMilestones={sortedMilestones}
                      setSelectedEvent={setSelectedEvent}
                      isTop={false}
                      activeMilestoneId={activeMilestoneId}
                      activeEventId={activeEventId}
                      onEventHover={(eventId) => setActiveEventId(eventId)}
                      onMilestoneHover={(milestoneId) => setActiveMilestoneId(milestoneId)}
                  />
                ))}
            </div>
            
            {/* Bottom dimension title */}
            <motion.h2 
              className="text-2xl absolute bottom-10 left-5 font-thin tracking-wide"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {diagram.dimensionBottomTitle}
            </motion.h2>
      </div>
      
      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <TimelineEventModal 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}