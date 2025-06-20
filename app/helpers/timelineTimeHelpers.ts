import { SegmentInterface } from "../components/video/timeline/PlayerTimeline";
import { getSegmentTypeFromCategory } from "./playerHelp";

export const convertTimestampsToSegments = (timestamps: any[]): SegmentInterface[] => {
  if (!Array.isArray(timestamps)) {
    console.warn('convertTimestampsToSegments: timestamps is not an array', timestamps);
    return [];
  }

  const usedIds = new Set<string>();
  
  return timestamps
    .filter((timestamp, index) => {
      if (!timestamp || typeof timestamp !== 'object') {
        console.warn(`Invalid timestamp at index ${index}:`, timestamp);
        return false;
      }

      const hasOldFormat = typeof timestamp.time_from_seconds === 'number' && typeof timestamp.time_to_seconds === 'number';
      const hasNewFormat = typeof timestamp.startTime === 'number' && typeof timestamp.endTime === 'number';
      
      if (!hasOldFormat && !hasNewFormat) {
        console.warn(`Missing or invalid time fields in timestamp at index ${index}:`, timestamp);
        return false;
      }

      const hasStatement = timestamp.statement || timestamp.claim;
      if (!hasStatement || typeof hasStatement !== 'string') {
        console.warn(`Missing or invalid statement in timestamp at index ${index}:`, timestamp);
        return false;
      }

      return true;
    })
    .map((timestamp, index) => {
      const startTime = timestamp.time_from_seconds ?? timestamp.startTime;
      const endTime = timestamp.time_to_seconds ?? timestamp.endTime;
      const statement = timestamp.statement || timestamp.claim || '';
      
      let baseId = timestamp.id || `${startTime}-${endTime}`;
      let uniqueId = baseId;
      let counter = 1;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${baseId}-${counter}`;
        counter++;
      }
      usedIds.add(uniqueId);

      const duration = Math.max(0, endTime - startTime);
      
      return {
        id: uniqueId,
        timestamp: startTime,
        duration: duration,
        type: getSegmentTypeFromCategory(timestamp.category),
        claim: statement,
        confidence: timestamp.confidence_score || timestamp.confidence || 0
      };
    });
};

export const calculateFactCheckStats = (timestamps: any[]) => {
  if (!Array.isArray(timestamps) || timestamps.length === 0) {
    console.warn('calculateFactCheckStats: Invalid or empty timestamps array');
    return {
      truthPercentage: 0,
      neutralPercentage: 0,
      misleadingPercentage: 0,
      confidence: 0,
      sources: 0
    };
  }

  try {
    const validTimestamps = timestamps.filter(t => t && typeof t === 'object');
    const totalStatements = validTimestamps.length;
    
    if (totalStatements === 0) {
      return {
        truthPercentage: 0,
        neutralPercentage: 0,
        misleadingPercentage: 0,
        confidence: 0,
        sources: 0
      };
    }

    const truthfulStatements = validTimestamps.filter(t =>
      getSegmentTypeFromCategory(t.category) === 'truth'
    ).length;
    
    const neutralStatements = validTimestamps.filter(t =>
      getSegmentTypeFromCategory(t.category) === 'neutral'
    ).length;
    
    const misleadingStatements = validTimestamps.filter(t =>
      getSegmentTypeFromCategory(t.category) === 'lie'
    ).length;

    const confidenceScores = validTimestamps
      .map(t => t.confidence_score || t.confidence)
      .filter(score => typeof score === 'number' && !isNaN(score));
    
    const averageConfidence = confidenceScores.length > 0
      ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
      : 0;

    const uniqueSources = new Set(
      validTimestamps
        .map(t => t.research_id)
        .filter(Boolean)
    ).size;

    return {
      truthPercentage: Math.round((truthfulStatements / totalStatements) * 100),
      neutralPercentage: Math.round((neutralStatements / totalStatements) * 100),
      misleadingPercentage: Math.round((misleadingStatements / totalStatements) * 100),
      confidence: Math.round(averageConfidence * 100),
      sources: uniqueSources
    };
  } catch (error) {
    console.error('Error calculating fact check stats:', error);
    return {
      truthPercentage: 0,
      neutralPercentage: 0,
      misleadingPercentage: 0,
      confidence: 0,
      sources: 0
    };
  }
};