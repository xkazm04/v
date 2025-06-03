"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FactCheckCard } from "./FactCheckCard";
import { FactCheckNotification } from "./FactCheckNotification";
import { FactCheckSummary } from "./FactCheckSummary";
import { FactCheckBackground } from "./FactCheckBackground";
import { LLMResearchResponse } from "@/app/types/research";

interface FactCheckOverlayProps {
  isVideoPlaying: boolean;
  videoCurrentTime: number;
  className?: string;
}

// Dummy data generator (keeping the same as before)
const generateDummyFactCheck = (): LLMResearchResponse => {
  const statements = [
    {
      statement: "Climate change is causing unprecedented global temperature increases",
      status: "TRUE" as const,
      verdict: "Scientific consensus confirms global temperatures have risen by 1.1°C since pre-industrial times. Multiple independent datasets support this trend.",
      category: "ENVIRONMENT" as const,
      valid_sources: "23 (89% agreement across 31 unique sources)",
      country: "us",
      correction: null
    },
    {
      statement: "Vaccines contain microchips for tracking people",
      status: "FALSE" as const,
      verdict: "No evidence exists for microchips in vaccines. This claim has been thoroughly debunked by medical authorities worldwide.",
      category: "HEALTHCARE" as const,
      valid_sources: "0 (0% agreement across 45 unique sources)",
      country: "us",
      correction: "COVID-19 vaccines contain mRNA or viral proteins, not electronic devices"
    },
    {
      statement: "The economy is performing at record levels",
      status: "PARTIALLY_TRUE" as const,
      verdict: "Some economic indicators show strength while others indicate concerns. Mixed performance across different sectors.",
      category: "ECONOMY" as const,
      valid_sources: "12 (67% agreement across 18 unique sources)",
      country: "us",
      correction: "Economic performance is mixed with strong employment but rising inflation concerns"
    },
    {
      statement: "Artificial intelligence will replace all human jobs by 2030",
      status: "MISLEADING" as const,
      verdict: "While AI will automate some jobs, complete replacement of all human work by 2030 is not supported by current projections.",
      category: "TECHNOLOGY" as const,
      valid_sources: "3 (15% agreement across 20 unique sources)",
      country: "us",
      correction: "AI will automate some jobs but also create new opportunities; timeline estimates vary widely"
    }
  ];

  const randomStatement = statements[Math.floor(Math.random() * statements.length)];
  
  return {
    ...randomStatement,
    resources_agreed: {
      total: "85%",
      count: 15,
      mainstream: 8,
      governance: 3,
      academic: 4,
      medical: randomStatement.category === "HEALTHCARE" ? 6 : 0,
      other: 0,
      major_countries: ["us", "gb", "de", "ca"],
      references: [
        {
          url: "https://climate.nasa.gov/evidence/",
          title: "NASA Climate Change Evidence",
          category: "governance" as const,
          country: "us",
          credibility: "high" as const
        },
        {
          url: "https://www.nature.com/articles/climate-study",
          title: "Nature Climate Research",
          category: "academic" as const,
          country: "gb",
          credibility: "high" as const
        },
        {
          url: "https://www.reuters.com/climate-report",
          title: "Reuters Climate Analysis",
          category: "mainstream" as const,
          country: "us",
          credibility: "high" as const
        }
      ]
    },
    resources_disagreed: {
      total: "15%",
      count: 3,
      mainstream: 1,
      governance: 0,
      academic: 2,
      medical: 0,
      other: 0,
      major_countries: ["us"],
      references: []
    },
    experts: {
      critic: "This statement oversimplifies a complex issue that requires nuanced understanding.",
      devil: "Consider alternative perspectives and potential biases in the available data sources.",
      nerd: "The methodology behind these findings involves sophisticated statistical analysis and peer review.",
      psychic: "This topic will likely evolve as new research emerges and understanding deepens."
    },
    research_method: "comprehensive_analysis",
    profile_id: "demo_user"
  };
};

export function FactCheckOverlay({ isVideoPlaying, videoCurrentTime, className }: FactCheckOverlayProps) {
  const [activeFactCheck, setActiveFactCheck] = useState<LLMResearchResponse | null>(null);
  const [factCheckHistory, setFactCheckHistory] = useState<LLMResearchResponse[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'notification' | 'card' | 'complete' | 'idle'>('idle');

  // Simulate fact-checking during video playback
  useEffect(() => {
    if (!isVideoPlaying) return;

    const interval = setInterval(() => {
      const newFactCheck = generateDummyFactCheck();
      
      setActiveFactCheck(newFactCheck);
      setFactCheckHistory(prev => [...prev.slice(-4), newFactCheck]);
      
      // Start animation sequence - FIXED TIMING CASCADE
      setAnimationPhase('notification');
      setShowNotification(true);
      
      // Card appears after 2 seconds (while notification is still visible)
      setTimeout(() => {
        setAnimationPhase('card');
        setShowCard(true);
      }, 500);
      
      // Notification disappears after 4 seconds (when card is fully visible)
      setTimeout(() => {
        setShowNotification(false);
        setAnimationPhase('complete');
      }, 4000);
      
      // Card stays for total of 14 seconds (from notification start)
      setTimeout(() => {
        setShowCard(false);
        setAnimationPhase('idle');
      }, 10000);
      
    }, Math.random() * 15000 + 15000); // New fact-check every 15-30 seconds

    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  // Show summary when video is paused
  useEffect(() => {
    if (!isVideoPlaying && factCheckHistory.length > 0) {
      setShowSummary(true);
    } else {
      setShowSummary(false);
    }
  }, [isVideoPlaying, factCheckHistory.length]);

  return (
    <div className={`relative ${className}`}>
      {/* Background Structure */}
      <FactCheckBackground 
        factCheckCount={factCheckHistory.length}
        isActive={showNotification || showCard || showSummary}
      />

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1">
          <AnimatePresence>
            {showCard && activeFactCheck && (
              <FactCheckCard 
                factCheck={activeFactCheck}
                onDismiss={() => {
                  setShowCard(false);
                  setAnimationPhase('idle');
                }}
                onExpertToggle={() => {}}
                animationPhase={animationPhase}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <div className="absolute inset-0 z-50">
            <FactCheckSummary 
              factChecks={factCheckHistory}
              onDismiss={() => setShowSummary(false)}
              onClear={() => setFactCheckHistory([])}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}