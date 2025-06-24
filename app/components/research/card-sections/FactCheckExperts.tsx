import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { LLMResearchResponse } from '@/app/types/research';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { EXPERT_PROFILES } from '@/app/constants/experts';

const mapExpertToProfile = (expertName: string, expertiseArea?: string) => {
  const name = expertName.toLowerCase();
  if (name.includes('nerd') || name.includes('researcher') || name.includes('academic')) return 'nerd';
  if (name.includes('devil') || name.includes('skeptic') || name.includes('critic')) return 'devil';
  if (name.includes('critic') || name.includes('reviewer') || name.includes('media')) return 'critic';
  if (name.includes('psychic') || name.includes('predictor') || name.includes('trend')) return 'psychic';
  return 'nerd'; 
};

interface FactCheckExpertsProps {
  factCheck: LLMResearchResponse;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const expertCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export function FactCheckExperts({ factCheck }: FactCheckExpertsProps) {
  const { colors, isDark } = useLayoutTheme();
  const [activeExpert, setActiveExpert] = useState<string | null>(null);
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  const expertData = factCheck.expert_perspectives && factCheck.expert_perspectives.length > 0 
    ? factCheck.expert_perspectives 
    : null;


  // ✅ ENHANCED: Helper functions from ExpertPanel
  const getStanceColor = (stance: string) => {
    switch (stance) {
      case 'SUPPORTING':
        return isDark ? '#22c55e' : '#16a34a';
      case 'OPPOSING':
        return isDark ? '#ef4444' : '#dc2626';
      case 'NEUTRAL':
        return isDark ? '#f59e0b' : '#d97706';
      default:
        return colors.mutedForeground;
    }
  };

  const getStanceIcon = (stance: string) => {
    switch (stance) {
      case 'SUPPORTING': return '✅';
      case 'OPPOSING': return '❌';
      case 'NEUTRAL': return '⚖️';
      default: return '❓';
    }
  };

  useEffect(() => {
    if (!isAutoCycling) return;

    let availableExperts: string[] = [];
    
    if (expertData) {
      availableExperts = expertData.map((_, index) => index.toString());
    } 

    if (availableExperts.length === 0) return;

    let currentIndex = 0;
    
    const startTimeout = setTimeout(() => {
      setActiveExpert(availableExperts[0]);
      currentIndex = 0;
    }, 1000);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % availableExperts.length;
      setActiveExpert(availableExperts[currentIndex]);
    }, 4000);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
    };
  }, [isAutoCycling, expertData]);

  const handleExpertClick = (expertKey: string) => {
    setIsAutoCycling(false);
    setActiveExpert(activeExpert === expertKey ? null : expertKey);
  };

  const themeColors = {
    background: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(248, 250, 252, 0.8)',
    border: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.5)',
    cardBackground: isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(255, 255, 255, 0.9)',
    text: colors.foreground,
    mutedText: isDark ? 'rgba(148, 163, 184, 0.9)' : 'rgba(100, 116, 139, 0.9)',
  };

  if (expertData && expertData.length > 0) {
    return (
      <motion.div variants={sectionVariants} className="">
        <div className="flex-shrink-0 mb-3">
          <h4 className="text-sm font-semibold" style={{ color: themeColors.text }}>
            Expert Panel Analysis ({expertData.length} experts)
          </h4>
        </div>
        
        <div className="flex-1 space-y-3 overflow-hidden">
          {/* Expert Grid */}
          <div className="grid grid-cols-2 gap-2">
            {expertData.map((perspective, index) => {
              const profileKey = mapExpertToProfile(perspective.expert_name, perspective.expertise_area);
              const profile = EXPERT_PROFILES[profileKey];
              const SvgComponent = profile.SvgComponent;
              const isActive = activeExpert === index.toString();
              
              return (
                <motion.button
                  key={`${perspective.expert_name}-${index}`}
                  variants={expertCardVariants}
                  onClick={() => handleExpertClick(index.toString())}
                  className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                    isActive ? 'ring-2 ring-opacity-50' : ''
                  }`}
                  style={{
                    background: isActive ? `${profile.color}15` : themeColors.cardBackground,
                    borderColor: isActive ? profile.color : themeColors.border,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <SvgComponent/>
                    <span className="text-xs font-medium" style={{ color: profile.color }}>
                      {profile.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{getStanceIcon(perspective.stance)}</span>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        color: getStanceColor(perspective.stance),
                        borderColor: getStanceColor(perspective.stance)
                      }}
                    >
                      {perspective.stance}
                    </Badge>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Active Expert Display */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeExpert !== null && expertData[parseInt(activeExpert)] && (
                <motion.div
                  key={activeExpert}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <Card className="h-full">
                    <CardContent className="p-4 h-full flex flex-col">
                      {(() => {
                        const perspective = expertData[parseInt(activeExpert)];
                        const profileKey = mapExpertToProfile(perspective.expert_name, perspective.expertise_area);
                        const profile = EXPERT_PROFILES[profileKey];
                        
                        return (
                          <>
                            <div className="flex items-center gap-2 mb-3">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ background: profile.color }}
                              />
                              <span className="text-sm font-semibold">{perspective.expert_name}</span>
                              <Badge variant="outline" className="text-xs">
                                {perspective.expertise_area}
                              </Badge>
                            </div>
                            
                            <div className="flex-1 overflow-auto">
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Analysis</p>
                                  <p className="text-sm leading-relaxed">{perspective.reasoning}</p>
                                </div>
                                
                                {perspective.summary && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Summary</p>
                                    <p className="text-sm leading-relaxed">{perspective.summary}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-3 pt-3 border-t">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <div
                                    key={level}
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                      background: level <= Math.floor(perspective.confidence_level / 20)
                                        ? profile.color
                                        : isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.8)'
                                    }}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {perspective.confidence_level}% confidence
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }
}