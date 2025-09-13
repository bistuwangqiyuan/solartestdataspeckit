# 系统架构设计文档：光伏关断器实验数据管理系统

**文档版本**: v1.0  
**创建日期**: 2025-09-13  
**状态**: 正式版

## 1. 系统架构概述

### 1.1 架构原则
- **云原生设计**：充分利用Supabase和Netlify的云服务能力
- **前后端分离**：Next.js负责UI渲染，Supabase处理数据和业务逻辑
- **实时性优先**：利用Supabase Realtime实现数据实时同步
- **安全性保障**：多层次的安全防护，包括认证、授权和数据加密
- **可扩展性**：模块化设计，便于功能扩展和维护

### 1.2 技术选型理由
- **Next.js 14**：提供SSR/SSG能力，优化SEO和首屏加载性能
- **Supabase**：开源的Firebase替代品，提供完整的后端服务
- **TypeScript**：类型安全，提升代码质量和开发效率
- **Tailwind CSS**：原子化CSS，快速构建响应式界面
- **Chart.js/D3.js**：成熟的数据可视化解决方案

## 2. 系统分层架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        展示层 (Presentation)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │   Web App    │  │ Data Screen  │  │   Admin Dashboard     │ │
│  │  (Next.js)   │  │  (Next.js)   │  │     (Next.js)         │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      应用服务层 (Application)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ API Routes   │  │ Server Comp. │  │   Edge Functions      │ │
│  │  (Next.js)   │  │  (Next.js)   │  │    (Netlify)          │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       业务逻辑层 (Business)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │Data Processor│  │  Analyzer    │  │   Report Generator    │ │
│  │  (Services)  │  │  (Services)  │  │     (Services)        │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        数据访问层 (Data)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │  Supabase    │  │  Storage     │  │    Cache Layer        │ │
│  │  Client      │  │  (Supabase)  │  │   (Redis/Memory)      │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      基础设施层 (Infrastructure)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │  PostgreSQL  │  │   Realtime   │  │      Auth Service     │ │
│  │  (Supabase)  │  │  (Supabase)  │  │      (Supabase)       │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 3. 核心模块设计

### 3.1 数据导入模块

#### 架构设计
```typescript
// 文件上传处理流程
interface FileUploadFlow {
  1. 客户端文件验证 (大小、格式)
  2. 上传至 Supabase Storage
  3. 触发 Edge Function 进行解析
  4. 数据验证和清洗
  5. 批量插入数据库
  6. 返回处理结果
}

// Excel 解析服务
class ExcelParserService {
  async parseFile(fileUrl: string): Promise<ParsedData[]>
  async validateData(data: ParsedData[]): Promise<ValidationResult>
  async transformData(data: ParsedData[]): Promise<TestRecord[]>
}
```

#### 数据流程图
```
用户选择文件 → 前端验证 → 上传Storage → 解析Excel → 数据验证 → 入库
     ↓                                              ↓
  显示进度 ←←←←←←← 实时反馈 ←←←←←←←← 处理状态 ←←←←←↓
```

### 3.2 实时数据同步

#### WebSocket 连接管理
```typescript
// Supabase Realtime 订阅
const subscription = supabase
  .channel('test-records')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'test_records'
  }, (payload) => {
    // 处理数据变更
    updateDashboard(payload)
  })
  .subscribe()
```

#### 数据推送策略
- 新增数据：立即推送到大屏
- 更新数据：批量推送（每秒最多一次）
- 删除数据：立即推送并更新统计

### 3.3 数据分析引擎

#### 分析任务调度
```typescript
interface AnalysisJob {
  id: string
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  parameters: AnalysisParams
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: AnalysisResult
}

// 分析服务接口
interface AnalysisService {
  calculatePassRate(timeRange: TimeRange): Promise<PassRateResult>
  detectAnomalies(data: TestRecord[]): Promise<Anomaly[]>
  generateTrends(metric: string, period: Period): Promise<TrendData>
}
```

### 3.4 权限控制系统

#### RBAC 模型
```typescript
// 角色定义
enum Role {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  VIEWER = 'viewer'
}

// 权限矩阵
const permissions = {
  [Role.ADMIN]: ['*'],
  [Role.OPERATOR]: [
    'test_records:create',
    'test_records:read',
    'test_records:update',
    'reports:read'
  ],
  [Role.VIEWER]: [
    'test_records:read',
    'reports:read',
    'dashboard:view'
  ]
}
```

## 4. 数据库设计

### 4.1 核心数据表

