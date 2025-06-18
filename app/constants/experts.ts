import ExpertAdvocateIcon from "../components/icons/expert_advocate";
import ExpertAnalystIcon from "../components/icons/expert_analyst";
import ExpertPsychIcon from "../components/icons/expert_psych";
import ExpertStatsIcon from "../components/icons/expert_stats";

import { Brain, DollarSign, Scale, Crown, Eye, User } from 'lucide-react';



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
    shortLabel: 'Economic',
    color: '#10B981',
    description: 'Economic & Resource Analysis',
    specialty: 'Economic Impact',
    mockConfidence: 4,
    SvgComponent: ExpertStatsIcon
  },
  joe: { 
    icon: User, 
    label: 'Average Joe',
    shortLabel: 'Public',
    color: '#F59E0B',
    description: 'Common Perspective',
    specialty: 'Public Opinion',
    mockConfidence: 3,
    SvgComponent: ExpertStatsIcon
  },
  psychic: { 
    icon: Eye, 
    label: 'Psychic',
    shortLabel: 'Media',
    color: '#8B5CF6',
    description: 'Psychological & Propaganda Analysis',
    specialty: 'Media Psychology',
    mockConfidence: 5,
    SvgComponent: ExpertPsychIcon
  },
  dredd: { 
    icon: Scale, 
    label: 'Dredd',
    shortLabel: 'Legal',
    color: '#EF4444',
    description: 'Legal & Constitutional Analysis',
    specialty: 'Legal Framework',
    mockConfidence: 4,
    SvgComponent: ExpertAdvocateIcon
  },
  president: { 
    icon: Crown, 
    label: 'El Presidente',
    shortLabel: 'Diplomatic',
    color: '#3B82F6',
    description: 'Geopolitical & Strategic Analysis',
    specialty: 'Geopolitical Strategy',
    mockConfidence: 5,
    SvgComponent: ExpertAdvocateIcon
  },
  conspirator: { 
    icon: Brain, 
    label: 'Alex the Conspirator',
    shortLabel: 'Pattern',
    color: '#EC4899',
    description: 'Hidden Connections & Motives',
    specialty: 'Pattern Recognition',
    mockConfidence: 3,
    SvgComponent: ExpertAdvocateIcon
  }
};