import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface FilterState {
  selectedCategories: string[];
  selectedCountry: string;
  searchText: string;
  statusFilter: string;
  sourceFilter: string;
  dateRange: [Date?, Date?];
  isFilterPanelOpen: boolean;
  showBreakingOnly: boolean;
  showFactCheckedOnly: boolean;
  selectedTopicId: string | null; 
}

interface FilterActions {
  setSelectedCategories: (categories: string[]) => void;
  toggleCategory: (categoryId: string) => void;
  clearCategories: () => void;
  setSelectedCountry: (country: string) => void;
  setSearchText: (text: string) => void;
  setStatusFilter: (status: string) => void;
  setSourceFilter: (source: string) => void;
  setDateRange: (range: [Date?, Date?]) => void;
  setFilterPanelOpen: (open: boolean) => void;
  setShowBreakingOnly: (show: boolean) => void;
  setShowFactCheckedOnly: (show: boolean) => void;
  setSelectedTopicId: (topicId: string | null) => void; 
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
    topicFilter?: string; 
  };
}

type FilterStore = FilterState & FilterActions;

const initialState: FilterState = {
  selectedCategories: [],
  selectedCountry: 'worldwide',
  searchText: '',
  statusFilter: 'all',
  sourceFilter: 'all',
  dateRange: [undefined, undefined],
  isFilterPanelOpen: false,
  showBreakingOnly: false,
  showFactCheckedOnly: false,
  selectedTopicId: null, 
};

export const useFilterStore = create<FilterStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setSelectedCategories: (categories) =>
          set({ selectedCategories: categories }, false, 'setSelectedCategories'),

        toggleCategory: (categoryId) =>
          set((state) => ({
            selectedCategories: state.selectedCategories.includes(categoryId)
              ? state.selectedCategories.filter(id => id !== categoryId)
              : [...state.selectedCategories, categoryId]
          }), false, 'toggleCategory'),

        clearCategories: () =>
          set({ selectedCategories: [] }, false, 'clearCategories'),

        setSelectedCountry: (country) => {
          console.log(`🔄 Filter store: Setting country to ${country}`);
          set({ selectedCountry: country }, false, 'setSelectedCountry');
        },

        setSearchText: (text) =>
          set({ searchText: text }, false, 'setSearchText'),

        setStatusFilter: (status) =>
          set({ statusFilter: status }, false, 'setStatusFilter'),

        setSourceFilter: (source) =>
          set({ sourceFilter: source }, false, 'setSourceFilter'),

        setDateRange: (range) =>
          set({ dateRange: range }, false, 'setDateRange'),

        setFilterPanelOpen: (open) =>
          set({ isFilterPanelOpen: open }, false, 'setFilterPanelOpen'),

        setShowBreakingOnly: (show) =>
          set({ showBreakingOnly: show }, false, 'setShowBreakingOnly'),

        setShowFactCheckedOnly: (show) =>
          set({ showFactCheckedOnly: show }, false, 'setShowFactCheckedOnly'),

        setSelectedTopicId: (topicId) => {
          console.log(`🔄 Filter store: Setting topic to ${topicId}`);
          set({ selectedTopicId: topicId }, false, 'setSelectedTopicId');
        },

        resetAllFilters: () =>
          set({
            ...initialState,
            isFilterPanelOpen: get().isFilterPanelOpen,
          }, false, 'resetAllFilters'),

        getActiveFiltersCount: () => {
          const state = get();
          let count = 0;
          
          if (state.selectedCategories.length > 0) count++;
          if (state.selectedCountry !== 'worldwide') count++;
          if (state.searchText.trim()) count++;
          if (state.statusFilter !== 'all') count++;
          if (state.sourceFilter !== 'all') count++;
          if (state.showBreakingOnly) count++;
          if (state.showFactCheckedOnly) count++;
          if (state.selectedTopicId) count++; 
          
          return count;
        },

        getNewsFilters: () => {
          const state = get();
          
          const filters: {
            categoryFilter?: string;
            countryFilter?: string;
            searchText?: string;
            statusFilter?: string;
            sourceFilter?: string;
            breaking?: boolean;
            onlyFactChecked?: boolean;
            topicFilter?: string;
          } = {};
          
          if (state.selectedCategories.length > 0) {
            filters.categoryFilter = state.selectedCategories[0];
          }
          
          if (state.selectedCountry !== 'worldwide') {
            filters.countryFilter = state.selectedCountry;
          }
          
          if (state.searchText.trim()) {
            filters.searchText = state.searchText.trim();
          }
          
          if (state.statusFilter !== 'all') {
            filters.statusFilter = state.statusFilter;
          }
          
          if (state.sourceFilter !== 'all') {
            filters.sourceFilter = state.sourceFilter;
          }
          
          if (state.showBreakingOnly) {
            filters.breaking = true;
          }
          
          if (state.showFactCheckedOnly) {
            filters.onlyFactChecked = true;
          }
          
          if (state.selectedTopicId) {
            filters.topicFilter = state.selectedTopicId;
          }
          
          return filters;
        },
      }),
      {
        name: 'news-filters',
        partialize: (state) => ({
          selectedCategories: state.selectedCategories,
          selectedCountry: state.selectedCountry,
          showFactCheckedOnly: state.showFactCheckedOnly,
          selectedTopicId: state.selectedTopicId, 
        }),
      }
    ),
    { name: 'FilterStore' }
  )
);

export const useSelectedCategories = () => useFilterStore(state => state.selectedCategories);
export const useSelectedCountry = () => useFilterStore(state => state.selectedCountry);
export const useSearchText = () => useFilterStore(state => state.searchText);
export const useActiveFiltersCount = () => useFilterStore(state => state.getActiveFiltersCount());
export const useNewsFilters = () => useFilterStore(state => state.getNewsFilters());
export const useSelectedTopicId = () => useFilterStore(state => state.selectedTopicId);