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

export const getStatusTranslation = (status: string) => {
  if (!status) return 'UNKNOWN';
  
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case 'true': 
    case 'TRUE':
      return 'TRUE';
    case 'false': 
    case 'FALSE':
      return 'FALSE';
    case 'misleading': 
    case 'MISLEADING':
      return 'MISLEADING';
    case 'partially_true': 
    case 'PARTIALLY_TRUE':
    case 'partial':
      return 'PARTIALLY TRUE';
    case 'unverifiable': 
    case 'UNVERIFIABLE':
      return 'UNVERIFIABLE';
    case 'mixed':
      return 'MIXED';
    default: 
      return status.toUpperCase().replace('_', ' ');
  }
}

  export const getStatusColors = (status: string) => {
        const normalizedStatus = status.toLowerCase();
        
        switch (normalizedStatus) {
            case 'true':
            case 'mostly true':
                return {
                    gradientFrom: '#10b981', // emerald-500
                    gradientVia: '#22c55e',   // green-500
                    gradientTo: '#0d9488',    // teal-600
                    borderColor: 'rgba(52, 211, 153, 0.5)', // emerald-300/50
                    shadowColor: 'rgba(16, 185, 129, 0.25)', // emerald-500/25
                    glowColor: 'rgba(52, 211, 153, 0.6)',    // emerald-400/60
                    badgeClasses: 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30'
                };
            case 'false':
            case 'mostly false':
                return {
                    gradientFrom: '#ef4444', // red-500
                    gradientVia: '#f43f5e',  // rose-500
                    gradientTo: '#ec4899',   // pink-600
                    borderColor: 'rgba(252, 165, 165, 0.5)', // red-300/50
                    shadowColor: 'rgba(239, 68, 68, 0.25)',  // red-500/25
                    glowColor: 'rgba(248, 113, 113, 0.6)',   // red-400/60
                    badgeClasses: 'bg-red-500/20 text-red-100 border-red-400/30'
                };
            case 'misleading':
                return {
                    gradientFrom: '#f97316', // orange-500
                    gradientVia: '#ef4444',  // red-500
                    gradientTo: '#f43f5e',   // rose-600
                    borderColor: 'rgba(253, 186, 116, 0.5)', // orange-300/50
                    shadowColor: 'rgba(249, 115, 22, 0.25)', // orange-500/25
                    glowColor: 'rgba(251, 146, 60, 0.6)',    // orange-400/60
                    badgeClasses: 'bg-orange-500/20 text-orange-100 border-orange-400/30'
                };
            case 'mixed':
            case 'partially true':
            case 'partially_true':
                return {
                    gradientFrom: '#eab308', // yellow-500
                    gradientVia: '#f59e0b',  // amber-500
                    gradientTo: '#f97316',   // orange-500
                    borderColor: 'rgba(253, 224, 71, 0.5)',  // yellow-300/50
                    shadowColor: 'rgba(234, 179, 8, 0.25)',  // yellow-500/25
                    glowColor: 'rgba(250, 204, 21, 0.6)',    // yellow-400/60
                    badgeClasses: 'bg-yellow-500/20 text-yellow-100 border-yellow-400/30'
                };
            case 'unverifiable':
                return {
                    gradientFrom: '#64748b', // slate-500
                    gradientVia: '#6b7280',  // gray-500
                    gradientTo: '#71717a',   // zinc-600
                    borderColor: 'rgba(148, 163, 184, 0.5)', // slate-300/50
                    shadowColor: 'rgba(100, 116, 139, 0.25)', // slate-500/25
                    glowColor: 'rgba(148, 163, 184, 0.6)',    // slate-400/60
                    badgeClasses: 'bg-slate-500/20 text-slate-100 border-slate-400/30'
                };
            default:
                return {
                    gradientFrom: '#3b82f6', // blue-500
                    gradientVia: '#6366f1',  // indigo-500
                    gradientTo: '#8b5cf6',   // purple-600
                    borderColor: 'rgba(147, 197, 253, 0.5)', // blue-300/50
                    shadowColor: 'rgba(59, 130, 246, 0.25)', // blue-500/25
                    glowColor: 'rgba(96, 165, 250, 0.6)',    // blue-400/60
                    badgeClasses: 'bg-blue-500/20 text-blue-100 border-blue-400/30'
                };
        }
    };
