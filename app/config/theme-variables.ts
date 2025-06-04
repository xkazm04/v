export const THEME_VARIABLES = {
  light: {
    // Core colors
    '--color-background': '#ffffff',
    '--color-foreground': '#0f172a',
    '--color-primary': '#3b82f6',
    '--color-primary-foreground': '#ffffff',
    '--color-secondary': '#f1f5f9',
    '--color-secondary-foreground': '#0f172a',
    '--color-accent': '#f8fafc',
    '--color-accent-foreground': '#0f172a',
    '--color-muted': '#f1f5f9',
    '--color-muted-foreground': '#64748b',
    '--color-border': '#e2e8f0',
    '--color-input': '#ffffff',
    '--color-ring': '#3b82f6',
    
    // Card colors
    '--color-card-background': '#ffffff',
    '--color-card-foreground': '#0f172a',
    '--color-card-border': '#e2e8f0',
    '--color-card-shadow': 'rgba(0, 0, 0, 0.1)',
    
    // Overlay colors
    '--color-overlay-backdrop': 'rgba(0, 0, 0, 0.4)',
    
    // Status colors (matching your FactCheckModal)
    '--color-status-true': '#16a34a',
    '--color-status-false': '#dc2626',
    '--color-status-misleading': '#d97706',
    '--color-status-partially-true': '#2563eb',
    '--color-status-unverifiable': '#7c3aed',
  },
  dark: {
    // Core colors
    '--color-background': '#0f172a',
    '--color-foreground': '#f8fafc',
    '--color-primary': '#60a5fa',
    '--color-primary-foreground': '#0f172a',
    '--color-secondary': '#1e293b',
    '--color-secondary-foreground': '#f8fafc',
    '--color-accent': '#1e293b',
    '--color-accent-foreground': '#f8fafc',
    '--color-muted': '#1e293b',
    '--color-muted-foreground': '#94a3b8',
    '--color-border': '#334155',
    '--color-input': '#1e293b',
    '--color-ring': '#60a5fa',
    
    // Card colors
    '--color-card-background': '#1e293b',
    '--color-card-foreground': '#f8fafc',
    '--color-card-border': '#334155',
    '--color-card-shadow': 'rgba(0, 0, 0, 0.3)',
    
    // Overlay colors
    '--color-overlay-backdrop': 'rgba(0, 0, 0, 0.6)',
    
    // Status colors
    '--color-status-true': '#22c55e',
    '--color-status-false': '#ef4444',
    '--color-status-misleading': '#f59e0b',
    '--color-status-partially-true': '#3b82f6',
    '--color-status-unverifiable': '#8b5cf6',
  }
} as const;

export type ThemeVariables = typeof THEME_VARIABLES.light;