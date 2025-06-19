import { Clock10Icon, NewspaperIcon } from 'lucide-react';
import ReelIcon from '../components/icons/nav/icon_reel';

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
    id: 'reel',
    label: 'Reel',
    icon: ReelIcon,
    href: '/reel',
    translationKey: 'navigation.reel',
    isCustomIcon: true
  },
  {
    id: 'edu',
    label: 'Education',
    icon: Clock10Icon,
    href: '/timeline',
    isSpecial: true,
    translationKey: 'navigation.education',
    isCustomIcon: false
  }
];

export const NAV_TRANSLATION_KEYS = {
  home: 'navigation.home',
  dashboard: 'navigation.dashboard', 
  reel: 'navigation.reel',
  upload: 'navigation.upload',
  education: 'navigation.education'
} as const;