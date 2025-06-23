import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export function getEvaluationIcon(evaluation: string, size: 'sm' | 'md' | 'lg' = 'md') {
  const sizeClass = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }[size];

  const iconProps = { className: sizeClass };

  switch (evaluation) {
    case 'Fact':
      return <CheckCircle {...iconProps} className={`${sizeClass} text-green-500`} />;
    case 'Mislead':
      return <AlertTriangle {...iconProps} className={`${sizeClass} text-yellow-500`} />;
    case 'Lie':
      return <XCircle {...iconProps} className={`${sizeClass} text-red-500`} />;
    default:
      return <AlertTriangle {...iconProps} className={`${sizeClass} text-gray-500`} />;
  }
}

export function getEvaluationColor(evaluation: string) {
  switch (evaluation) {
    case 'Fact':
      return 'text-green-600';
    case 'Mislead':
      return 'text-yellow-600';
    case 'Lie':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

export function getProgressBarColors() {
  return {
    truth: 'bg-green-500',
    neutral: 'bg-neutral-400',
    misleading: 'bg-red-500'
  };
}

// Multilingual status translations
const STATUS_TRANSLATIONS = {
  en: {
    TRUE: 'TRUE',
    FACTUAL_ERROR: 'FACTUAL ERROR',
    DECEPTIVE_LIE: 'DECEPTIVE LIE',
    MANIPULATIVE: 'MANIPULATIVE',
    PARTIALLY_TRUE: 'PARTIALLY TRUE',
    OUT_OF_CONTEXT: 'OUT OF CONTEXT',
    UNVERIFIABLE: 'UNVERIFIABLE',
    FALSE: 'FALSE',
    MISLEADING: 'MISLEADING',
    MIXED: 'MIXED'
  },
  es: {
    TRUE: 'VERDADERO',
    FACTUAL_ERROR: 'ERROR FACTUAL',
    DECEPTIVE_LIE: 'MENTIRA ENGAÑOSA',
    MANIPULATIVE: 'MANIPULATIVO',
    PARTIALLY_TRUE: 'PARCIALMENTE VERDADERO',
    OUT_OF_CONTEXT: 'FUERA DE CONTEXTO',
    UNVERIFIABLE: 'NO VERIFICABLE',
    FALSE: 'FALSO',
    MISLEADING: 'ENGAÑOSO',
    MIXED: 'MIXTO'
  },
  cs: {
    TRUE: 'PRAVDA',
    FACTUAL_ERROR: 'FAKTICKÁ CHYBA',
    DECEPTIVE_LIE: 'KLAMAVÁ LŽI',
    MANIPULATIVE: 'MANIPULATIVNÍ',
    PARTIALLY_TRUE: 'ČÁSTEČNĚ PRAVDA',
    OUT_OF_CONTEXT: 'MIMO KONTEXT',
    UNVERIFIABLE: 'NEOVĚŘITELNÉ',
    FALSE: 'NEPRAVDA',
    MISLEADING: 'ZAVÁDĚJÍCÍ',
    MIXED: 'SMÍŠENÉ'
  }
} as const;

export type SupportedLanguage = 'en' | 'es' | 'cs';
export type StatusKey = keyof typeof STATUS_TRANSLATIONS.en;

// Enhanced multilingual status translation function
export const getStatusTranslation = (status: string, language: SupportedLanguage = 'en') => {
  if (!status) return STATUS_TRANSLATIONS[language].UNVERIFIABLE;
  
  // Normalize status to match our enum
  const normalizedStatus = status.toUpperCase().replace(/\s+/g, '_');
  
  // Direct mapping for new backend values
  const statusMap: Record<string, StatusKey> = {
    'TRUE': 'TRUE',
    'FACTUAL_ERROR': 'FACTUAL_ERROR',
    'DECEPTIVE_LIE': 'DECEPTIVE_LIE',
    'MANIPULATIVE': 'MANIPULATIVE',
    'PARTIALLY_TRUE': 'PARTIALLY_TRUE',
    'OUT_OF_CONTEXT': 'OUT_OF_CONTEXT',
    'UNVERIFIABLE': 'UNVERIFIABLE',
    
    // Legacy mappings for backward compatibility
    'FALSE': 'FALSE',
    'MISLEADING': 'MISLEADING',
    'MIXED': 'MIXED',
    'PARTIAL': 'PARTIALLY_TRUE',
    'MOSTLY_TRUE': 'TRUE',
    'MOSTLY_FALSE': 'FALSE'
  };

  const mappedStatus = statusMap[normalizedStatus];
  
  if (mappedStatus && STATUS_TRANSLATIONS[language][mappedStatus]) {
    return STATUS_TRANSLATIONS[language][mappedStatus];
  }
  
  // Fallback to English if translation not found
  if (language !== 'en' && mappedStatus && STATUS_TRANSLATIONS.en[mappedStatus]) {
    return STATUS_TRANSLATIONS.en[mappedStatus];
  }
  
  // Final fallback
  return normalizedStatus.replace('_', ' ');
};

// Legacy function for backward compatibility
export const getStatusTranslationLegacy = (status: string) => {
  return getStatusTranslation(status, 'en');
};

export const getStatusColors = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case 'true':
    case 'mostly true':
      return {
        gradientFrom: '#16a34a',
        gradientVia: '#22c55e',
        gradientTo: '#4ade80',
        borderColor: 'rgba(34, 197, 94, 0.5)',
        shadowColor: 'rgba(34, 197, 94, 0.25)',
        glowColor: 'rgba(34, 197, 94, 0.6)',
        badgeClasses: 'bg-green-500/20 text-green-100 border-green-400/30'
      };

    case 'false':
    case 'mostly false':
    case 'factual_error':
    case 'deceptive_lie':
      return {
        gradientFrom: '#dc2626',
        gradientVia: '#ef4444',
        gradientTo: '#f87171',
        borderColor: 'rgba(239, 68, 68, 0.5)',
        shadowColor: 'rgba(239, 68, 68, 0.25)',
        glowColor: 'rgba(239, 68, 68, 0.6)',
        badgeClasses: 'bg-red-500/20 text-red-100 border-red-400/30'
      };

    case 'misleading':
    case 'manipulative':
    case 'out_of_context':
      return {
        gradientFrom: '#d97706',
        gradientVia: '#f59e0b',
        gradientTo: '#fbbf24',
        borderColor: 'rgba(245, 158, 11, 0.5)',
        shadowColor: 'rgba(245, 158, 11, 0.25)',
        glowColor: 'rgba(245, 158, 11, 0.6)',
        badgeClasses: 'bg-amber-500/20 text-amber-100 border-amber-400/30'
      };

    case 'mixed':
    case 'partially true':
    case 'partially_true':
      return {
        gradientFrom: '#2563eb',
        gradientVia: '#3b82f6',
        gradientTo: '#60a5fa',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        shadowColor: 'rgba(59, 130, 246, 0.25)',
        glowColor: 'rgba(59, 130, 246, 0.6)',
        badgeClasses: 'bg-blue-500/20 text-blue-100 border-blue-400/30'
      };

    case 'unverifiable':
      return {
        gradientFrom: '#7c3aed',
        gradientVia: '#8b5cf6',
        gradientTo: '#a78bfa',
        borderColor: 'rgba(139, 92, 246, 0.5)',
        shadowColor: 'rgba(139, 92, 246, 0.25)',
        glowColor: 'rgba(139, 92, 246, 0.6)',
        badgeClasses: 'bg-purple-500/20 text-purple-100 border-purple-400/30'
      };

    default:
      return {
        gradientFrom: '#3b82f6',
        gradientVia: '#6366f1',
        gradientTo: '#8b5cf6',
        borderColor: 'rgba(147, 197, 253, 0.5)',
        shadowColor: 'rgba(59, 130, 246, 0.25)',
        glowColor: 'rgba(96, 165, 250, 0.6)',
        badgeClasses: 'bg-blue-500/20 text-blue-100 border-blue-400/30'
      };
  }
};