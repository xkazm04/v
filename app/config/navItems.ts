import { Home, Newspaper, Film } from 'lucide-react';

export const NAVIGATION_CONFIG = {
  mainNav: [
    {
      href: '/',
      label: 'Home',
      description: 'Return to homepage'
    },
    {
      href: '/news',
      label: 'News',
      description: 'Latest fact-checked news'
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      description: 'Dashboard with personalized insights'
    },{
      href: '/reel',
      label: 'Reel',
      description: 'Explore trending videos'
    },
    {
      href: '/upload',
      label: 'Upload',
      description: 'Upload'
    }
  ]
} as const;


interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  isSpecial?: boolean;
}


export const MOBILE_NAV: TabItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    href: '/'
  },
  {
    id: 'news',
    label: 'News',
    icon: Newspaper,
    href: '/news'
  },
  {
    id: 'reel',
    label: 'Reel',
    icon: Film,
    href: '/reel'
  }
];