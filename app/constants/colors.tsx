import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

// Define proper types for color configurations
interface ComponentColors {
  background: string;
  foreground: string;
  border: string;
  muted: string;
  hover?: string;
  active?: string;
  accent?: string;
}

interface OverlayColors {
  backdrop: string;
  blur: string;
  background?: string;
  foreground?: string;
}

interface CardColors {
  background: string;
  foreground: string;
  border: string;
  shadow: string;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  navbar: ComponentColors;
  sidebar: ComponentColors;
  card: CardColors;
  overlay: OverlayColors;
  active?: string;
  inactive?: string;
  iconBg?: string;
  iconBorder?: string;
  text?: string;
  textMuted?: string;
  badge?: string;
  badgeText?: string;
  badgeBorder?: string;
  badgeBg?: string;
}

export const colors: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    // Existing colors
    primary: '#3b82f6',
    secondary: '#64748b', 
    accent: '#f59e0b',
    background: '#fefefe',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    input: '#ffffff',
    ring: '#3b82f6',
    
    // Layout-specific colors
    navbar: {
      background: 'hsl(45 25% 94%)', // Aged cream paper
      foreground: 'hsl(0 0% 8%)', // Deep black ink
      border: 'hsl(35 8% 75%)', // Subtle newsprint lines
      accent: 'hsl(25 85% 35%)', // Classic red ink
      muted: 'hsl(40 12% 88%)', // Light sepia tone
    },
    sidebar: {
      background: 'hsl(42 20% 96%)', // Slightly whiter paper
      foreground: 'hsl(0 0% 8%)',
      border: 'hsl(35 8% 75%)',
      hover: 'hsl(40 12% 88%)',
      active: 'hsl(35 15% 85%)',
      muted: 'hsl(0 0% 35%)',
    },
    card: {
      background: 'hsl(42 20% 96%)',
      foreground: 'hsl(0 0% 8%)',
      border: 'hsl(35 8% 75%)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    overlay: {
      backdrop: 'rgba(0, 0, 0, 0.5)',
      blur: 'rgba(15, 23, 42, 0.8)',
      background: 'hsl(45 25% 94%)',
      foreground: 'hsl(0 0% 8%)',
    }
  },
  dark: {
    // Existing colors
    primary: '#60a5fa',
    secondary: '#94a3b8',
    accent: '#fbbf24', 
    background: '#0f172a',
    foreground: '#f8fafc',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    border: '#334155',
    input: '#1e293b',
    ring: '#60a5fa',
    
    // Layout-specific colors for dark mode
    navbar: {
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
      border: 'hsl(217.2 32.6% 17.5%)',
      accent: 'hsl(210 40% 98%)',
      muted: 'hsl(215 20.2% 65.1%)',
    },
    sidebar: {
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
      border: 'hsl(217.2 32.6% 17.5%)',
      hover: 'hsl(217.2 32.6% 17.5%)',
      active: 'hsl(215 20.2% 25.1%)',
      muted: 'hsl(215 20.2% 65.1%)',
    },
    card: {
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
      border: 'hsl(217.2 32.6% 17.5%)',
      shadow: 'rgba(0, 0, 0, 0.3)',
    },
    overlay: {
      backdrop: 'rgba(0, 0, 0, 0.7)',
      blur: 'rgba(15, 23, 42, 0.9)',
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
    }
  }
};

// Updated utility functions with proper typing
export const getThemeColors = (theme: 'light' | 'dark'): ThemeColors => colors[theme];

export const getLayoutColors = (
  theme: 'light' | 'dark', 
  component: 'navbar' | 'sidebar' | 'card' | 'overlay'
): ComponentColors | CardColors | OverlayColors => {
  return colors[theme][component];
};

// Enhanced getter functions for specific component types
export const getNavbarColors = (theme: 'light' | 'dark'): ComponentColors => 
  colors[theme].navbar;

export const getSidebarColors = (theme: 'light' | 'dark'): ComponentColors => 
  colors[theme].sidebar;

export const getCardColors = (theme: 'light' | 'dark'): CardColors => 
  colors[theme].card;

export const getOverlayColors = (theme: 'light' | 'dark'): OverlayColors => 
  colors[theme].overlay;

export const statusColorConfig = {
    light: {
        TRUE: {
            color: "#16a34a",
            icon: CheckCircle,
            label: "VERIFIED",
            bgGradient: "linear-gradient(135deg, rgba(220, 252, 231, 0.95) 0%, rgba(187, 247, 208, 0.98) 30%, rgba(34, 197, 94, 0.15) 100%)",
            stampOpacity: "0.08"
        },
        FALSE: {
            color: "#dc2626",
            icon: XCircle,
            label: "FALSE",
            bgGradient: "linear-gradient(135deg, rgba(254, 226, 226, 0.95) 0%, rgba(252, 165, 165, 0.98) 30%, rgba(239, 68, 68, 0.15) 100%)",
            stampOpacity: "0.08"
        },
        MISLEADING: {
            color: "#d97706",
            icon: AlertTriangle,
            label: "MISLEADING",
            bgGradient: "linear-gradient(135deg, rgba(254, 243, 199, 0.95) 0%, rgba(252, 211, 77, 0.98) 30%, rgba(245, 158, 11, 0.15) 100%)",
            stampOpacity: "0.08"
        },
        PARTIALLY_TRUE: {
            color: "#2563eb",
            icon: CheckCircle,
            label: "PARTIAL",
            bgGradient: "linear-gradient(135deg, rgba(219, 234, 254, 0.95) 0%, rgba(147, 197, 253, 0.98) 30%, rgba(59, 130, 246, 0.15) 100%)",
            stampOpacity: "0.08"
        },
        UNVERIFIABLE: {
            color: "#7c3aed",
            icon: AlertTriangle,
            label: "UNCLEAR",
            bgGradient: "linear-gradient(135deg, rgba(237, 233, 254, 0.95) 0%, rgba(196, 181, 253, 0.98) 30%, rgba(139, 92, 246, 0.15) 100%)",
            stampOpacity: "0.08"
        }
    },
    dark: {
        TRUE: {
            color: "#22c55e",
            icon: CheckCircle,
            label: "VERIFIED",
            bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 30%, rgba(34, 197, 94, 0.15) 100%)",
            stampOpacity: "0.05"
        },
        FALSE: {
            color: "#ef4444",
            icon: XCircle,
            label: "FALSE",
            bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 30%, rgba(239, 68, 68, 0.15) 100%)",
            stampOpacity: "0.05"
        },
        MISLEADING: {
            color: "#f59e0b",
            icon: AlertTriangle,
            label: "MISLEADING",
            bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 30%, rgba(245, 158, 11, 0.15) 100%)",
            stampOpacity: "0.05"
        },
        PARTIALLY_TRUE: {
            color: "#3b82f6",
            icon: CheckCircle,
            label: "PARTIAL",
            bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 30%, rgba(59, 130, 246, 0.15) 100%)",
            stampOpacity: "0.05"
        },
        UNVERIFIABLE: {
            color: "#8b5cf6",
            icon: AlertTriangle,
            label: "UNCLEAR",
            bgGradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 30%, rgba(139, 92, 246, 0.15) 100%)",
            stampOpacity: "0.05"
        }
    }
};