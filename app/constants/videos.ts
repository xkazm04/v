import { VideoMetadata, VideoCategory } from '@/app/types/video';

export const VIDEO_CATEGORIES: VideoCategory[] = [
  'All',
  'Technology',
  'Science',
  'Education',
  'News',
];

export const MOCK_VIDEOS: VideoMetadata[] = [
  {
    id: '1',
    title: 'Climate Change: The Real Data Behind Global Warming',
    description: 'An analysis of scientific data and claims about climate change, examining evidence from multiple research institutions.',
    thumbnailUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    videoUrl: 'https://example.com/videos/climate-data.mp4',
    duration: 985,
    views: 1254789,
    likes: 87420,
    uploadDate: '2023-07-15',
    channelName: 'ScienceCheck',
    category: 'Science',
    tags: ['climate', 'science', 'data', 'environment'],
    factCheck: {
      evaluation: 'Fact',
      truthPercentage: 85,
      neutralPercentage: 10,
      misleadingPercentage: 5,
      totalClaims: 12,
      verifiedClaims: 10,
      sources: 15,
      confidence: 92
    }
  },
  {
    id: '2',
    title: 'Vaccine Safety: Separating Myths from Facts',
    description: 'A comprehensive review of vaccine safety data and addressing common misconceptions.',
    thumbnailUrl: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
    videoUrl: 'https://example.com/videos/vaccine-facts.mp4',
    duration: 1247,
    views: 987654,
    likes: 65432,
    uploadDate: '2023-08-22',
    channelName: 'MedFacts',
    category: 'Science',
    tags: ['vaccine', 'health', 'medicine', 'safety'],
    factCheck: {
      evaluation: 'Fact',
      truthPercentage: 92,
      neutralPercentage: 5,
      misleadingPercentage: 3,
      totalClaims: 8,
      verifiedClaims: 7,
      sources: 22,
      confidence: 96
    }
  },
  {
    id: '3',
    title: 'Economic Crisis Predictions: What the Data Really Shows',
    description: 'Analyzing economic predictions and their accuracy based on historical data and current trends.',
    thumbnailUrl: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg',
    videoUrl: 'https://example.com/videos/economic-analysis.mp4',
    duration: 1800,
    views: 456789,
    likes: 34567,
    uploadDate: '2023-09-10',
    channelName: 'EconVerify',
    category: 'News',
    tags: ['economics', 'predictions', 'analysis', 'finance'],
    factCheck: {
      evaluation: 'Mislead',
      truthPercentage: 45,
      neutralPercentage: 30,
      misleadingPercentage: 25,
      totalClaims: 15,
      verifiedClaims: 7,
      sources: 8,
      confidence: 67
    }
  },
  {
    id: '4',
    title: 'AI Will Replace All Jobs: Tech Industry Claims',
    description: 'Examining claims about AI job displacement and what employment data actually reveals.',
    thumbnailUrl: 'https://images.pexels.com/photos/6068953/pexels-photo-6068953.jpeg',
    videoUrl: 'https://example.com/videos/ai-jobs.mp4',
    duration: 1456,
    views: 789123,
    likes: 45678,
    uploadDate: '2023-10-05',
    channelName: 'TechTruth',
    category: 'Technology',
    tags: ['AI', 'jobs', 'employment', 'technology'],
    factCheck: {
      evaluation: 'Mislead',
      truthPercentage: 35,
      neutralPercentage: 40,
      misleadingPercentage: 25,
      totalClaims: 10,
      verifiedClaims: 4,
      sources: 6,
      confidence: 58
    }
  },
  {
    id: '5',
    title: 'Election Fraud Claims: Investigation Results',
    description: 'A fact-based analysis of election security and fraud claims with official investigation findings.',
    thumbnailUrl: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg',
    videoUrl: 'https://example.com/videos/election-facts.mp4',
    duration: 2145,
    views: 1567890,
    likes: 89456,
    uploadDate: '2023-11-12',
    channelName: 'ElectionWatch',
    category: 'News',
    tags: ['election', 'security', 'investigation', 'democracy'],
    factCheck: {
      evaluation: 'Lie',
      truthPercentage: 15,
      neutralPercentage: 20,
      misleadingPercentage: 65,
      totalClaims: 18,
      verifiedClaims: 3,
      sources: 4,
      confidence: 89
    }
  },
  {
    id: '6',
    title: 'Renewable Energy Efficiency: Real World Data',
    description: 'Analyzing renewable energy claims against actual performance data from global installations.',
    thumbnailUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    videoUrl: 'https://example.com/videos/renewable-energy.mp4',
    duration: 1678,
    views: 678901,
    likes: 56789,
    uploadDate: '2023-06-18',
    channelName: 'EnergyFacts',
    category: 'Science',
    tags: ['renewable', 'energy', 'efficiency', 'environment'],
    factCheck: {
      evaluation: 'Fact',
      truthPercentage: 88,
      neutralPercentage: 8,
      misleadingPercentage: 4,
      totalClaims: 14,
      verifiedClaims: 12,
      sources: 18,
      confidence: 91
    }
  }
];