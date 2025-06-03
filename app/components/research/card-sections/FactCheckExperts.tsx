"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, AlertTriangle, Brain, Zap } from "lucide-react";
import { LLMResearchResponse } from "@/app/types/research";

interface FactCheckExpertsProps {
  factCheck: LLMResearchResponse;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export function FactCheckExperts({ factCheck }: FactCheckExpertsProps) {
  const [activeExpert, setActiveExpert] = useState<string | null>(null);
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  if (!factCheck.experts) return null;

  const expertTypes = [
    { key: "critic", icon: Eye, label: "Critic", color: "#ef4444" },
    { key: "devil", icon: AlertTriangle, label: "Devil's Advocate", color: "#f59e0b" },
    { key: "nerd", icon: Brain, label: "Expert", color: "#3b82f6" },
    { key: "psychic", icon: Zap, label: "Predictor", color: "#8b5cf6" }
  ];

  // Filter experts that have content
  const availableExperts = expertTypes.filter(expert => 
    factCheck.experts && factCheck.experts[expert.key as keyof typeof factCheck.experts]
  );

  // Auto-cycle through expert opinions every 3 seconds
  useEffect(() => {
    if (!isAutoCycling || availableExperts.length === 0) return;

    let currentIndex = 0;
    
    // Start with first expert after a delay
    const startTimeout = setTimeout(() => {
      setActiveExpert(availableExperts[0].key);
      currentIndex = 0;
    }, 1000);

    // Cycle through experts
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % availableExperts.length;
      setActiveExpert(availableExperts[currentIndex].key);
    }, 3000);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
    };
  }, [isAutoCycling, availableExperts.length]);

  // Handle manual expert selection
  const handleExpertClick = (expertKey: string) => {
    setIsAutoCycling(false); // Stop auto-cycling when user interacts
    setActiveExpert(activeExpert === expertKey ? null : expertKey);
  };

  return (
    <motion.div variants={sectionVariants} className="h-full flex flex-col">
      {/* Header with auto-cycle indicator */}
      <div className="flex-shrink-0 mb-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Expert Perspectives</h4>
          <div className="flex items-center gap-2">
            {isAutoCycling && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 rounded-full border border-blue-500 dark:border-blue-400 border-t-transparent"
              />
            )}
            <button
              onClick={() => setIsAutoCycling(!isAutoCycling)}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              {isAutoCycling ? 'Manual' : 'Auto'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        {/* Expert buttons */}
        <div className="grid grid-cols-4 gap-1 mb-2">
          {expertTypes.map((expert, index) => {
            const isAvailable = availableExperts.some(ae => ae.key === expert.key);
            const isActive = activeExpert === expert.key;
            
            return (
              <motion.button
                key={expert.key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isAvailable ? 1 : 0.3, 
                  scale: 1,
                  borderColor: isActive 
                    ? `${expert.color}80` 
                    : 'rgba(148, 163, 184, 0.4)'
                }}
                transition={{ 
                  delay: 1.3 + index * 0.1,
                  borderColor: { duration: 0.3 }
                }}
                onClick={() => isAvailable && handleExpertClick(expert.key)}
                disabled={!isAvailable}
                className="p-2 rounded-lg transition-all duration-200 text-center relative"
                style={{
                  background: isActive 
                    ? `${expert.color}15` 
                    : 'rgba(248, 250, 252, 0.8)', // Light mode: very light gray
                  border: `1px solid ${isActive 
                    ? `${expert.color}60` 
                    : 'rgba(148, 163, 184, 0.4)'
                  }`,
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  // Dark mode overrides
                  ...(typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches && {
                    background: isActive 
                      ? `${expert.color}20` 
                      : 'rgba(51, 65, 85, 0.3)',
                  })
                }}
                whileHover={isAvailable ? { scale: 1.05 } : {}}
                whileTap={isAvailable ? { scale: 0.95 } : {}}
              >
                {/* Auto-cycle progress indicator */}
                {isAutoCycling && isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2"
                    style={{ borderColor: expert.color }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                )}
                
                <expert.icon 
                  className="w-3 h-3 mx-auto mb-1" 
                  style={{ color: expert.color }}
                />
                <div className="text-xs text-slate-700 dark:text-slate-300 truncate">
                  {expert.label}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Expert Opinion Display */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeExpert && factCheck.experts[activeExpert as keyof typeof factCheck.experts] && (
              <motion.div
                key={activeExpert}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="p-3 rounded-lg h-full flex flex-col
                         bg-white/90 dark:bg-slate-800/30 
                         border border-slate-200/60 dark:border-slate-700/40"
              >
                {/* Expert label */}
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const expert = expertTypes.find(e => e.key === activeExpert);
                    const IconComponent = expert?.icon || Eye;
                    return (
                      <>
                        <IconComponent 
                          className="w-4 h-4" 
                          style={{ color: expert?.color || '#6b7280' }}
                        />
                        <span 
                          className="text-sm font-medium"
                          style={{ color: expert?.color || '#6b7280' }}
                        >
                          {expert?.label}
                        </span>
                      </>
                    );
                  })()}
                </div>
                
                {/* Opinion text */}
                <div className="flex-1 overflow-y-auto">
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    {factCheck.experts[activeExpert as keyof typeof factCheck.experts]}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}