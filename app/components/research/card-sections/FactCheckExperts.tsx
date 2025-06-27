import { motion, Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useResearchTranslations } from '@/app/hooks/useSmartTranslations';
import { LLMResearchResponse } from '@/app/types/research';
import { Badge } from '@/app/components/ui/badge';
import { EXPERT_PROFILES } from '@/app/constants/experts';
import { sectionVariants } from '../../animations/variants/feedVariants';
import { mapExpertToProfile } from '../utils/statusConfig';
import FactCheckExpertActive from './FactCheckExpertActive';


interface FactCheckExpertsProps {
  factCheck: LLMResearchResponse;
}

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
  const { t: tr } = useResearchTranslations();
  const [activeExpert, setActiveExpert] = useState<string | null>(null);
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  const expertData = factCheck.expert_perspectives && factCheck.expert_perspectives.length > 0 
    ? factCheck.expert_perspectives 
    : null;

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

  const getTranslatedStance = (stance: string) => {
    switch (stance) {
      case 'SUPPORTING':
        return tr('stance_supporting', 'SUPPORTING');
      case 'OPPOSING':
        return tr('stance_opposing', 'OPPOSING');
      case 'NEUTRAL':
        return tr('stance_neutral', 'NEUTRAL');
      default:
        return tr('stance_unknown', 'UNKNOWN');
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
            {tr('expert_panel_analysis', 'Expert Panel Analysis')} ({expertData.length} {tr('experts', 'experts')})
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
                      {getTranslatedStance(perspective.stance)}
                    </Badge>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Active Expert Display */}
          <FactCheckExpertActive
            activeExpert={activeExpert}
            expertData={expertData}
            />
        </div>
      </motion.div>
    );
  }
}