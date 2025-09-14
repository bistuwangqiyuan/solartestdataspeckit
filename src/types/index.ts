// 测试记录类型
export interface TestRecord {
  id: string;
  test_date: string;
  device_sn: string;
  product_id: string;
  product?: Product;
  test_item_id: string;
  test_item?: TestItem;
  test_value: Record<string, any>;
  result: 'PASS' | 'FAIL';
  operator_id: string;
  operator?: User;
  batch_id?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

// 测试项目类型
export interface TestItem {
  id: string;
  code: string;
  name: string;
  category: string;
  standard_ref?: string;
  pass_criteria: Record<string, any>;
  parameters?: Record<string, any>;
  unit?: string;
  is_active: boolean;
  created_at: string;
}

// 产品类型
export interface Product {
  id: string;
  model: string;
  name: string;
  specifications?: Record<string, any>;
  manufacturer?: string;
  category?: string;
  created_at: string;
}

// 用户类型
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  department?: string;
  is_active: boolean;
  created_at: string;
}

// 批次信息类型
export interface TestBatch {
  id: string;
  batch_no: string;
  product_id: string;
  product?: Product;
  total_count: number;
  pass_count: number;
  fail_count: number;
  status: 'in_progress' | 'completed';
  started_at: string;
  completed_at?: string;
}

// 异常记录类型
export interface Anomaly {
  id: string;
  test_record_id: string;
  test_record?: TestRecord;
  anomaly_type: string;
  severity: 'low' | 'medium' | 'high';
  description?: string;
  detected_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

// 统计数据类型
export interface Statistics {
  total_tests: number;
  pass_count: number;
  fail_count: number;
  pass_rate: number;
  date?: string;
  product_id?: string;
  test_item_id?: string;
}

// 日统计类型
export interface DailyStatistics extends Statistics {
  date: string;
}

// API响应类型
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

// 分页参数
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

// 查询过滤器
export interface QueryFilters {
  dateFrom?: string;
  dateTo?: string;
  deviceSn?: string;
  productId?: string;
  testItemId?: string;
  result?: 'PASS' | 'FAIL';
  batchId?: string;
}

// 排序参数
export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

// 文件上传结果
export interface FileUploadResult {
  fileId: string;
  fileName: string;
  fileSize: number;
  recordCount: number;
  validRecords: number;
  invalidRecords: number;
  errors?: ValidationError[];
}

// 验证错误
export interface ValidationError {
  row: number;
  field: string;
  value: any;
  message: string;
}

// 图表数据类型
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// 仪表盘数据
export interface DashboardData {
  todayStats: Statistics;
  weekStats: Statistics;
  monthStats: Statistics;
  recentTests: TestRecord[];
  passRateTrend: ChartData;
  categoryDistribution: ChartData;
  anomalies: Anomaly[];
}