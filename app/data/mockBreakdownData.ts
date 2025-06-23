export interface MockBreakdownItem {
  topic: string;
  count: number;
  truthRate: number;
  color: string;
}

export const mockBreakdownData: MockBreakdownItem[] = [
  {
    topic: "Healthcare Policy",
    count: 156,
    truthRate: 78,
    color: "#3b82f6"
  },
  {
    topic: "Climate Change",
    count: 98,
    truthRate: 84,
    color: "#22c55e"
  },
  {
    topic: "Foreign Policy",
    count: 76,
    truthRate: 71,
    color: "#8b5cf6"
  },
  {
    topic: "Education",
    count: 65,
    truthRate: 88,
    color: "#06b6d4"
  },
  {
    topic: "Technology",
    count: 54,
    truthRate: 72,
    color: "#84cc16"
  },
];

export const mockStatsData = {
  totalStatements: mockBreakdownData.reduce((sum, item) => sum + item.count, 0),
  avgTruthRate: Math.round(
    mockBreakdownData.reduce((sum, item) => sum + item.truthRate, 0) / mockBreakdownData.length
  ),
  maxCount: Math.max(...mockBreakdownData.map(item => item.count)),
  categoriesCount: mockBreakdownData.length
};