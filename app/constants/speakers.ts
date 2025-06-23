export interface Speaker {
  id: string;
  name: string;
  title: string;
  party?: string;
  avatarUrl: string;
  verified: boolean;
  totalStatements: number;
  overallTruthRating: number;
  reliabilityScore: number;
  trending: 'up' | 'down' | 'stable';
  bio: string;
  socialMedia: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  stats: {
    truthfulStatements: number;
    misleadingStatements: number;
    falseStatements: number;
    averageConfidence: number;
  };
  monthlyData: Array<{
    month: string;
    truthful: number;
    misleading: number;
    false: number;
    total: number;
  }>;
  topicBreakdown: Array<{
    topic: string;
    count: number;
    truthRate: number;
    color: string;
  }>;
  recentStatements: Array<{
    id: string;
    content: string;
    date: string;
    evaluation: 'Fact' | 'Mislead' | 'Lie';
    confidence: number;
    topic: string;
    sources: number;
  }>;
}
