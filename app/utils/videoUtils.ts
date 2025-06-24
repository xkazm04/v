import { FactCheckData } from '@/app/types/video_api';

export function getFactCheckVerdict(factCheck?: FactCheckData) {
  if (!factCheck) {
    return null;
  }

  return {
    status: factCheck.status || 'UNVERIFIABLE',
    verdict: factCheck.verdict || 'No analysis available',
    confidence: factCheck.confidence || 0,
    sources: factCheck.sources,
    expertAnalysis: factCheck.expertAnalysis,
    processedAt: factCheck.processedAt
  };
}

export function formatFactCheckStatus(status: string): string {
  switch (status) {
    case 'TRUE':
      return 'Verified True';
    case 'FALSE':
      return 'Verified False';
    case 'PARTIALLY_TRUE':
      return 'Partially True';
    case 'MISLEADING':
      return 'Misleading';
    case 'UNVERIFIABLE':
      return 'Unverifiable';
    case 'MIXED':
      return 'Mixed Claims';
    case 'UNVERIFIED':
      return 'Not Fact-Checked';
    default:
      return 'Unknown';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'TRUE':
      return '#10B981'; // Green
    case 'FALSE':
      return '#EF4444'; // Red
    case 'PARTIALLY_TRUE':
      return '#F59E0B'; // Amber
    case 'MISLEADING':
      return '#F97316'; // Orange
    case 'UNVERIFIABLE':
    case 'UNVERIFIED':
      return '#6B7280'; // Gray
    case 'MIXED':
      return '#8B5CF6'; // Purple
    default:
      return '#6B7280'; // Gray
  }
}