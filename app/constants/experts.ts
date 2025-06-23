import ExpertAdvocateIcon from "../components/icons/expert_advocate";
import ExpertAnalystIcon from "../components/icons/expert_analyst";
import ExpertPsychIcon from "../components/icons/expert_psych";
import ExpertStatsIcon from "../components/icons/expert_stats";
import ExpertConspiratorIcon from "../components/icons/expert_consipartor";

import { Brain, DollarSign, Scale, Crown, Eye, User } from 'lucide-react';
import ExpertKingIcon from "../components/icons/expert_king";
import ExpertPublicIcon from "../components/icons/expert_public";

export const EXPERT_PROFILES = {
  critic: {
    title: 'The Critic',
    description: 'Looks for hidden truths and gaps',
    mockQuote: 'There\'s always more beneath the surface',
    specialty: 'Critical Analysis',
    SvgComponent: ExpertAnalystIcon,
    color: '#ef4444'
  },
  devil: {
    title: "Devil's Advocate",
    description: 'Represents minority viewpoints',
    mockQuote: 'Every story has an untold side',
    specialty: 'Alternative Perspectives',
    SvgComponent: ExpertAdvocateIcon,
    color: '#f59e0b'
  },
  nerd: {
    title: 'The Data Analyst', 
    description: 'Provides statistical analysis',
    mockQuote: 'Numbers don\'t lie, but context matters',
    specialty: 'Data Science',
    SvgComponent: ExpertStatsIcon,
    color: '#3b82f6'
  },
  psychic: {
    title: 'The Psychologist',
    description: 'Analyzes psychological motivations', 
    mockQuote: 'Understanding why reveals the what',
    specialty: 'Human Psychology',
    SvgComponent: ExpertPsychIcon,
    color: '#8b5cf6'
  }
};

export type ExpertProfileKey = keyof typeof EXPERT_PROFILES;
export interface ExpertProfileType {
  title: string;
  description: string;
  mockQuote: string;
  specialty: string;
  SvgComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

// ✅ NEW: Expert name mapping for new backend expert_perspectives
export const EXPERT_NAME_MAPPING = {
  // Backend expert names to our profile keys
  'Critical Analyst': 'critic',
  'Devil\'s Advocate': 'devil',
  'Quantitative Analyst': 'nerd',
  'Strategic Analyst': 'psychic',
  'Contextual Specialist': 'critic', // Map to critic as fallback
  'Data Analyst': 'nerd',
  'Behavioral Analyst': 'psychic',
  'Alternative Perspective Analyst': 'devil',
  'Statistical Analyst': 'nerd',
  'Psychological Analyst': 'psychic'
} as const;

// ✅ NEW: Expertise area to profile mapping
export const EXPERTISE_AREA_MAPPING = {
  'Argument Analysis': 'critic',
  'Alternative Interpretation': 'devil',
  'Quantitative Analysis': 'nerd',
  'Strategic Analysis': 'psychic',
  'International Law': 'critic',
  'Data Science': 'nerd',
  'Behavioral Psychology': 'psychic',
  'Critical Thinking': 'critic',
  'Statistical Analysis': 'nerd',
  'Communication Strategy': 'psychic'
} as const;

// ✅ NEW: Helper function to map expert perspective to profile
export const mapExpertToProfile = (expertName: string, expertiseArea?: string): ExpertProfileKey => {
  // First try exact name match
  const nameMatch = EXPERT_NAME_MAPPING[expertName as keyof typeof EXPERT_NAME_MAPPING];
  if (nameMatch) return nameMatch;
  
  // Then try expertise area match
  if (expertiseArea) {
    const areaMatch = EXPERTISE_AREA_MAPPING[expertiseArea as keyof typeof EXPERTISE_AREA_MAPPING];
    if (areaMatch) return areaMatch;
  }
  
  // Fallback logic based on keywords
  const lowerName = expertName.toLowerCase();
  const lowerArea = expertiseArea?.toLowerCase() || '';
  
  if (lowerName.includes('critic') || lowerName.includes('critical') || lowerArea.includes('critical')) {
    return 'critic';
  }
  if (lowerName.includes('devil') || lowerName.includes('advocate') || lowerArea.includes('alternative')) {
    return 'devil';
  }
  if (lowerName.includes('data') || lowerName.includes('quantitative') || lowerName.includes('statistical') || lowerArea.includes('quantitative') || lowerArea.includes('data')) {
    return 'nerd';
  }
  if (lowerName.includes('strategic') || lowerName.includes('psycho') || lowerName.includes('behavioral') || lowerArea.includes('strategic') || lowerArea.includes('psychology')) {
    return 'psychic';
  }
  
  // Default fallback
  return 'critic';
};

export type ExpertTimelineConfigKey = keyof typeof EXPERT_TIMELINE_CONFIG;
export interface ExpertTimelineConfigType {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  shortLabel: string;
  color: string;
  description: string;
  specialty: string;
  mockConfidence: number;
  SvgComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const EXPERT_TIMELINE_CONFIG = {
  nerd: { 
    icon: DollarSign, 
    label: 'Nerd',
    shortLabel: 'Economic Nerd',
    color: '#10B981',
    description: 'Economic & Resource Analysis',
    specialty: 'Economic Impact',
    mockConfidence: 4,
    SvgComponent: ExpertStatsIcon
  },
  joe: { 
    icon: User, 
    label: 'Average Joe',
    shortLabel: 'Average Joe',
    color: '#F59E0B',
    description: 'Common Perspective',
    specialty: 'Public Opinion',
    mockConfidence: 3,
    SvgComponent: ExpertPublicIcon
  },
  psychic: { 
    icon: Eye, 
    label: 'Psychic',
    shortLabel: 'Psychic',
    color: '#8B5CF6',
    description: 'Psychological & Propaganda Analysis',
    specialty: 'Media Psychology',
    mockConfidence: 5,
    SvgComponent: ExpertPsychIcon
  },
  dredd: { 
    icon: Scale, 
    label: 'Dredd',
    shortLabel: 'Dredd',
    color: '#EF4444',
    description: 'Legal & Constitutional Analysis',
    specialty: 'Legal Framework',
    mockConfidence: 4,
    SvgComponent: ExpertAdvocateIcon
  },
  president: { 
    icon: Crown, 
    label: 'El Presidente',
    shortLabel: 'El Presidente',
    color: '#3B82F6',
    description: 'Geopolitical & Strategic Analysis',
    specialty: 'Geopolitical Strategy',
    mockConfidence: 5,
    SvgComponent: ExpertKingIcon
  },
  conspirator: { 
    icon: Brain, 
    label: 'Alex the Conspirator',
    shortLabel: 'Alex the Conspirator',
    color: '#EC4899',
    description: 'Hidden Connections & Motives',
    specialty: 'Pattern Recognition',
    mockConfidence: 3,
    SvgComponent: ExpertConspiratorIcon
  }
};