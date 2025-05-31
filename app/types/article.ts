export type NewsArticle = {
  id: string;
  headline: string;
  source: {
    name: string;
    logoUrl?: string;
  };
  category: string;
  datePublished: string;
  truthScore: number; // 0 to 1
  isBreaking: boolean;
  publishedAt: string;
  factCheck: {
    evaluation: string; // e.g., "True", "Mostly True", "Mixed", "Mostly False", "False"
    confidence: number; // Percentage as a number (0-100)
  };
  citation: string; 
  summary: string;
};

export const mockedArticles: NewsArticle[] = [
  {
    id: "1",
    headline: "Breaking News: Major Event Unfolds",
    source: { name: "News Source 1", logoUrl: "https://example.com/logo1.png" },
    category: "World",
    datePublished: new Date().toISOString(),
    truthScore: 0.95,
    isBreaking: true,
    publishedAt: new Date().toISOString(),
    factCheck: {
      evaluation: "True",
      confidence: 100
    },
    citation: "Source citation details here",
    summary: "A major event has just occurred, shaking the foundations of our understanding."
  },
  {
    id: "2",
    headline: "Technology Advances in 2023",
    source: { name: "Tech News", logoUrl: "https://example.com/logo2.png" },
    category: "Technology",
    datePublished: new Date().toISOString(),
    truthScore: 0.85,
    isBreaking: false,
    publishedAt: new Date().toISOString(),
    factCheck: {
      evaluation: "Mostly True",
      confidence: 90
    },
    citation: "Source citation details here",
    summary: "This year has seen significant advancements in technology, changing how we live and work."
  },
    {
    id: "3",
    headline: "Breaking News: Major Event Unfolds",
    source: { name: "News Source 1", logoUrl: "https://example.com/logo1.png" },
    category: "World",
    datePublished: new Date().toISOString(),
    truthScore: 0.95,
    isBreaking: true,
    publishedAt: new Date().toISOString(),
    factCheck: {
      evaluation: "True",
      confidence: 100
    },
    citation: "Source citation details here",
    summary: "A major event has just occurred, shaking the foundations of our understanding."
  },
  {
    id: "4",
    headline: "Technology Advances in 2023",
    source: { name: "Tech News", logoUrl: "https://example.com/logo2.png" },
    category: "Technology",
    datePublished: new Date().toISOString(),
    truthScore: 0.85,
    isBreaking: false,
    publishedAt: new Date().toISOString(),
    factCheck: {
      evaluation: "Mostly True",
      confidence: 90
    },
    citation: "Source citation details here",
    summary: "This year has seen significant advancements in technology, changing how we live and work."
  },
    {
    id: "5",
    headline: "Breaking News: Major Event Unfolds",
    source: { name: "News Source 1", logoUrl: "https://example.com/logo1.png" },
    category: "World",
    datePublished: new Date().toISOString(),
    truthScore: 0.95,
    isBreaking: true,
    publishedAt: new Date().toISOString(),
    factCheck: {
      evaluation: "True",
      confidence: 100
    },
    citation: "Source citation details here",
    summary: "A major event has just occurred, shaking the foundations of our understanding."
  },
  {
    id: "6",
    headline: "Technology Advances in 2023",
    source: { name: "Tech News", logoUrl: "https://example.com/logo2.png" },
    category: "Technology",
    datePublished: new Date().toISOString(),
    truthScore: 0.85,
    isBreaking: false,
    publishedAt: new Date().toISOString(),
    factCheck: {
      evaluation: "Mostly True",
      confidence: 90
    },
    citation: "Source citation details here",
    summary: "This year has seen significant advancements in technology, changing how we live and work."
  },
    {
    id: "7",
    headline: "Breaking News: Major Event Unfolds",
    source: { name: "News Source 1", logoUrl: "https://example.com/logo1.png" },
    category: "World",
    datePublished: new Date().toISOString(),
    truthScore: 0.95,
    isBreaking: true,
    publishedAt: new Date().toISOString(),
    factCheck: {
      evaluation: "True",
      confidence: 100
    },
    citation: "Source citation details here",
    summary: "A major event has just occurred, shaking the foundations of our understanding."
  },
  {
    id: "8",
    headline: "Technology Advances in 2023",
    source: { name: "Tech News", logoUrl: "https://example.com/logo2.png" },
    category: "Technology",
    datePublished: new Date().toISOString(),
    truthScore: 0.85,
    isBreaking: false,
    publishedAt: new Date().toISOString(),
    factCheck: {
      evaluation: "Mostly True",
      confidence: 90
    },
    citation: "Source citation details here",
    summary: "This year has seen significant advancements in technology, changing how we live and work."
  }
];