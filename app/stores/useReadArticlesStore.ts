'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResearchResult } from '@/app/types/article';

interface ReadArticlesState {
  readArticleIds: Set<string>;
  reservePool: ResearchResult[];
  reservePoolSize: number;
  lastReserveRefetch: number;
  reserveRefetchThreshold: number;
  isRefetchingReserves: boolean;
  
  // Core read article methods
  addReadArticle: (articleId: string) => void;
  clearReadArticles: () => void;
  isArticleRead: (articleId: string) => boolean;
  getExcludeIds: () => string[];
  
  // Reserve pool management
  setReservePool: (articles: ResearchResult[]) => void;
  getNextReserveArticle: () => ResearchResult | null;
  removeFromReservePool: (articleId: string) => void;
  shouldRefetchReserves: () => boolean;
  setIsRefetchingReserves: (isRefetching: boolean) => void;
  resetReserveRefetchTimer: () => void;
  
  // Smart replacement logic
  replaceArticleWithReserve: (articleId: string) => {
    replacementArticle: ResearchResult | null;
    shouldRefetchReserves: boolean;
  };
}

const RESERVE_POOL_SIZE = 15;
const REFETCH_THRESHOLD = 5; // Refetch when reserves drop below this
const REFETCH_COOLDOWN = 30000; // 30 seconds cooldown between refetches

export const useReadArticlesStore = create<ReadArticlesState>()(
  persist(
    (set, get) => ({
      readArticleIds: new Set<string>(),
      reservePool: [],
      reservePoolSize: RESERVE_POOL_SIZE,
      lastReserveRefetch: 0,
      reserveRefetchThreshold: REFETCH_THRESHOLD,
      isRefetchingReserves: false,
      
      addReadArticle: (articleId: string) => {
        set((state) => ({
          readArticleIds: new Set([...Array.from(state.readArticleIds), articleId])
        }));
        console.log(`📖 Added article to read list: ${articleId}`);
      },
      
      clearReadArticles: () => {
        set({ 
          readArticleIds: new Set(),
          reservePool: [] // Clear reserves when clearing read articles
        });
        console.log('🗑️ Cleared all read articles and reserves');
      },
      
      isArticleRead: (articleId: string) => {
        return get().readArticleIds.has(articleId);
      },
      
      getExcludeIds: () => {
        return Array.from(get().readArticleIds);
      },
      
      setReservePool: (articles: ResearchResult[]) => {
        const state = get();
        // Filter out articles that are already read or in current exclude list
        const validReserves = articles.filter(article => 
          article && 
          !state.readArticleIds.has(article.id) &&
          !state.reservePool.some(existing => existing.id === article.id)
        );
        
        set({ 
          reservePool: [...state.reservePool, ...validReserves].slice(0, RESERVE_POOL_SIZE),
          lastReserveRefetch: Date.now()
        });
        console.log(`🏊 Updated reserve pool: ${validReserves.length} new articles, total: ${Math.min(state.reservePool.length + validReserves.length, RESERVE_POOL_SIZE)}`);
      },
      
      getNextReserveArticle: () => {
        const state = get();
        if (state.reservePool.length === 0) {
          console.warn('🏊 No articles in reserve pool');
          return null;
        }
        
        // Get the first article that hasn't been read
        const nextArticle = state.reservePool.find(article => 
          !state.readArticleIds.has(article.id)
        );
        
        return nextArticle || null;
      },
      
      removeFromReservePool: (articleId: string) => {
        set((state) => ({
          reservePool: state.reservePool.filter(article => article.id !== articleId)
        }));
        console.log(`🏊 Removed article ${articleId} from reserve pool`);
      },
      
      shouldRefetchReserves: () => {
        const state = get();
        const now = Date.now();
        const timeSinceLastRefetch = now - state.lastReserveRefetch;
        const hasEnoughReserves = state.reservePool.length >= state.reserveRefetchThreshold;
        const cooldownPassed = timeSinceLastRefetch > REFETCH_COOLDOWN;
        
        return !hasEnoughReserves && cooldownPassed && !state.isRefetchingReserves;
      },
      
      setIsRefetchingReserves: (isRefetching: boolean) => {
        set({ isRefetchingReserves: isRefetching });
      },
      
      resetReserveRefetchTimer: () => {
        set({ lastReserveRefetch: Date.now() });
      },
      
      replaceArticleWithReserve: (articleId: string) => {
        const state = get();
        
        // Add to read articles
        state.addReadArticle(articleId);
        
        // Get next reserve article
        const replacementArticle = state.getNextReserveArticle();
        
        if (replacementArticle) {
          // Remove from reserve pool
          state.removeFromReservePool(replacementArticle.id);
        }
        
        // Check if we should refetch reserves
        const shouldRefetchReserves = state.shouldRefetchReserves();
        
        console.log(`🔄 Article replacement: ${articleId} -> ${replacementArticle?.id || 'none'}, refetch needed: ${shouldRefetchReserves}`);
        
        return {
          replacementArticle,
          shouldRefetchReserves
        };
      }
    }),
    {
      name: 'read-articles-storage',
      partialize: (state) => ({
        readArticleIds: Array.from(state.readArticleIds), // Convert Set to Array for persistence
        reservePool: state.reservePool.slice(0, 10), // Persist only first 10 reserves
        lastReserveRefetch: state.lastReserveRefetch
      }),
      // Custom storage implementation to handle Set serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          try {
            const parsed = JSON.parse(str);
            // Convert array back to Set
            if (parsed.state?.readArticleIds && Array.isArray(parsed.state.readArticleIds)) {
              parsed.state.readArticleIds = new Set(parsed.state.readArticleIds);
            }
            return parsed;
          } catch (error) {
            console.warn('Failed to parse read articles from localStorage:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.warn('Failed to save read articles to localStorage:', error);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);