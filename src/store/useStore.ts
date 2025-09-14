import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User, TestRecord, Product, TestItem } from '@/types';

interface AppState {
  // 用户状态
  user: User | null;
  setUser: (user: User | null) => void;

  // 测试记录状态
  testRecords: TestRecord[];
  setTestRecords: (records: TestRecord[]) => void;
  addTestRecord: (record: TestRecord) => void;
  updateTestRecord: (id: string, updates: Partial<TestRecord>) => void;
  deleteTestRecord: (id: string) => void;

  // 产品状态
  products: Product[];
  setProducts: (products: Product[]) => void;

  // 测试项目状态
  testItems: TestItem[];
  setTestItems: (items: TestItem[]) => void;

  // UI状态
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // 过滤器状态
  filters: {
    dateFrom?: string;
    dateTo?: string;
    deviceSn?: string;
    productId?: string;
    testItemId?: string;
    result?: 'PASS' | 'FAIL';
  };
  setFilters: (filters: any) => void;
  clearFilters: () => void;

  // 通知状态
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
  }>;
  addNotification: (notification: Omit<any, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;

  // 重置状态
  reset: () => void;
}

const initialState = {
  user: null,
  testRecords: [],
  products: [],
  testItems: [],
  isLoading: false,
  sidebarOpen: true,
  filters: {},
  notifications: [],
};

export const useStore = create<AppState>()(
  devtools(
    (set) => ({
      ...initialState,

      // 用户操作
      setUser: (user) => set({ user }),

      // 测试记录操作
      setTestRecords: (testRecords) => set({ testRecords }),
      
      addTestRecord: (record) =>
        set((state) => ({ testRecords: [...state.testRecords, record] })),
      
      updateTestRecord: (id, updates) =>
        set((state) => ({
          testRecords: state.testRecords.map((record) =>
            record.id === id ? { ...record, ...updates } : record
          ),
        })),
      
      deleteTestRecord: (id) =>
        set((state) => ({
          testRecords: state.testRecords.filter((record) => record.id !== id),
        })),

      // 产品操作
      setProducts: (products) => set({ products }),

      // 测试项目操作
      setTestItems: (testItems) => set({ testItems }),

      // UI操作
      setIsLoading: (isLoading) => set({ isLoading }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      // 过滤器操作
      setFilters: (filters) => set({ filters }),
      clearFilters: () => set({ filters: {} }),

      // 通知操作
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: Math.random().toString(36).substr(2, 9),
              timestamp: new Date(),
            },
          ],
        })),
      
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      // 重置状态
      reset: () => set(initialState),
    }),
    {
      name: 'pv-sdm-store',
    }
  )
);