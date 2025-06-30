import { motion, Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import { EXPERT_PROFILES } from '@/app/constants/experts';
import { sectionVariants } from '../../animations/variants/feedVariants';
import { mapExpertToProfile } from '../utils/statusConfig';
import { NormalizedFactCheck } from '../FactCheckOverlay';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface FactCheckExpertsProps {
  factCheck: NormalizedFactCheck;
}

const expertCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

type ExpertPerspective = {
  expert_name: string;
  stance: 'NEUTRAL';
  reasoning: string;
  confidence_level: number;
  summary: string;
  source_type: 'llm';
  expertise_area: string;
  publication_date: null;
};

function mapExpertAnalysisToPerspectives(expertAnalysis: Record<string, string> | undefined): ExpertPerspective[] {
  if (!expertAnalysis) return [];
  return Object.entries(expertAnalysis).map(([role, summary]) => ({
    expert_name: role,
    stance: 'NEUTRAL',
    reasoning: summary,
    confidence_level: 80,
    summary,
    source_type: 'llm',
    expertise_area: role,
    publication_date: null,
  }));
}

export function FactCheckExperts({ factCheck }: FactCheckExpertsProps) {
  const { colors, isDark } = useLayoutTheme();
  const [activeExpert, setActiveExpert] = useState<number>(0);
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  const expertData = mapExpertAnalysisToPerspectives(factCheck.expertAnalysis);

  useEffect(() => {
    if (!isAutoCycling || !expertData || expertData.length < 2) return;
    const interval = setInterval(() => {
      setActiveExpert(prev => (prev + 1) % expertData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoCycling, expertData?.length]);

  const handleExpertClick = (index: number) => {
    setIsAutoCycling(false);
    setActiveExpert(index);
  };

  if (!expertData || expertData.length === 0) return null;

  const active = expertData[activeExpert];
  const profileKey = mapExpertToProfile(active.expert_name, active.expertise_area);
  const profile = EXPERT_PROFILES[profileKey];
  const SvgComponent = profile.SvgComponent;

  return (
    <motion.div variants={sectionVariants} className="w-full">
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {expertData.map((perspective, idx) => {
          const key = mapExpertToProfile(perspective.expert_name, perspective.expertise_area);
          const prof = EXPERT_PROFILES[key];
          return (
            <button
              key={idx}
              onClick={() => handleExpertClick(idx)}
              className={`px-3 py-1 rounded-full border text-xs font-semibold transition-all duration-200
                ${activeExpert === idx
                  ? 'bg-primary text-white border-primary'
                  : 'bg-muted text-foreground border-muted-foreground hover:bg-primary/10'
                }`}
              style={{
                borderColor: activeExpert === idx ? prof.color : colors.border,
                color: activeExpert === idx ? prof.color : colors.foreground,
                background: activeExpert === idx
                  ? (isDark ? '#1e293b' : '#f8fafc')
                  : (isDark ? colors.muted : colors.background)
              }}
            >
              {prof.title}
            </button>
          );
        })}
      </div>
      <motion.div
        key={activeExpert}
        variants={expertCardVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="relative rounded-2xl border-2 shadow-lg p-6 overflow-hidden max-w-xl mx-auto"
        style={{
          borderColor: profile.color,
          background: isDark
            ? `linear-gradient(135deg, #1e293b 80%, ${profile.color}10 100%)`
            : `linear-gradient(135deg, #fff 80%, ${profile.color}10 100%)`
        }}
      >
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <SvgComponent width={180} height={180} />
        </div>
        <div className="relative z-10">
          <div className="rounded-lg p-4 border mb-3"
            style={{
              background: isDark ? 'rgba(71, 85, 105, 0.1)' : 'rgba(248, 250, 252, 0.8)',
              border: `1px solid ${colors.border}`,
              color: colors.foreground
            }}>
            <p className="leading-relaxed font-medium">{active.summary}</p>
          </div>
          <div className="mt-4 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className="w-2 h-2 rounded-full"
                style={{
                  background: level <= Math.floor(active.confidence_level / 20)
                    ? profile.color
                    : (isDark ? '#334155' : '#e5e7eb')
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}