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

export const MOCK_SPEAKERS: Speaker[] = [
  {
    id: '1',
    name: 'Alexandra Richardson',
    title: 'Senator',
    party: 'Progressive Alliance',
    avatarUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
    verified: true,
    totalStatements: 247,
    overallTruthRating: 78,
    reliabilityScore: 82,
    trending: 'up',
    bio: 'Senior Senator with 12 years of public service, focusing on healthcare reform and environmental policy.',
    socialMedia: {
      twitter: '@AlexRichardsonSen',
      facebook: 'SenatorRichardson',
    },
    stats: {
      truthfulStatements: 192,
      misleadingStatements: 38,
      falseStatements: 17,
      averageConfidence: 85,
    },
    monthlyData: [
      { month: 'Jan', truthful: 12, misleading: 3, false: 1, total: 16 },
      { month: 'Feb', truthful: 15, misleading: 2, false: 2, total: 19 },
      { month: 'Mar', truthful: 18, misleading: 4, false: 1, total: 23 },
      { month: 'Apr', truthful: 14, misleading: 5, false: 3, total: 22 },
      { month: 'May', truthful: 20, misleading: 3, false: 2, total: 25 },
      { month: 'Jun', truthful: 16, misleading: 4, false: 1, total: 21 },
    ],
    topicBreakdown: [
      { topic: 'Healthcare', count: 78, truthRate: 85, color: '#10b981' },
      { topic: 'Environment', count: 56, truthRate: 82, color: '#3b82f6' },
      { topic: 'Economy', count: 42, truthRate: 71, color: '#f59e0b' },
      { topic: 'Education', count: 35, truthRate: 89, color: '#8b5cf6' },
      { topic: 'Foreign Policy', count: 36, truthRate: 67, color: '#ef4444' },
    ],
    recentStatements: [
      {
        id: '1',
        content: 'The new healthcare bill will reduce prescription costs by 40% for seniors.',
        date: '2024-05-28',
        evaluation: 'Fact',
        confidence: 92,
        topic: 'Healthcare',
        sources: 8,
      },
      {
        id: '2',
        content: 'Our renewable energy investments have created 50,000 new jobs this year.',
        date: '2024-05-25',
        evaluation: 'Mislead',
        confidence: 76,
        topic: 'Environment',
        sources: 5,
      },
      {
        id: '3',
        content: 'Education funding in our state has increased by 25% under current policies.',
        date: '2024-05-22',
        evaluation: 'Fact',
        confidence: 88,
        topic: 'Education',
        sources: 6,
      },
    ],
  },
  {
    id: '2',
    name: 'Marcus Thompson',
    title: 'Governor',
    party: 'Conservative Union',
    avatarUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
    verified: true,
    totalStatements: 189,
    overallTruthRating: 65,
    reliabilityScore: 68,
    trending: 'down',
    bio: 'Current Governor in second term, known for fiscal conservatism and business-friendly policies.',
    socialMedia: {
      twitter: '@GovThompson',
      facebook: 'GovernorThompson',
      instagram: 'gov_thompson',
    },
    stats: {
      truthfulStatements: 123,
      misleadingStatements: 45,
      falseStatements: 21,
      averageConfidence: 79,
    },
    monthlyData: [
      { month: 'Jan', truthful: 8, misleading: 6, false: 2, total: 16 },
      { month: 'Feb', truthful: 10, misleading: 5, false: 3, total: 18 },
      { month: 'Mar', truthful: 12, misleading: 7, false: 2, total: 21 },
      { month: 'Apr', truthful: 9, misleading: 8, false: 4, total: 21 },
      { month: 'May', truthful: 11, misleading: 6, false: 3, total: 20 },
      { month: 'Jun', truthful: 13, misleading: 5, false: 2, total: 20 },
    ],
    topicBreakdown: [
      { topic: 'Economy', count: 67, truthRate: 72, color: '#f59e0b' },
      { topic: 'Taxes', count: 45, truthRate: 58, color: '#ef4444' },
      { topic: 'Healthcare', count: 32, truthRate: 63, color: '#10b981' },
      { topic: 'Infrastructure', count: 28, truthRate: 71, color: '#6b7280' },
      { topic: 'Crime', count: 17, truthRate: 65, color: '#dc2626' },
    ],
    recentStatements: [
      {
        id: '4',
        content: 'Our state has the lowest unemployment rate in the region.',
        date: '2024-05-29',
        evaluation: 'Fact',
        confidence: 91,
        topic: 'Economy',
        sources: 7,
      },
      {
        id: '5',
        content: 'Tax cuts have saved the average family $2,500 per year.',
        date: '2024-05-26',
        evaluation: 'Mislead',
        confidence: 72,
        topic: 'Taxes',
        sources: 4,
      },
      {
        id: '6',
        content: 'Crime rates have dropped 30% since implementing new policies.',
        date: '2024-05-23',
        evaluation: 'Lie',
        confidence: 85,
        topic: 'Crime',
        sources: 3,
      },
    ],
  },
  {
    id: '3',
    name: 'Dr. Sarah Chen',
    title: 'Secretary of Health',
    avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    verified: true,
    totalStatements: 156,
    overallTruthRating: 91,
    reliabilityScore: 94,
    trending: 'stable',
    bio: 'Former medical researcher and current Secretary of Health, specializing in public health policy.',
    socialMedia: {
      twitter: '@DrSarahChen',
    },
    stats: {
      truthfulStatements: 142,
      misleadingStatements: 11,
      falseStatements: 3,
      averageConfidence: 93,
    },
    monthlyData: [
      { month: 'Jan', truthful: 18, misleading: 2, false: 0, total: 20 },
      { month: 'Feb', truthful: 22, misleading: 1, false: 1, total: 24 },
      { month: 'Mar', truthful: 19, misleading: 2, false: 0, total: 21 },
      { month: 'Apr', truthful: 25, misleading: 3, false: 1, total: 29 },
      { month: 'May', truthful: 21, misleading: 2, false: 0, total: 23 },
      { month: 'Jun', truthful: 24, misleading: 1, false: 1, total: 26 },
    ],
    topicBreakdown: [
      { topic: 'Public Health', count: 89, truthRate: 95, color: '#10b981' },
      { topic: 'Medical Research', count: 34, truthRate: 97, color: '#3b82f6' },
      { topic: 'Healthcare Policy', count: 21, truthRate: 86, color: '#8b5cf6' },
      { topic: 'Drug Safety', count: 12, truthRate: 92, color: '#06b6d4' },
    ],
    recentStatements: [
      {
        id: '7',
        content: 'Vaccination rates have prevented an estimated 200,000 hospitalizations.',
        date: '2024-05-30',
        evaluation: 'Fact',
        confidence: 96,
        topic: 'Public Health',
        sources: 12,
      },
      {
        id: '8',
        content: 'New drug approval process has been streamlined by 40% while maintaining safety.',
        date: '2024-05-27',
        evaluation: 'Fact',
        confidence: 89,
        topic: 'Drug Safety',
        sources: 9,
      },
    ],
  },
];