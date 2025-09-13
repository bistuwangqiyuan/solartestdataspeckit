# 开发指南

## 快速开始

### 环境准备
```bash
# 安装依赖
npm install

# 复制环境变量文件
cp .env.local.example .env.local

# 启动开发服务器
npm run dev
```

### 开发工具
- **VS Code** 推荐扩展：
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin

### 代码规范

#### TypeScript 规范
```typescript
// ✅ 好的做法
interface TestRecord {
  id: string
  deviceSn: string
  testDate: Date
  result: 'PASS' | 'FAIL'
}

// ❌ 避免
interface test_record {
  ID: any
  device_sn: string
  test_date: string
  Result: string
}
```

#### 组件规范
```tsx
// ✅ 推荐的组件结构
interface DataTableProps {
  data: TestRecord[]
  onSort?: (field: string) => void
  loading?: boolean
}

export default function DataTable({ 
  data, 
  onSort, 
  loading = false 
}: DataTableProps) {
  // 组件逻辑
}
```

#### 样式规范
```tsx
// ✅ 使用 Tailwind CSS 类
<div className="bg-gray-900 p-4 rounded-lg shadow-lg">
  <h2 className="text-xl font-bold text-gray-100">标题</h2>
</div>

// ✅ 复杂样式使用 CSS Modules
<div className={styles.customChart}>
  {/* 图表内容 */}
</div>
```

### Git 工作流

#### 分支策略
- `main` - 生产环境分支
- `develop` - 开发分支
- `feature/*` - 功能分支
- `bugfix/*` - 缺陷修复分支
- `hotfix/*` - 紧急修复分支

#### 提交规范
```bash
# 功能开发
git commit -m "feat: 添加Excel数据导入功能"

# 缺陷修复
git commit -m "fix: 修复大文件上传超时问题"

# 文档更新
git commit -m "docs: 更新API使用说明"

# 样式调整
git commit -m "style: 优化数据表格样式"

# 重构
git commit -m "refactor: 重构数据验证逻辑"

# 测试
git commit -m "test: 添加数据导入单元测试"

# 构建
git commit -m "chore: 更新依赖版本"
```

### 项目结构
```
src/
├── components/          # 可复用组件
│   ├── common/         # 通用组件
│   ├── charts/         # 图表组件
│   └── dashboard/      # 大屏组件
├── pages/              # 页面路由
├── lib/                # 工具函数
│   ├── supabase.ts    # Supabase客户端
│   ├── utils.ts       # 通用工具
│   └── validators.ts  # 数据验证
├── hooks/              # 自定义Hooks
├── services/           # API服务
├── types/              # TypeScript类型
└── styles/             # 全局样式
```

### 数据流架构
```
用户交互 → React组件 → Hooks → Services → Supabase → PostgreSQL
    ↑                                              ↓
    ←←←←←←←← 状态更新 ←←←←← Realtime订阅 ←←←←←←←←
```

### 性能优化建议

#### 1. 代码分割
```typescript
// 动态导入大型组件
const DashboardScreen = dynamic(
  () => import('@/components/dashboard/DashboardScreen'),
  { 
    loading: () => <DashboardSkeleton />,
    ssr: false 
  }
)
```

#### 2. 数据缓存
```typescript
// 使用SWR进行数据缓存
const { data, error, mutate } = useSWR(
  `/api/test-records`,
  fetcher,
  {
    refreshInterval: 30000, // 30秒刷新
    revalidateOnFocus: false
  }
)
```

#### 3. 图片优化
```tsx
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={50}
  priority
/>
```

### 测试指南

#### 单元测试
```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- DataTable.test.tsx

# 查看覆盖率
npm run test:coverage
```

#### E2E测试
```bash
# 启动Cypress
npm run cypress:open

# 无头模式运行
npm run cypress:run
```

### 调试技巧

#### 1. React DevTools
- 安装React Developer Tools浏览器扩展
- 查看组件树和状态

#### 2. Supabase调试
```typescript
// 启用调试日志
const supabase = createClient(url, key, {
  global: {
    headers: {
      'x-debug-mode': 'true'
    }
  }
})
```

#### 3. 网络请求调试
```typescript
// 添加请求拦截器
if (process.env.NODE_ENV === 'development') {
  console.log('API Request:', { url, method, data })
}
```

### 常见问题

#### Q: 如何处理Supabase连接错误？
```typescript
try {
  const { data, error } = await supabase
    .from('test_records')
    .select('*')
    
  if (error) throw error
  return data
} catch (error) {
  console.error('Supabase error:', error)
  // 显示用户友好的错误信息
  toast.error('数据加载失败，请稍后重试')
}
```

#### Q: 如何优化大数据表格性能？
```typescript
// 使用虚拟滚动
import { useVirtualizer } from '@tanstack/react-virtual'

// 分页加载
const PAGE_SIZE = 50
const { data } = useSWR(
  `/api/test-records?page=${page}&limit=${PAGE_SIZE}`
)
```

### 部署检查清单

- [ ] 环境变量配置正确
- [ ] 所有测试通过
- [ ] 构建无错误
- [ ] 性能指标达标
- [ ] 安全扫描通过
- [ ] 文档更新完成

---

**更新日期**: 2025-09-13