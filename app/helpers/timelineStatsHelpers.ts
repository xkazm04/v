import { VideoTimestamp } from "../types/video_api";


export interface UnifiedClaim {
  id: string;
  claim: string;
  type: 'truth' | 'lie' | 'neutral';
  confidence: number;
  timestamp: number;
  duration?: number;
  endTime?: number;
  category?: string;
  factCheck?: any;
  isActive?: boolean;
}

export const calculateClaimStats = (claims: UnifiedClaim[]) => {
  if (claims.length === 0) {
    return {
      truthCount: 0,
      lieCount: 0,
      neutralCount: 0,
      avgConfidence: 0,
      totalClaims: 0,
      researchedClaims: 0,
      completionRate: 0
    };
  }

  const truthCount = claims.filter(c => c.type === 'truth').length;
  const lieCount = claims.filter(c => c.type === 'lie').length;
  const neutralCount = claims.filter(c => c.type === 'neutral').length;
  const researchedClaims = claims.filter(c => c.factCheck).length;
  
  const avgConfidence = claims.reduce((sum, c) => sum + c.confidence, 0) / claims.length;
  const completionRate = (researchedClaims / claims.length) * 100;

  return {
    truthCount,
    lieCount,
    neutralCount,
    avgConfidence: Math.round(avgConfidence),
    totalClaims: claims.length,
    researchedClaims,
    completionRate: Math.round(completionRate)
  };
};

export const convertVideoTimestampToClaim = (timestamp: VideoTimestamp, index: number): UnifiedClaim => {
  const getTypeFromStatus = (status?: string): 'truth' | 'lie' | 'neutral' => {
    switch (status) {
      case 'TRUE':
        return 'truth';
      case 'FALSE':
        return 'lie';
      case 'PARTIALLY_TRUE':
      case 'MISLEADING':
      case 'UNVERIFIABLE':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return {
    id: `timestamp-${timestamp.startTime}-${index}`,
    claim: timestamp.statement,
    type: getTypeFromStatus(timestamp.factCheck?.status),
    confidence: typeof timestamp.factCheck?.confidence === 'number' 
      ? timestamp.factCheck.confidence 
      : typeof timestamp.factCheck?.confidence === 'string'
        ? parseInt(timestamp.factCheck.confidence) || 85
        : 85,
    timestamp: timestamp.startTime,
    duration: timestamp.endTime - timestamp.startTime,
    endTime: timestamp.endTime,
    category: timestamp.category,
    factCheck: timestamp.factCheck,
  };
};
