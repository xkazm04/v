import { ResearchResult, NewsArticle, convertResearchToNews } from '@/app/types/article';
import mockData from '@/app/data/mock-research-results.json';

export interface MockDataFilters {
  limit?: number;
  offset?: number;
  status?: string;
  category?: string;
  country?: string;
  source?: string;
  search?: string;
}

export class MockDataService {
  private static data: ResearchResult[] = mockData as ResearchResult[];

  // Check if we're in offline mode (can be toggled for demo)
  static isOfflineMode(): boolean {
    // Check localStorage for demo toggle
    if (typeof window !== 'undefined') {
      return localStorage.getItem('demo-offline-mode') === 'true';
    }
    return false;
  }

  // Toggle offline mode for demo purposes
  static toggleOfflineMode(): boolean {
    if (typeof window !== 'undefined') {
      const currentMode = localStorage.getItem('demo-offline-mode') === 'true';
      const newMode = !currentMode;
      localStorage.setItem('demo-offline-mode', String(newMode));
      return newMode;
    }
    return false;
  }

  // Get mock news articles with filtering
  static getMockNews(filters: MockDataFilters = {}): NewsArticle[] {
    let filteredData = [...this.data];

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      filteredData = filteredData.filter(item => 
        item.status?.toLowerCase() === filters.status?.toLowerCase()
      );
    }

    if (filters.category && filters.category !== 'all') {
      filteredData = filteredData.filter(item => 
        item.category?.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    if (filters.country && filters.country !== 'all' && filters.country !== 'worldwide') {
      filteredData = filteredData.filter(item => 
        item.country?.toLowerCase() === filters.country?.toLowerCase()
      );
    }

    if (filters.source && filters.source !== 'all') {
      filteredData = filteredData.filter(item => 
        item.source?.toLowerCase().includes(filters.source?.toLowerCase() || '')
      );
    }

    if (filters.search?.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filteredData = filteredData.filter(item => 
        item.statement?.toLowerCase().includes(searchTerm) ||
        item.source?.toLowerCase().includes(searchTerm) ||
        item.context?.toLowerCase().includes(searchTerm) ||
        item.verdict?.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by processed_at (newest first)
    filteredData.sort((a, b) => 
      new Date(b.processed_at || 0).getTime() - new Date(a.processed_at || 0).getTime()
    );

    // Apply pagination
    const offset = filters.offset || 0;
    const limit = filters.limit || 20;
    const paginatedData = filteredData.slice(offset, offset + limit);

    // Convert to NewsArticle format
    return paginatedData.map(item => convertResearchToNews(item));
  }

  // Get mock categories with counts
  static getMockCategories(): Record<string, number> {
    const categories: Record<string, number> = {};
    
    this.data.forEach(item => {
      const category = item.category || 'other';
      categories[category] = (categories[category] || 0) + 1;
    });

    return categories;
  }

  // Get mock countries with counts
  static getMockCountries(): Record<string, number> {
    const countries: Record<string, number> = {};
    
    this.data.forEach(item => {
      const country = item.country || 'unknown';
      countries[country] = (countries[country] || 0) + 1;
    });

    return countries;
  }

  // Get mock article by ID
  static getMockArticleById(id: string): NewsArticle | null {
    const item = this.data.find(item => item.id === id);
    return item ? convertResearchToNews(item) : null;
  }

  // Simulate network delay for realistic demo
  static async simulateNetworkDelay<T>(data: T, delay: number = 800): Promise<T> {
    await new Promise(resolve => setTimeout(resolve, delay));
    return data;
  }

  // Generate additional mock data for infinite scroll
  static generateMoreMockData(baseCount: number = 10): ResearchResult[] {
    const templates = this.data;
    const additionalData: ResearchResult[] = [];

    for (let i = 0; i < baseCount; i++) {
      const template = templates[i % templates.length];
      const newId = `mock-${Date.now()}-${i}`;
      
      additionalData.push({
        ...template,
        id: newId,
        statement: `${template.statement} (Generated example ${i + 1})`,
        processed_at: new Date(Date.now() - i * 86400000).toISOString(), // Spread over days
        created_at: new Date(Date.now() - i * 86400000).toISOString(),
        updated_at: new Date(Date.now() - i * 86400000).toISOString(),
      });
    }

    return additionalData;
  }
}

// Demo utilities for development
export const demoUtils = {
  enableOfflineMode: () => MockDataService.toggleOfflineMode(),
  disableOfflineMode: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo-offline-mode', 'false');
    }
  },
  isOffline: () => MockDataService.isOfflineMode(),
  
  // Add demo data indicator
  addDemoIndicator: () => {
    if (typeof window !== 'undefined' && MockDataService.isOfflineMode()) {
      const indicator = document.createElement('div');
      indicator.id = 'demo-mode-indicator';
      indicator.innerHTML = '🔄 DEMO MODE - Using offline data';
      indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #f59e0b;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      
      // Remove existing indicator if present
      const existing = document.getElementById('demo-mode-indicator');
      if (existing) existing.remove();
      
      document.body.appendChild(indicator);
    }
  },

  removeDemoIndicator: () => {
    if (typeof window !== 'undefined') {
      const indicator = document.getElementById('demo-mode-indicator');
      if (indicator) indicator.remove();
    }
  }
};