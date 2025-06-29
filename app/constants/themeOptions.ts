import { Monitor, Moon, Sun } from "lucide-react";

export const THEME_OPTIONS = [
  {
    id: 'light',
    label: 'Light',
    description: 'Clean and bright',
    icon: Sun,
    gradient: 'from-amber-400 to-orange-500',
    color: '#f59e0b'
  },
  {
    id: 'dark',
    label: 'Dark',
    description: 'Easy on the eyes',
    icon: Moon,
    gradient: 'from-indigo-600 to-purple-600',
    color: '#8b5cf6'
  },
  {
    id: 'system',
    label: 'System',
    description: 'Matches your device',
    icon: Monitor,
    gradient: 'from-gray-600 to-gray-800',
    color: '#6b7280'
  }
];