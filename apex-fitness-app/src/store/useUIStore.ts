import { create } from 'zustand';

interface UIState {
  // Sidebar state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;

  // Loading state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Toast/notification state
  toast: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),

  // Loading
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // Toast
  toast: null,
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}));
