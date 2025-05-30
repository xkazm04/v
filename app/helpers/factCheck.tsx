import { ShieldCheck, AlertTriangle, XCircle } from 'lucide-react';

export const getEvaluationIcon = (evaluation: string, size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const iconClass = sizeClasses[size];

  switch (evaluation) {
    case 'Fact': 
      return <ShieldCheck className={`${iconClass} text-verified`} />;
    case 'Mislead': 
      return <AlertTriangle className={`${iconClass} text-unverified`} />;
    case 'Lie': 
      return <XCircle className={`${iconClass} text-false`} />;
    default: 
      return null;
  }
};

export const getEvaluationColor = (evaluation: string): string => {
  switch (evaluation) {
    case 'Fact': return 'text-verified';
    case 'Mislead': return 'text-unverified';
    case 'Lie': return 'text-false';
    default: return 'text-muted-foreground';
  }
};

export const getEvaluationBgColor = (evaluation: string): string => {
  switch (evaluation) {
    case 'Fact': return 'bg-verified';
    case 'Mislead': return 'bg-unverified';
    case 'Lie': return 'bg-false';
    default: return 'bg-muted';
  }
};

export const getProgressBarColors = () => ({
  truth: 'bg-verified',
  neutral: 'bg-neutral-400',
  misleading: 'bg-false'
});