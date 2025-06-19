import { Home, Newspaper, Film, Clock10Icon } from 'lucide-react';

export const NAVIGATION_CONFIG = {
  mainNav: [
    {
      href: '/',
      label: 'Home',
      description: 'Return to homepage',
      translationKey: 'navigation.home'
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      description: 'Dashboard with personalized insights',
      translationKey: 'navigation.dashboard'
    },
    {
      href: '/reel',
      label: 'Reel',
      description: 'Explore trending videos',
      translationKey: 'navigation.reel'
    },
    {
      href: '/upload',
      label: 'Upload',
      description: 'Upload',
      translationKey: 'navigation.upload'
    },
    {
      href: '/timeline',
      label: 'Education',
      description: 'Educational timeline',
      translationKey: 'navigation.education'
    }
  ]
} as const;

interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  isSpecial?: boolean;
  translationKey?: string; // ✅ NEW: Translation key
}

export const MOBILE_NAV: TabItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    href: '/',
    translationKey: 'navigation.home'
  },
  {
    id: 'reel',
    label: 'Reel',
    icon: Film,
    href: '/reel',
    translationKey: 'navigation.reel'
  },
  {
    id: 'edu',
    label: 'Education',
    icon: Clock10Icon,
    href: '/timeline',
    isSpecial: true,
    translationKey: 'navigation.education'
  }
];

// ✅ NEW: Navigation translation keys for easy reference
export const NAV_TRANSLATION_KEYS = {
  home: 'navigation.home',
  dashboard: 'navigation.dashboard', 
  reel: 'navigation.reel',
  upload: 'navigation.upload',
  education: 'navigation.education'
} as const;