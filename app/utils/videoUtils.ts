import { FactCheckResult } from '@/app/types/video';

export function getFactCheckVerdict(factCheck?: FactCheckResult) {
  if (!factCheck) return null;
  
  const evaluation = factCheck.evaluation;
  const truthPercentage = factCheck.truthPercentage || 0;
  
  // Determine verdict based on evaluation and truth percentage
  let status = 'UNVERIFIED';
  if (evaluation === 'Fact' && truthPercentage >= 90) status = 'TRUE';
  else if (evaluation === 'Mislead' || truthPercentage < 30) status = 'FALSE';
  else if (truthPercentage >= 60) status = 'MOSTLY TRUE';
  else if (truthPercentage >= 40) status = 'MIXED';
  else status = 'MOSTLY FALSE';
  
  return { status, evaluation, truthPercentage };
}