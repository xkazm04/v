import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export interface ComponentColors {
  background?: string;
  foreground?: string;
  border?: string;
  muted?: string;
  hover?: string;
  active?: string;
  backdrop?: string;
  shadow?: string;
  blur?: string;
  accent?: string;
}

interface OverlayColors {
  background?: string;
  foreground?: string;
  border?: string;
  muted?: string;
  hover?: string;
  active?: string;
  backdrop?: string;
  shadow?: string;
  blur?: string;
  accent?: string;
}

interface CardColors {
  background?: string;
  foreground?: string;
  border?: string;
  muted?: string;
  hover?: string;
  active?: string;
  backdrop?: string;
  shadow?: string;
  blur?: string;
  accent?: string;
}

// ✅ NEW: Vintage color palette interface
export interface VintageColors {
  paper: string;
  ink: string;
  faded: string;
  aged: string;
  sepia: string;
  highlight: string;
  shadow: string;
  crease: string;
}

export interface ThemeColors {
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
  // ✅ NEW: Add vintage colors to theme
  vintage: VintageColors;
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
    // Enhanced vintage-inspired colors
    primary: '#8b4513', // Rich saddle brown
    secondary: '#6b5b73', // Muted lavender gray
    accent: '#cd853f', // Peru/antique brass
    background: '#faf9f7', // Warm off-white
    foreground: '#2c1810', // Dark brown ink
    muted: '#f4f1ec', // Cream paper
    mutedForeground: '#8b7355', // Faded brown
    border: '#d4c4a8', // Aged paper border
    input: '#ffffff',
    ring: '#8b4513',
    
    // ✅ NEW: Dedicated vintage color palette for light mode
    vintage: {
      paper: '#f8f6f0', // Main paper color
      ink: '#2c1810', // Primary text color
      faded: '#7a6f47', // Aged text
      aged: '#e8dcc0', // Old paper edges
      sepia: '#d4c4a8', // Sepia tones
      highlight: '#fff8e7', // Paper highlight
      shadow: 'rgba(139, 69, 19, 0.15)', // Brown shadow
      crease: '#e0d5c0', // Paper fold lines
    },
    
    sidebar: {
      background: '#f8f6f0', // Aged newsprint
      foreground: '#2c1810', // Dark ink
      border: '#e0d5c0', // Coffee stain border
      hover: '#f1ede4', // Light paper hover
      active: '#eae3d2', // Pressed paper
      muted: '#a0956b', // Faded text
      accent: '#8b4513', // Rich brown accent
    },
    navbar: {
      background: 'hsl(45 25% 94%)', // Aged cream paper
      foreground: 'hsl(0 0% 8%)', // Deep black ink
      border: 'hsl(35 8% 75%)', // Subtle newsprint lines
      accent: 'hsl(25 85% 35%)', // Classic red ink
      muted: 'hsl(40 12% 88%)', // Light sepia tone
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
    // Keep existing dark theme
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
    
    // ✅ NEW: Dark mode vintage colors (more muted, tech-like)
    vintage: {
      paper: '#1e293b', // Dark slate background
      ink: '#f8fafc', // Light text
      faded: '#94a3b8', // Muted slate text
      aged: '#334155', // Darker edges
      sepia: '#475569', // Darker sepia
      highlight: '#64748b', // Subtle highlight
      shadow: 'rgba(0, 0, 0, 0.3)', // Dark shadow
      crease: '#475569', // Border lines
    },
    
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

// ✅ NEW: Vintage color getter
export const getVintageColors = (theme: 'light' | 'dark'): VintageColors => 
  colors[theme].vintage;

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