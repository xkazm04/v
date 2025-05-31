import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ColorSubtone = 'neutral' | 'blue' | 'red' | 'green' | 'yellow' | 'purple';

export interface SubtoneConfig {
  name: string;
  label: string;
  description: string;
  gradient: {
    light: string;
    dark: string;
  };
  preview: string;
}

export const SUBTONE_CONFIGS: Record<ColorSubtone, SubtoneConfig> = {
  neutral: {
    name: 'neutral',
    label: 'Neutral',
    description: 'Classic newspaper feel',
    gradient: {
      light: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.03), transparent)',
      dark: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.05), transparent)'
    },
    preview: '#f8f9fa'
  },
  blue: {
    name: 'blue',
    label: 'Blue',
    description: 'Calm and professional',
    gradient: {
      light: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.8), transparent)',
      dark: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.82), transparent)'
    },
    preview: '#3b82f6'
  },
  red: {
    name: 'red',
    label: 'Red',
    description: 'Bold and energetic',
    gradient: {
      light: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(239, 68, 68, 0.8), transparent)',
      dark: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(239, 68, 68, 0.82), transparent)'
    },
    preview: '#ef4444'
  },
  green: {
    name: 'green',
    label: 'Matrix',
    description: 'Digital and futuristic',
    gradient: {
      light: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34, 197, 94, 0.8), transparent)',
      dark: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34, 197, 94, 0.82), transparent)'
    },
    preview: '#22c55e'
  },
  yellow: {
    name: 'yellow',
    label: 'Yellow',
    description: 'Warm and inviting',
    gradient: {
      light: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245, 158, 11, 0.8), transparent)',
      dark: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245, 158, 11, 0.82), transparent)'
    },
    preview: '#f59e0b'
  },
  purple: {
    name: 'purple',
    label: 'Purple',
    description: 'Creative and modern',
    gradient: {
      light: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.8), transparent)',
      dark: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.82), transparent)'
    },
    preview: '#8b5cf6'
  }
};

interface AppearanceState {
  colorSubtone: ColorSubtone;
  setColorSubtone: (subtone: ColorSubtone) => void;
  getSubtoneConfig: () => SubtoneConfig;
  getGradientStyle: (theme?: 'light' | 'dark') => string;
}

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set, get) => ({
      colorSubtone: 'neutral',
      
      setColorSubtone: (subtone: ColorSubtone) => {
        set({ colorSubtone: subtone });
      },
      
      getSubtoneConfig: () => {
        const state = get();
        return SUBTONE_CONFIGS[state.colorSubtone];
      },
      
      getGradientStyle: (theme = 'light') => {
        const state = get();
        const config = SUBTONE_CONFIGS[state.colorSubtone];
        return config.gradient[theme];
      }
    }),
    {
      name: 'appearance-settings',
      version: 1,
    }
  )
);