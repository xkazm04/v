import { 

  MessageSquare, 
  TrendingUp, 
  Globe,
  Flag,
  GraduationCap,
  Heart,
  Shield,
  Zap,
  Users,
  Building,
} from 'lucide-react';
import { StatementCategory } from '../sections/upload/types';
export const getCategoryIcon = (category?: StatementCategory) => {
  switch (category) {
    case 'politics': return Flag;
    case 'economy': return TrendingUp;
    case 'environment': return Globe;
    case 'military': return Shield;
    case 'healthcare': return Heart;
    case 'education': return GraduationCap;
    case 'technology': return Zap;
    case 'social': return Users;
    case 'international': return Globe;
    default: return MessageSquare;
  }
};

export const getCategoryColor = (category?: StatementCategory) => {
  switch (category) {
    case 'politics': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    case 'economy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    case 'environment': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
    case 'military': return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    case 'healthcare': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300';
    case 'education': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    case 'technology': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
    case 'social': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
    case 'international': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  }
};

export const getCountryName = (countryCode?: string) => {
  const countries: Record<string, string> = {
    'us': '🇺🇸 United States',
    'gb': '🇬🇧 United Kingdom',
    'de': '🇩🇪 Germany',
    'fr': '🇫🇷 France',
    'ca': '🇨🇦 Canada',
    'au': '🇦🇺 Australia',
    'jp': '🇯🇵 Japan',
    'br': '🇧🇷 Brazil',
    'in': '🇮🇳 India',
    'cn': '🇨🇳 China'
  };
  return countries[countryCode?.toLowerCase() || ''] || `🌍 ${countryCode?.toUpperCase()}`;
};

export const getMediaCategoryIcon = (category: string) => {
  switch (category) {
    case 'mainstream': return Globe;
    case 'governance': return Building;
    case 'academic': return GraduationCap;
    case 'medical': return Heart;
    default: return Globe;
  }
};

export const getCredibilityColor = (credibility: string) => {
  switch (credibility) {
    case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    case 'low': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  }
};

export const getCountryFlag = (countryCode: string) => {
  const flags: Record<string, string> = {
    'us': '🇺🇸',
    'gb': '🇬🇧',
    'de': '🇩🇪',
    'fr': '🇫🇷',
    'ca': '🇨🇦',
    'au': '🇦🇺',
    'jp': '🇯🇵',
    'br': '🇧🇷',
    'in': '🇮🇳',
    'cn': '🇨🇳'
  };
  return flags[countryCode.toLowerCase()] || '🌍';
};