import ExpertAdvocateIcon from "../components/icons/expert_advocate";
import ExpertAnalystIcon from "../components/icons/expert_analyst";
import ExpertPsychIcon from "../components/icons/expert_psych";
import ExpertStatsIcon from "../components/icons/expert_stats";


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