"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { LLMResearchResponse } from "@/app/types/research";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { EXPERT_PROFILES } from "@/app/constants/experts";


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
  const { colors, isDark } = useLayoutTheme();
  const [activeExpert, setActiveExpert] = useState<string | null>(null);
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  if (!factCheck.experts) {
    return (
      <motion.div variants={sectionVariants} className="h-full flex flex-col items-center justify-center p-4">
        <div className="text-center text-muted-foreground">
          <Quote className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No expert analysis available</p>
        </div>
      </motion.div>
    );
  }

  // Filter experts that have content
  const availableExperts = Object.entries(EXPERT_PROFILES).filter(([key, profile]) => 
    factCheck.experts && factCheck.experts[key as keyof typeof factCheck.experts]
  );

  // Auto-cycle through expert opinions every 4 seconds
  useEffect(() => {
    if (!isAutoCycling || availableExperts.length === 0) return;

    let currentIndex = 0;
    
    // Start with first expert after a delay
    const startTimeout = setTimeout(() => {
      setActiveExpert(availableExperts[0][0]);
      currentIndex = 0;
    }, 1000);

    // Cycle through experts
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % availableExperts.length;
      setActiveExpert(availableExperts[currentIndex][0]);
    }, 4000);

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

  const themeColors = {
    background: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(248, 250, 252, 0.8)',
    border: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.5)',
    cardBackground: isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(255, 255, 255, 0.9)',
    text: colors.foreground,
    mutedText: isDark ? 'rgba(148, 163, 184, 0.9)' : 'rgba(100, 116, 139, 0.9)',
    quoteBackground: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
  };

  return (
    <motion.div variants={sectionVariants} className="h-full flex flex-col">
      {/* Header with auto-cycle control */}
      <div className="flex-shrink-0 mb-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold" style={{ color: themeColors.text }}>
            Expert Panel Analysis
          </h4>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        {/* Expert buttons grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {Object.entries(EXPERT_PROFILES).map(([expertKey, profile], index) => {
            const isAvailable = availableExperts.some(([key]) => key === expertKey);
            const isActive = activeExpert === expertKey;
            const SvgComponent = profile.SvgComponent;
            
            return (
              <motion.button
                key={expertKey}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isAvailable ? 1 : 0.3, 
                  scale: 1
                }}
                transition={{ 
                  delay: 1.3 + index * 0.1
                }}
                onClick={() => isAvailable && handleExpertClick(expertKey)}
                disabled={!isAvailable}
                className="relative p-3 rounded-lg border transition-all duration-200 text-left overflow-hidden"
                style={{
                  background: isActive ? `${profile.color}15` : themeColors.background,
                  borderColor: isActive ? `${profile.color}60` : themeColors.border,
                  cursor: isAvailable ? 'pointer' : 'not-allowed'
                }}
                whileHover={isAvailable ? { scale: 1.02 } : {}}
                whileTap={isAvailable ? { scale: 0.98 } : {}}
              >
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${profile.color}20` }}
                    >
                      <SvgComponent 
                        width={14} 
                        height={14} 
                        color={profile.color}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium" style={{ color: profile.color }}>
                        {profile.title}
                      </div>
                      <div className="text-xs" style={{ color: themeColors.mutedText }}>
                        {profile.specialty}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quote preview */}
                  <div 
                    className="text-xs italic p-2 rounded border-l-2"
                    style={{
                      background: themeColors.quoteBackground,
                      borderLeftColor: profile.color,
                      color: themeColors.mutedText
                    }}
                  >
                    "{profile.mockQuote}"
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Expert Opinion Display */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeExpert && factCheck.experts[activeExpert as keyof typeof factCheck.experts] && (
              <motion.div
                key={activeExpert}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col p-4 rounded-lg border relative overflow-hidden"
                style={{
                  background: themeColors.cardBackground,
                  borderColor: themeColors.border
                }}
              >
                {/* Background SVG */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  {(() => {
                    const profile = EXPERT_PROFILES[activeExpert as keyof typeof EXPERT_PROFILES];
                    const SvgComponent = profile?.SvgComponent;
                    return SvgComponent ? (
                      <SvgComponent 
                        width={120} 
                        height={120} 
                        color={profile.color}
                      />
                    ) : null;
                  })()}
                </div>
                
                {/* Opinion text */}
                <div className="relative z-10 flex-1 overflow-y-auto content-scroll">
                  <div 
                    className="p-3 rounded-lg border-l-4"
                    style={{
                      background: themeColors.quoteBackground,
                      borderLeftColor: EXPERT_PROFILES[activeExpert as keyof typeof EXPERT_PROFILES]?.color
                    }}
                  >
                    <Quote 
                      className="w-4 h-4 mb-2 opacity-60"
                      style={{ color: EXPERT_PROFILES[activeExpert as keyof typeof EXPERT_PROFILES]?.color }}
                    />
                    <p className="text-sm leading-relaxed" style={{ color: themeColors.text }}>
                      {factCheck.experts[activeExpert as keyof typeof factCheck.experts]}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}