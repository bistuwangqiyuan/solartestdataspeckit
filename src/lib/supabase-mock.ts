// Mock Supabase client for development without real Supabase connection

const mockData = {
  test_records: [
    {
      id: '1',
      test_date: '2025-01-15T10:30:00',
      device_sn: 'PV-SD-2025-001',
      product_id: '1',
      test_item_id: '1',
      test_value: { voltage: 1500, duration: 60 },
      result: 'PASS',
      operator_id: '1',
      created_at: '2025-01-15T10:30:00',
      updated_at: '2025-01-15T10:30:00',
    },
    {
      id: '2',
      test_date: '2025-01-15T11:00:00',
      device_sn: 'PV-SD-2025-002',
      product_id: '1',
      test_item_id: '2',
      test_value: { resistance: 1000 },
      result: 'PASS',
      operator_id: '2',
      created_at: '2025-01-15T11:00:00',
      updated_at: '2025-01-15T11:00:00',
    },
    {
      id: '3',
      test_date: '2025-01-15T14:00:00',
      device_sn: 'PV-SD-2025-003',
      product_id: '2',
      test_item_id: '1',
      test_value: { voltage: 1450, duration: 60 },
      result: 'FAIL',
      operator_id: '2',
      created_at: '2025-01-15T14:00:00',
      updated_at: '2025-01-15T14:00:00',
    },
  ],
  products: [
    {
      id: '1',
      model: 'PV-1500',
      name: '光伏关断器1500V',
      manufacturer: '示例制造商A',
      category: '高压型',
      created_at: '2025-01-01T00:00:00',
    },
    {
      id: '2',
      model: 'PV-1000',
      name: '光伏关断器1000V',
      manufacturer: '示例制造商B',
      category: '标准型',
      created_at: '2025-01-01T00:00:00',
    },
  ],
  test_items: [
    {
      id: '1',
      code: 'TEST-001',
      name: '耐压测试',
      category: '电气性能',
      standard_ref: 'IEC 60947-3',
      pass_criteria: { min_voltage: 1500, duration: 60 },
      unit: 'V',
      is_active: true,
      created_at: '2025-01-01T00:00:00',
    },
    {
      id: '2',
      code: 'TEST-002',
      name: '绝缘电阻测试',
      category: '电气性能',
      standard_ref: 'IEC 60947-3',
      pass_criteria: { min_resistance: 500 },
      unit: 'MΩ',
      is_active: true,
      created_at: '2025-01-01T00:00:00',
    },
    {
      id: '3',
      code: 'TEST-003',
      name: '温升测试',
      category: '环境适应性',
      standard_ref: 'IEC 60947-3',
      pass_criteria: { max_temperature: 85 },
      unit: '°C',
      is_active: true,
      created_at: '2025-01-01T00:00:00',
    },
  ],
  users: [
    {
      id: '1',
      email: 'admin@example.com',
      name: '系统管理员',
      role: 'admin',
      department: '信息技术部',
      is_active: true,
      created_at: '2025-01-01T00:00:00',
    },
    {
      id: '2',
      email: 'operator@example.com',
      name: '张三',
      role: 'operator',
      department: '质检部',
      is_active: true,
      created_at: '2025-01-01T00:00:00',
    },
  ],
  daily_statistics: [
    { date: '2025-01-01', product_id: '1', total_tests: 50, pass_count: 48, fail_count: 2, pass_rate: 96 },
    { date: '2025-01-02', product_id: '1', total_tests: 45, pass_count: 43, fail_count: 2, pass_rate: 95.6 },
    { date: '2025-01-03', product_id: '1', total_tests: 52, pass_count: 50, fail_count: 2, pass_rate: 96.2 },
    { date: '2025-01-04', product_id: '1', total_tests: 48, pass_count: 45, fail_count: 3, pass_rate: 93.8 },
    { date: '2025-01-05', product_id: '1', total_tests: 55, pass_count: 53, fail_count: 2, pass_rate: 96.4 },
  ],
};

// Mock Supabase client
export const supabaseMock = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => ({ data: mockData[table as keyof typeof mockData]?.[0] || null, error: null }),
        data: mockData[table as keyof typeof mockData]?.filter((item: any) => item[column] === value) || [],
        error: null,
      }),
      gte: (column: string, value: any) => ({
        lte: (column2: string, value2: any) => ({
          data: mockData[table as keyof typeof mockData] || [],
          error: null,
          count: mockData[table as keyof typeof mockData]?.length || 0,
        }),
        data: mockData[table as keyof typeof mockData] || [],
        error: null,
      }),
      lte: (column: string, value: any) => ({
        data: mockData[table as keyof typeof mockData] || [],
        error: null,
      }),
      order: (column: string, options?: any) => ({
        range: (from: number, to: number) => ({
          data: mockData[table as keyof typeof mockData]?.slice(from, to + 1) || [],
          error: null,
          count: mockData[table as keyof typeof mockData]?.length || 0,
        }),
        data: mockData[table as keyof typeof mockData] || [],
        error: null,
        count: mockData[table as keyof typeof mockData]?.length || 0,
      }),
      data: mockData[table as keyof typeof mockData] || [],
      error: null,
      count: mockData[table as keyof typeof mockData]?.length || 0,
    }),
    insert: (data: any) => ({
      select: () => ({
        single: async () => ({ data: { ...data, id: Date.now().toString() }, error: null }),
        data: Array.isArray(data) ? data : [data],
        error: null,
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => ({ data, error: null }),
        }),
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        error: null,
      }),
    }),
  }),

  auth: {
    getUser: async () => ({
      data: { user: { id: '1', email: 'admin@example.com' } },
      error: null,
    }),
    signInWithPassword: async ({ email, password }: any) => {
      if (email === 'admin@example.com' && password === 'admin123') {
        return { data: { user: { id: '1', email } }, error: null };
      }
      return { data: null, error: new Error('Invalid credentials') };
    },
    signOut: async () => ({ error: null }),
    onAuthStateChange: (callback: any) => {
      return {
        data: { subscription: { unsubscribe: () => {} } },
      };
    },
  },

  channel: (name: string) => ({
    on: (event: string, config: any, callback: any) => ({
      subscribe: (statusCallback?: any) => {
        if (statusCallback) statusCallback('SUBSCRIBED');
        return { unsubscribe: () => {} };
      },
    }),
  }),

  removeChannel: (channel: any) => {},
};

// Export a function to get the appropriate client
export function getSupabaseClient() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Return real Supabase client
    return require('./supabase').supabase;
  }
  // Return mock client
  console.warn('Using mock Supabase client. Configure environment variables for real connection.');
  return supabaseMock;
}