```sql
-- 测试记录表
CREATE TABLE test_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_date TIMESTAMP NOT NULL,
  device_sn VARCHAR(50) NOT NULL,
  product_id UUID REFERENCES products(id),
  test_item_id UUID REFERENCES test_items(id),
  test_value JSONB NOT NULL,
  result VARCHAR(10) CHECK (result IN ('PASS', 'FAIL')),
  operator_id UUID REFERENCES auth.users(id),
  batch_id UUID,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引优化查询性能
CREATE INDEX idx_test_records_date ON test_records(test_date);
CREATE INDEX idx_test_records_device ON test_records(device_sn);
CREATE INDEX idx_test_records_result ON test_records(result);

-- 测试项目表
CREATE TABLE test_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  standard_ref VARCHAR(100),
  pass_criteria JSONB NOT NULL,
  parameters JSONB,
  unit VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 产品信息表
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  specifications JSONB,
  manufacturer VARCHAR(100),
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 批次信息表
CREATE TABLE test_batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_no VARCHAR(50) UNIQUE NOT NULL,
  product_id UUID REFERENCES products(id),
  total_count INTEGER DEFAULT 0,
  pass_count INTEGER DEFAULT 0,
  fail_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'in_progress',
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- 异常记录表
CREATE TABLE anomalies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_record_id UUID REFERENCES test_records(id),
  anomaly_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high')),
  description TEXT,
  detected_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES auth.users(id)
);
```

### 4.2 数据库优化策略

#### 分区策略
```sql
-- 按月分区测试记录表
CREATE TABLE test_records_2025_01 PARTITION OF test_records
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE test_records_2025_02 PARTITION OF test_records
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

#### 物化视图
```sql
-- 日统计物化视图
CREATE MATERIALIZED VIEW daily_statistics AS
SELECT 
  DATE(test_date) as date,
  product_id,
  COUNT(*) as total_tests,
  COUNT(*) FILTER (WHERE result = 'PASS') as pass_count,
  COUNT(*) FILTER (WHERE result = 'FAIL') as fail_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE result = 'PASS') / COUNT(*), 2) as pass_rate
FROM test_records
GROUP BY DATE(test_date), product_id;

-- 定期刷新
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_statistics;
```

## 5. API 设计

### 5.1 RESTful API 规范

#### 测试记录 API
```typescript
// GET /api/test-records
interface GetTestRecordsRequest {
  page?: number
  limit?: number
  filters?: {
    dateFrom?: string
    dateTo?: string
    deviceSn?: string
    result?: 'PASS' | 'FAIL'
  }
  sort?: {
    field: string
    order: 'asc' | 'desc'
  }
}

// POST /api/test-records/import
interface ImportTestRecordsRequest {
  fileId: string  // Supabase Storage file ID
  options?: {
    skipValidation?: boolean
    updateExisting?: boolean
  }
}

// GET /api/test-records/statistics
interface GetStatisticsRequest {
  timeRange: 'today' | 'week' | 'month' | 'custom'
  customRange?: {
    from: string
    to: string
  }
  groupBy?: 'product' | 'testItem' | 'operator'
}
```

### 5.2 GraphQL Schema (可选)
```graphql
type TestRecord {
  id: ID!
  testDate: DateTime!
  deviceSn: String!
  product: Product!
  testItem: TestItem!
  testValue: JSON!
  result: TestResult!
  operator: User!
  remarks: String
}

type Query {
  testRecords(
    filter: TestRecordFilter
    pagination: PaginationInput
    sort: SortInput
  ): TestRecordConnection!
  
  statistics(
    timeRange: TimeRange!
    groupBy: GroupByField
  ): Statistics!
}

type Mutation {
  importTestRecords(
    file: Upload!
    options: ImportOptions
  ): ImportResult!
  
  updateTestRecord(
    id: ID!
    input: UpdateTestRecordInput!
  ): TestRecord!
}

type Subscription {
  testRecordAdded(productId: ID): TestRecord!
  statisticsUpdated: Statistics!
}
```

## 6. 安全架构

### 6.1 认证流程
```
用户登录 → Supabase Auth → JWT Token → API 请求验证 → 资源访问
    ↓                          ↓
 邮箱/密码     ←←←←←←←←←← Token 刷新 ←←←←←← Token 过期
```

### 6.2 安全措施
```typescript
// Row Level Security (RLS) 策略
-- 用户只能查看自己的测试记录
CREATE POLICY "Users can view own test records" ON test_records
  FOR SELECT USING (auth.uid() = operator_id OR 
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'viewer')
    ));

