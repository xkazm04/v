import { Clock10Icon, LucideBrainCog, NewspaperIcon } from 'lucide-react';

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
  translationKey?: string;
  isCustomIcon?: boolean; // New property to identify custom icons
}

export const MOBILE_NAV: TabItem[] = [
  {
    id: 'home',
    label: 'News',
    icon: NewspaperIcon,
    href: '/',
    translationKey: 'navigation.home',
    isCustomIcon: false
  },
  {
    id: 'edu',
    label: 'Education',
    icon: Clock10Icon,
    href: '/timeline',
    isSpecial: true,
    translationKey: 'navigation.education',
    isCustomIcon: false
  },
  {
    id: 'upload',
    label: 'Upload',
    icon: LucideBrainCog,
    href: '/upload',
    isSpecial: true,
    translationKey: 'navigation.upload',
  }
];

export const NAV_TRANSLATION_KEYS = {
  home: 'navigation.home',
  dashboard: 'navigation.dashboard', 
  upload: 'navigation.upload',
  education: 'navigation.education'
} as const;