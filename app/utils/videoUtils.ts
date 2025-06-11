import { FactCheckData, VideoWithTimestamps } from '@/app/types/video_api';

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

export function getVideoFactCheckSummary(video: VideoWithTimestamps) {
  const { timestamps } = video;
  
  if (timestamps.length === 0) {
    return {
      totalClaims: 0,
      trueClaims: 0,
      falseClaims: 0,
      misleadingClaims: 0,
      unverifiableClaims: 0,
      averageConfidence: 0,
      overallStatus: 'UNVERIFIED' as const
    };
  }

  const statusCounts = timestamps.reduce((acc, ts) => {
    const status = ts.factCheck?.status || 'UNVERIFIABLE';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const averageConfidence = timestamps.reduce((sum, ts) => 
    //@ts-expect-error Ignore
    sum + (ts.factCheck?.confidence || 0), 0) / timestamps.length;

  // Determine overall status
  let overallStatus: 'TRUE' | 'FALSE' | 'MISLEADING' | 'MIXED' | 'UNVERIFIED';
  
  const totalVerified = (statusCounts.TRUE || 0) + (statusCounts.FALSE || 0) + (statusCounts.MISLEADING || 0) + (statusCounts.PARTIALLY_TRUE || 0);
  const totalClaims = timestamps.length;
  
  if (totalVerified === 0) {
    overallStatus = 'UNVERIFIED';
  } else if (statusCounts.FALSE && statusCounts.FALSE > totalClaims * 0.5) {
    overallStatus = 'FALSE';
  } else if (statusCounts.MISLEADING && statusCounts.MISLEADING > totalClaims * 0.3) {
    overallStatus = 'MISLEADING';
  } else if (statusCounts.TRUE && statusCounts.TRUE > totalClaims * 0.7) {
    overallStatus = 'TRUE';
  } else {
    overallStatus = 'MIXED';
  }

  return {
    totalClaims: timestamps.length,
    trueClaims: statusCounts.TRUE || 0,
    falseClaims: statusCounts.FALSE || 0,
    misleadingClaims: (statusCounts.MISLEADING || 0) + (statusCounts.PARTIALLY_TRUE || 0),
    unverifiableClaims: statusCounts.UNVERIFIABLE || 0,
    averageConfidence: Math.round(averageConfidence),
    overallStatus
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