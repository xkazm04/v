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
  switch (status) {
    case 'true': return 'TRUE';
    case 'false': return 'FALSE';
    case 'misleading': return 'MISLEAD';
    case 'partially_true': return 'PARTIAL';
    case 'unverifiable': return 'UNVERIFIABLE';
    default: return 'UNKNOWN';
  }
}