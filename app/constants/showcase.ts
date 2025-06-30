import { 
  FileText, 
  Play, 
  BarChart3, 
  BookOpen, 
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  imagePlaceholder: string;
  benefits: string[];
}

export const SHOWCASE_FEATURES: Feature[] = [
  {
    id: 'statement-analysis',
    title: 'Statement Analysis',
    tagline: 'Truth at your fingertips',
    description: 'Comprehensive analysis of political statements and claims with evidence-based fact-checking and source verification.',
    icon: FileText,
    gradient: 'from-blue-500 to-indigo-600',
    imagePlaceholder: '/gifs/gif_news.gif',
    benefits: ['Instant fact verification', 'Evidence-based scoring', 'Source transparency']
  },
  {
    id: 'video-analysis',
    title: 'Video Analysis',
    tagline: 'Real-time truth detection',
    description: 'Interactive video analysis that fact-checks statements in real-time as you watch speeches, debates, and interviews.',
    icon: Play,
    gradient: 'from-red-500 to-pink-600',
    imagePlaceholder: '/gifs/gif_video.gif',
    benefits: ['Real-time fact-checking', 'Interactive overlays', 'Contextual insights']
  },
  {
    id: 'educational-timeline',
    title: 'Context Timeline',
    tagline: 'Understand the full story',
    description: 'Educational timelines that provide historical context and background for complex political issues and world events.',
    icon: BookOpen,
    gradient: 'from-purple-500 to-violet-600',
    imagePlaceholder: '/gifs/gif_timeline.gif',
    benefits: ['Historical context', 'Expert insights', 'Educational depth']
  },
  {
    id: 'profile-analytics',
    title: 'Public Figure Tracker',
    tagline: 'Track credibility over time',
    description: 'Comprehensive analytics and historical tracking of public figures\' statement accuracy and credibility patterns.',
    icon: BarChart3,
    gradient: 'from-green-500 to-emerald-600',
    imagePlaceholder: '/gifs/gif_profile.gif',
    benefits: ['Credibility scoring', 'Historical patterns', 'Trend analysis']
  }
];