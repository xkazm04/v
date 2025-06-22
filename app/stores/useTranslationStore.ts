import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface TranslationTask {
  id: string;
  text: string; // First 50 chars for identification
  sourceLocale: string;
  targetLocale: string;
  context?: 'news' | 'timeline' | 'expert-opinion';
  status: 'pending' | 'translating' | 'completed' | 'failed' | 'cached';
  startTime: number;
  endTime?: number;
  error?: string;
}

interface TranslationStoreState {
  // Current translation tasks
  activeTasks: TranslationTask[];
  
  // Statistics
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  cachedTasks: number;
  
  // UI State
  isVisible: boolean;
  lastActivity: number;
  
  // Actions
  startTranslation: (task: Omit<TranslationTask, 'id' | 'status' | 'startTime'>) => string;
  updateTaskStatus: (taskId: string, status: TranslationTask['status'], error?: string) => void;
  completeTranslation: (taskId: string, wasCached?: boolean) => void;
  failTranslation: (taskId: string, error: string) => void;
  clearCompletedTasks: () => void;
  hideIndicator: () => void;
  showIndicator: () => void;
  resetStats: () => void;
}

export const useTranslationStore = create<TranslationStoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      activeTasks: [],
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      cachedTasks: 0,
      isVisible: false,
      lastActivity: Date.now(),

      // Start a new translation task
      startTranslation: (task) => {
        console.log(`Starting translation task`);
        const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newTask: TranslationTask = {
          ...task,
          id: taskId,
          status: 'pending',
          startTime: Date.now(),
          text: task.text.slice(0, 50) + (task.text.length > 50 ? '...' : '')   
        };

        set((state) => ({
          activeTasks: [...state.activeTasks, newTask],
          totalTasks: state.totalTasks + 1,
          isVisible: true,
          lastActivity: Date.now()
        }), false, 'startTranslation');

        return taskId;
      },

      // Update task status
      updateTaskStatus: (taskId, status, error) => {
        set((state) => ({
          activeTasks: state.activeTasks.map(task =>
            task.id === taskId
              ? { ...task, status, error, ...(status === 'translating' ? {} : { endTime: Date.now() }) }
              : task
          ),
          lastActivity: Date.now()
        }), false, 'updateTaskStatus');
      },

      // Complete a translation
      completeTranslation: (taskId, wasCached = false) => {
        console.log(`Complete translation task`);
        set((state) => {
          const updatedTasks = state.activeTasks.map(task =>
            task.id === taskId
              ? { ...task, status: wasCached ? 'cached' : 'completed' as const, endTime: Date.now() }
              : task
          );

          return {
            activeTasks: updatedTasks,
            completedTasks: state.completedTasks + 1,
            cachedTasks: wasCached ? state.cachedTasks + 1 : state.cachedTasks,
            lastActivity: Date.now()
          };
        }, false, 'completeTranslation');

        // Auto-hide after delay if no active translations
        setTimeout(() => {
          const { activeTasks } = get();
          const hasActiveTranslations = activeTasks.some(
            task => task.status === 'pending' || task.status === 'translating'
          );
          
          if (!hasActiveTranslations) {
            get().hideIndicator();
          }
        }, 2000);
      },

      // Fail a translation
      failTranslation: (taskId, error) => {
        set((state) => ({
          activeTasks: state.activeTasks.map(task =>
            task.id === taskId
              ? { ...task, status: 'failed', error, endTime: Date.now() }
              : task
          ),
          failedTasks: state.failedTasks + 1,
          lastActivity: Date.now()
        }), false, 'failTranslation');
      },

      // Clear completed tasks
      clearCompletedTasks: () => {
        set((state) => ({
          activeTasks: state.activeTasks.filter(
            task => task.status === 'pending' || task.status === 'translating'
          )
        }), false, 'clearCompletedTasks');
      },

      // Hide indicator
      hideIndicator: () => {
        set({ isVisible: false }, false, 'hideIndicator');
      },

      // Show indicator
      showIndicator: () => {
        set({ isVisible: true, lastActivity: Date.now() }, false, 'showIndicator');
      },

      // Reset all stats
      resetStats: () => {
        set({
          activeTasks: [],
          totalTasks: 0,
          completedTasks: 0,
          failedTasks: 0,
          cachedTasks: 0,
          lastActivity: Date.now()
        }, false, 'resetStats');
      }
    }),
    {
      name: 'translation-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// Computed selectors
export const useTranslationProgress = () => {
  return useTranslationStore((state) => {
    const activeCount = state.activeTasks.filter(
      task => task.status === 'pending' || task.status === 'translating'
    ).length;
    
    const completedCount = state.activeTasks.filter(
      task => task.status === 'completed' || task.status === 'cached'
    ).length;

    const failedCount = state.activeTasks.filter(
      task => task.status === 'failed'
    ).length;

    const totalActive = state.activeTasks.length;
    const progress = totalActive > 0 ? ((completedCount + failedCount) / totalActive) * 100 : 0;

    return {
      activeCount,
      completedCount,
      failedCount,
      totalActive,
      progress: Math.round(progress),
      isTranslating: activeCount > 0,
      isVisible: state.isVisible && totalActive > 0
    };
  });
};

export const useTranslationStats = () => {
  return useTranslationStore((state) => ({
    totalTasks: state.totalTasks,
    completedTasks: state.completedTasks,
    failedTasks: state.failedTasks,
    cachedTasks: state.cachedTasks,
    successRate: state.totalTasks > 0 
      ? Math.round(((state.completedTasks + state.cachedTasks) / state.totalTasks) * 100)
      : 0
  }));
};