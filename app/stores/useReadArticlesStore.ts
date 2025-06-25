'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReadArticlesState {
  readArticleIds: Set<string>;
  addReadArticle: (articleId: string) => void;
  clearReadArticles: () => void;
  isArticleRead: (articleId: string) => boolean;
  getExcludeIds: () => string[];
}

export const useReadArticlesStore = create<ReadArticlesState>()(
  persist(
    (set, get) => ({
      readArticleIds: new Set<string>(),
      
      addReadArticle: (articleId: string) => {
        set((state) => ({
          readArticleIds: new Set([...Array.from(state.readArticleIds), articleId])
        }));
        console.log(`📖 Added article to read list: ${articleId}`);
      },
      
      clearReadArticles: () => {
        set({ readArticleIds: new Set() });
        console.log('🗑️ Cleared all read articles');
      },
      
      isArticleRead: (articleId: string) => {
        return get().readArticleIds.has(articleId);
      },
      
      getExcludeIds: () => {
        return Array.from(get().readArticleIds);
      }
    }),
    {
      name: 'read-articles-storage',
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
            // Convert Set to array for serialization
            const serializable = {
              ...value,
              state: {
                ...value.state,
                readArticleIds: Array.from(value.state.readArticleIds)
              }
            };
            localStorage.setItem(name, JSON.stringify(serializable));
          } catch (error) {
            console.warn('Failed to save read articles to localStorage:', error);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);