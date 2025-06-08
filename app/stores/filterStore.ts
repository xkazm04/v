import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface FilterState {
  // Category filters
  selectedCategories: string[];
  
  // Country filter
  selectedCountry: string;
  
  // Search and other filters
  searchText: string;
  statusFilter: string;
  sourceFilter: string;
  
  // Date range
  dateRange: {
    from: string | null;
    to: string | null;
  };
  
  // UI state
  isFilterPanelOpen: boolean;
  showBreakingOnly: boolean;
  showFactCheckedOnly: boolean;
}

interface FilterActions {
  // Category actions
  setSelectedCategories: (categories: string[]) => void;
  toggleCategory: (categoryId: string) => void;
  clearCategories: () => void;
  
  // Country actions
  setSelectedCountry: (country: string) => void;
  
  // Search actions
  setSearchText: (text: string) => void;
  setStatusFilter: (status: string) => void;
  setSourceFilter: (source: string) => void;
  
  // Date actions
  setDateRange: (range: { from: string | null; to: string | null }) => void;
  
  // UI actions
  setFilterPanelOpen: (open: boolean) => void;
  setShowBreakingOnly: (show: boolean) => void;
  setShowFactCheckedOnly: (show: boolean) => void;
  
  // Utility actions
  resetAllFilters: () => void;
  getActiveFiltersCount: () => number;
  getNewsFilters: () => {
    categoryFilter?: string;
    countryFilter?: string;
    searchText?: string;
    statusFilter?: string;
    sourceFilter?: string;
    breaking?: boolean;
    onlyFactChecked?: boolean;
  };
}

type FilterStore = FilterState & FilterActions;

const initialState: FilterState = {
  selectedCategories: [],
  selectedCountry: 'all',
  searchText: '',
  statusFilter: 'all',
  sourceFilter: 'all',
  dateRange: { from: null, to: null },
  isFilterPanelOpen: false,
  showBreakingOnly: false,
  showFactCheckedOnly: true,
};

export const useFilterStore = create<FilterStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Category actions
        setSelectedCategories: (categories) => {
          console.log('Setting categories:', categories);
          set({ selectedCategories: categories }, false, 'setSelectedCategories');
        },

        toggleCategory: (categoryId) =>
          set((state) => {
            const isSelected = state.selectedCategories.includes(categoryId);
            const newCategories = isSelected
              ? state.selectedCategories.filter(id => id !== categoryId)
              : [...state.selectedCategories, categoryId];
            console.log('Toggling category:', categoryId, 'new categories:', newCategories);
            return { selectedCategories: newCategories };
          }, false, 'toggleCategory'),

        clearCategories: () =>
          set({ selectedCategories: [] }, false, 'clearCategories'),

        // Country actions
        setSelectedCountry: (country) => {
          console.log('Setting country:', country);
          set({ selectedCountry: country }, false, 'setSelectedCountry');
        },

        // Search actions
        setSearchText: (text) =>
          set({ searchText: text }, false, 'setSearchText'),

        setStatusFilter: (status) =>
          set({ statusFilter: status }, false, 'setStatusFilter'),

        setSourceFilter: (source) =>
          set({ sourceFilter: source }, false, 'setSourceFilter'),

        // Date actions
        setDateRange: (range) =>
          set({ dateRange: range }, false, 'setDateRange'),

        // UI actions
        setFilterPanelOpen: (open) =>
          set({ isFilterPanelOpen: open }, false, 'setFilterPanelOpen'),

        setShowBreakingOnly: (show) =>
          set({ showBreakingOnly: show }, false, 'setShowBreakingOnly'),

        setShowFactCheckedOnly: (show) =>
          set({ showFactCheckedOnly: show }, false, 'setShowFactCheckedOnly'),

        // Utility actions
        resetAllFilters: () =>
          set({
            ...initialState,
            isFilterPanelOpen: get().isFilterPanelOpen, // Preserve UI state
          }, false, 'resetAllFilters'),

        getActiveFiltersCount: () => {
          const state = get();
          let count = 0;
          
          if (state.selectedCategories.length > 0) count++;
          if (state.selectedCountry !== 'all') count++;
          if (state.searchText.trim()) count++;
          if (state.statusFilter !== 'all') count++;
          if (state.sourceFilter !== 'all') count++;
          if (state.dateRange.from || state.dateRange.to) count++;
          if (state.showBreakingOnly) count++;
          
          return count;
        },

        getNewsFilters: () => {
          const state = get();
          const filters: any = {};

          // Add category filter (use first selected for now, can be enhanced for multiple)
          if (state.selectedCategories.length > 0) {
            filters.categoryFilter = state.selectedCategories[0];
          }

          // Add country filter
          if (state.selectedCountry !== 'all') {
            filters.countryFilter = state.selectedCountry;
          }

          // Add search text
          if (state.searchText.trim()) {
            filters.searchText = state.searchText.trim();
          }

          // Add status filter
          if (state.statusFilter !== 'all') {
            filters.statusFilter = state.statusFilter;
          }

          // Add source filter
          if (state.sourceFilter !== 'all') {
            filters.sourceFilter = state.sourceFilter;
          }

          // Add boolean filters
          filters.breaking = state.showBreakingOnly;
          filters.onlyFactChecked = state.showFactCheckedOnly;

          console.log('getNewsFilters returning:', filters);
          return filters;
        },
      }),
      {
        name: 'news-filters',
        partialize: (state) => ({
          selectedCategories: state.selectedCategories,
          selectedCountry: state.selectedCountry,
          showFactCheckedOnly: state.showFactCheckedOnly,
          // Don't persist search text and UI state
        }),
      }
    ),
    { name: 'FilterStore' }
  )
);

// Selectors for better performance
export const useSelectedCategories = () => useFilterStore(state => state.selectedCategories);
export const useSelectedCountry = () => useFilterStore(state => state.selectedCountry);
export const useSearchText = () => useFilterStore(state => state.searchText);
export const useActiveFiltersCount = () => useFilterStore(state => state.getActiveFiltersCount());
export const useNewsFilters = () => useFilterStore(state => state.getNewsFilters());