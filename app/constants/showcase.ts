import { 
  FileText, 
  Play, 
  BarChart3, 
  BookOpen, 
  Zap,
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
    id: 'statement-debunk',
    title: 'Statement Debunker',
    tagline: 'Truth at your fingertips',
    description: 'Comprehensive analysis of political statements and claims with evidence-based fact-checking and source verification.',
    icon: FileText,
    gradient: 'from-blue-500 to-indigo-600',
    imagePlaceholder: '/features/statement-analysis.jpg',
    benefits: ['Instant fact verification', 'Evidence-based scoring', 'Source transparency']
  },
  {
    id: 'video-analysis',
    title: 'Live Video Analysis',
    tagline: 'Real-time truth detection',
    description: 'Interactive video analysis that fact-checks statements in real-time as you watch speeches, debates, and interviews.',
    icon: Play,
    gradient: 'from-red-500 to-pink-600',
    imagePlaceholder: '/features/video-analysis.jpg',
    benefits: ['Real-time checking', 'Interactive timeline', 'Context awareness']
  },
  {
    id: 'profile-analytics',
    title: 'Public Figure Tracker',
    tagline: 'Track credibility over time',
    description: 'Comprehensive analytics and historical tracking of public figures\' statement accuracy and credibility patterns.',
    icon: BarChart3,
    gradient: 'from-green-500 to-emerald-600',
    imagePlaceholder: '/features/profile-analytics.jpg',
    benefits: ['Credibility scoring', 'Historical patterns', 'Trend analysis']
  },
  {
    id: 'educational-timeline',
    title: 'Context Timeline',
    tagline: 'Understand the full story',
    description: 'Educational timelines that provide historical context and background for complex political issues and world events.',
    icon: BookOpen,
    gradient: 'from-purple-500 to-violet-600',
    imagePlaceholder: '/features/timeline-education.jpg',
    benefits: ['Historical context', 'Expert insights', 'Educational depth']
  },
  {
    id: 'quick-analysis',
    title: 'Instant Checker',
    tagline: 'Check anything, anywhere',
    description: 'Upload tweets, quotes, or YouTube videos for instant fact-checking analysis with our advanced AI verification system.',
    icon: Zap,
    gradient: 'from-yellow-500 to-orange-600',
    imagePlaceholder: '/features/quick-analysis.jpg',
    benefits: ['Multiple formats', 'Instant results', 'AI-powered analysis']
  }
];