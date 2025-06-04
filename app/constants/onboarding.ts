
import { 
  Globe, 
  Flag, 
  Users, 
  Leaf, 
  Shield, 
  Sun, 
  Moon, 
} from 'lucide-react';

export const COUNTRIES = [
  {
    id: 'worldwide',
    label: 'Worldwide',
    flag: '🌍',
    icon: Globe,
    description: 'Global news & fact-checks'
  },
  {
    id: 'usa',
    label: 'United States',
    flag: '🇺🇸',
    icon: Flag,
    description: 'US-focused content'
  }
];

export const CATEGORIES = [
  {
    id: 'politics',
    label: 'Politics',
    icon: Users,
    color: '#3b82f6',
    description: 'Political statements & claims'
  },
  {
    id: 'environment',
    label: 'Environment',
    icon: Leaf,
    color: '#22c55e',
    description: 'Climate & environmental claims'
  },
  {
    id: 'military',
    label: 'Military',
    icon: Shield,
    color: '#ef4444',
    description: 'Defense & security topics'
  }
];

export const THEMES = [
  {
    id: 'light',
    label: 'Light Mode',
    icon: Sun,
    color: '#f59e0b',
    description: 'Bright & clean interface'
  },
  {
    id: 'dark',
    label: 'Dark Mode',
    icon: Moon,
    color: '#8b5cf6',
    description: 'Easy on the eyes'
  }
];