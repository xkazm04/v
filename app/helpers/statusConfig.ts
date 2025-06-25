import { CheckCircle, AlertCircle, Hash } from 'lucide-react';
import { StatementStatus } from '@/app/types/profile';

export interface StatusColors {
  glowColor: string;
  ringColor: string;
  backgroundColor: string;
  textColor: string;
  badgeBackground: string;
  badgeBorder: string;
}

export interface StatusConfig {
  colors: StatusColors;
  icon: any;
  label: string;
  confidence: number;
}

export const getStatusConfig = (status: StatementStatus, isDark: boolean): StatusConfig => {
  const configs: Record<StatementStatus, StatusConfig> = {
    TRUE: {
      colors: {
        glowColor: isDark ? '#10b981' : '#059669',
        ringColor: isDark ? '#34d399' : '#10b981',
        backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
        textColor: isDark ? '#34d399' : '#059669',
        badgeBackground: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(240, 253, 244, 0.9)',
        badgeBorder: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
      },
      icon: CheckCircle,
      label: 'TRUE',
      confidence: 95
    },
    FALSE: {
      colors: {
        glowColor: isDark ? '#ef4444' : '#dc2626',
        ringColor: isDark ? '#f87171' : '#ef4444',
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
        textColor: isDark ? '#f87171' : '#dc2626',
        badgeBackground: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(254, 242, 242, 0.9)',
        badgeBorder: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
      },
      icon: AlertCircle,
      label: 'FALSE',
      confidence: 90
    },
    MISLEADING: {
      colors: {
        glowColor: isDark ? '#f59e0b' : '#d97706',
        ringColor: isDark ? '#fbbf24' : '#f59e0b',
        backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
        textColor: isDark ? '#fbbf24' : '#d97706',
        badgeBackground: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 251, 235, 0.9)',
        badgeBorder: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.2)',
      },
      icon: AlertCircle,
      label: 'MISLEADING',
      confidence: 85
    },
    PARTIALLY_TRUE: {
      colors: {
        glowColor: isDark ? '#3b82f6' : '#2563eb',
        ringColor: isDark ? '#60a5fa' : '#3b82f6',
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
        textColor: isDark ? '#60a5fa' : '#2563eb',
        badgeBackground: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 246, 255, 0.9)',
        badgeBorder: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
      },
      icon: CheckCircle,
      label: 'PARTIAL',
      confidence: 75
    },
    UNVERIFIABLE: {
      colors: {
        glowColor: isDark ? '#8b5cf6' : '#7c3aed',
        ringColor: isDark ? '#a78bfa' : '#8b5cf6',
        backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
        textColor: isDark ? '#a78bfa' : '#7c3aed',
        badgeBackground: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(245, 243, 255, 0.9)',
        badgeBorder: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
      },
      icon: Hash,
      label: 'UNVERIFIABLE',
      confidence: 50
    }
  };

  return configs[status] || configs.UNVERIFIABLE;
};