-- 只有操作员和管理员可以创建记录
CREATE POLICY "Operators can create test records" ON test_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'operator')
    ));
```

### 6.3 数据加密
- **传输加密**：全站 HTTPS，TLS 1.3
- **存储加密**：Supabase 提供的 AES-256 加密
- **敏感数据**：使用 Supabase Vault 存储敏感配置

## 7. 性能优化

### 7.1 前端优化
```typescript
// 代码分割
const DashboardScreen = dynamic(() => import('@/components/DashboardScreen'), {
  loading: () => <DashboardSkeleton />,
  ssr: false
})

// 图片优化
import Image from 'next/image'

// 数据缓存
const { data, error } = useSWR(
  `/api/test-records?${params}`,
  fetcher,
  {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 30000 // 30秒刷新
  }
)
```

### 7.2 后端优化
```typescript
// 连接池配置
const supabase = createClient(url, key, {
  db: {
    schema: 'public'
  },
  global: {
    headers: { 
      'x-connection-pooling': 'session'
    }
  }
})

// 批量操作
async function batchInsertTestRecords(records: TestRecord[]) {
  const BATCH_SIZE = 1000
  const batches = chunk(records, BATCH_SIZE)
  
  for (const batch of batches) {
    await supabase
      .from('test_records')
      .insert(batch)
  }
}
```

### 7.3 缓存策略
```typescript
// 多级缓存
interface CacheStrategy {
  browser: {
    staticAssets: '1 year',
    apiResponses: '5 minutes',
    dashboardData: '30 seconds'
  },
  edge: {
    staticPages: '1 hour',
    apiRoutes: '1 minute'
  },
  database: {
    materializedViews: '5 minutes',
    queryCache: '30 seconds'
  }
}
```

## 8. 监控与运维

### 8.1 监控指标
```typescript
// 应用性能监控
interface Metrics {
  // 业务指标
  dailyTestCount: number
  averagePassRate: number
  activeUsers: number
  
  // 技术指标
  apiResponseTime: number
  errorRate: number
  databaseConnections: number
  storageUsage: number
}

// 告警规则
const alertRules = {
  highErrorRate: { threshold: 0.05, window: '5m' },
  slowResponse: { threshold: 3000, window: '1m' },
  lowPassRate: { threshold: 0.8, window: '1h' }
}
```

### 8.2 日志架构
```typescript
// 结构化日志
interface LogEntry {
  timestamp: string
  level: 'debug' | 'info' | 'warn' | 'error'
  service: string
  userId?: string
  action: string
  metadata: Record<string, any>
  duration?: number
  error?: Error
}

// 日志收集
const logger = {
  info: (action: string, metadata?: any) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      service: 'pv-sdm',
      action,
      metadata
    }))
  }
}
```

## 9. 扩展性设计

### 9.1 插件架构
```typescript
// 插件接口
interface Plugin {
  name: string
  version: string
  hooks: {
    beforeImport?: (data: any) => Promise<any>
    afterImport?: (result: any) => Promise<void>
    beforeAnalysis?: (params: any) => Promise<any>
    afterAnalysis?: (result: any) => Promise<any>
  }
}

// 插件注册
class PluginManager {
  private plugins: Map<string, Plugin> = new Map()
  
  register(plugin: Plugin): void
  execute(hook: string, data: any): Promise<any>
}
```

### 9.2 微服务预留
```
未来可拆分的服务：
1. 文件处理服务 (File Processing Service)
2. 分析计算服务 (Analytics Service)
3. 报表生成服务 (Report Service)
4. 通知服务 (Notification Service)
5. 定时任务服务 (Scheduler Service)
```

## 10. 部署架构

### 10.1 部署流程
```yaml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_PUBLIC_SUPABASE_URL = "https://zzyueuweeoakopuuwfau.supabase.co"
  NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGci..."

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### 10.2 CI/CD 流程
```
代码提交 → GitHub Actions → 单元测试 → 构建 → 部署到Netlify → 健康检查
    ↓                                              ↓
 Code Review ←←←←←←←← 测试失败 ←←←←←←←←←←←←←←← 部署失败
```

### 10.3 环境管理
```typescript
// 环境配置
const config = {
  development: {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    debug: true
  },
  staging: {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    debug: false
  },
  production: {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    debug: false
  }
}
```

---

**文档审批**  
系统架构师：___________  
技术总监：___________  
审批日期：___________