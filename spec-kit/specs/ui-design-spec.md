# UI设计规范：光伏关断器实验数据管理系统

**文档版本**: v1.0  
**创建日期**: 2025-09-13  
**状态**: 正式版

## 1. 设计理念

### 1.1 核心设计原则
- **数据至上**：界面设计服务于数据展示，确保信息的清晰传达
- **工业美学**：采用现代工业风格，体现专业性和科技感
- **高效交互**：减少操作步骤，提升用户工作效率
- **视觉层级**：通过色彩、大小、间距建立清晰的信息层级

### 1.2 设计风格定位
- **科技工业风**：深色背景配合霓虹光效，营造专业的实验室氛围
- **数据可视化**：采用现代图表设计，直观展示复杂数据
- **扁平化设计**：简洁的界面元素，聚焦内容本身
- **响应式布局**：适配不同屏幕尺寸，确保一致的用户体验

## 2. 视觉规范

### 2.1 色彩系统

#### 主色板
```css
/* 品牌色 */
--primary-color: #00D4FF;      /* 电光蓝 - 主要交互元素 */
--primary-dark: #0099CC;       /* 深电光蓝 - 悬停状态 */
--primary-light: #66E5FF;      /* 浅电光蓝 - 高亮效果 */

/* 功能色 */
--success-color: #10B981;      /* 翡翠绿 - 成功/通过 */
--warning-color: #F59E0B;      /* 琥珀黄 - 警告 */
--error-color: #EF4444;        /* 警示红 - 错误/不合格 */
--info-color: #3B82F6;         /* 信息蓝 - 提示信息 */

/* 背景色 */
--bg-primary: #0A0E27;         /* 深邃蓝黑 - 主背景 */
--bg-secondary: #111827;       /* 次级背景 - 卡片/容器 */
--bg-tertiary: #1F2937;        /* 三级背景 - 输入框/按钮 */

/* 文本色 */
--text-primary: #E5E7EB;       /* 主要文本 */
--text-secondary: #9CA3AF;     /* 次要文本 */
--text-muted: #6B7280;         /* 辅助文本 */

/* 边框色 */
--border-color: #374151;       /* 默认边框 */
--border-light: #4B5563;       /* 浅色边框 */
--border-dark: #1F2937;        /* 深色边框 */
```

#### 数据可视化色板
```css
/* 图表配色方案 */
--chart-1: #00D4FF;           /* 主数据系列 */
--chart-2: #7C3AED;           /* 次要数据系列 */
--chart-3: #10B981;           /* 成功数据 */
--chart-4: #F59E0B;           /* 警告数据 */
--chart-5: #EF4444;           /* 错误数据 */
--chart-6: #8B5CF6;           /* 补充色1 */
--chart-7: #EC4899;           /* 补充色2 */
--chart-8: #14B8A6;           /* 补充色3 */
```

### 2.2 字体规范

#### 字体家族
```css
/* 主字体栈 */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 
                'Helvetica Neue', Helvetica, Arial, sans-serif;

/* 等宽字体 - 用于数据展示 */
--font-mono: 'JetBrains Mono', 'SF Mono', Monaco, Consolas, 
             'Liberation Mono', 'Courier New', monospace;
```

#### 字体大小
```css
/* 标题层级 */
--text-xs: 0.75rem;     /* 12px - 标签/辅助文本 */
--text-sm: 0.875rem;    /* 14px - 小号正文 */
--text-base: 1rem;      /* 16px - 正文 */
--text-lg: 1.125rem;    /* 18px - 大号正文 */
--text-xl: 1.25rem;     /* 20px - 小标题 */
--text-2xl: 1.5rem;     /* 24px - 标题 */
--text-3xl: 1.875rem;   /* 30px - 大标题 */
--text-4xl: 2.25rem;    /* 36px - 超大标题 */
--text-5xl: 3rem;       /* 48px - 巨型标题 */
```

### 2.3 间距系统
```css
/* 基础间距单位 */
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
```

## 3. 组件设计规范

### 3.1 按钮组件

#### 主要按钮
```css
.btn-primary {
  background: linear-gradient(135deg, #00D4FF 0%, #0099CC 100%);
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
}
```

#### 次要按钮
```css
.btn-secondary {
  background: transparent;
  color: #00D4FF;
  border: 1px solid #00D4FF;
  padding: 11px 23px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(0, 212, 255, 0.1);
  border-color: #66E5FF;
  color: #66E5FF;
}
```

### 3.2 卡片组件
```css
.card {
  background: rgba(17, 24, 39, 0.8);
  border: 1px solid #374151;
  border-radius: 8px;
  padding: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.card-glow {
  position: relative;
  overflow: hidden;
}

.card-glow::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #00D4FF, #7C3AED, #00D4FF);
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.card-glow:hover::before {
  opacity: 0.5;
}
```

### 3.3 输入框组件
```css
.input {
  background: #1F2937;
  border: 1px solid #374151;
  color: #E5E7EB;
  padding: 12px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.input:focus {
  border-color: #00D4FF;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  outline: none;
}
```

### 3.4 数据表格
```css
.data-table {
  background: #111827;
  border-radius: 8px;
  overflow: hidden;
}

.data-table th {
  background: #1F2937;
  color: #9CA3AF;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.875rem;
  padding: 16px;
  border-bottom: 1px solid #374151;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #1F2937;
  color: #E5E7EB;
}

.data-table tr:hover {
  background: rgba(0, 212, 255, 0.05);
}
```

## 4. 数据可视化设计

### 4.1 图表通用样式
```javascript
// Chart.js 全局配置
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#9CA3AF',
        font: {
          family: 'Inter',
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderColor: '#374151',
      borderWidth: 1,
      titleColor: '#E5E7EB',
      bodyColor: '#9CA3AF',
      cornerRadius: 6,
      padding: 12
    }
  },
  scales: {
    x: {
      grid: {
        color: '#1F2937',
        borderColor: '#374151'
      },
      ticks: {
        color: '#6B7280'
      }
    },
    y: {
      grid: {
        color: '#1F2937',
        borderColor: '#374151'
      },
      ticks: {
        color: '#6B7280'
      }
    }
  }
};
```

### 4.2 仪表盘设计
```css
.gauge-container {
  position: relative;
  display: inline-block;
}

.gauge-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
  font-weight: 700;
  color: #00D4FF;
  font-family: var(--font-mono);
}

.gauge-label {
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  color: #9CA3AF;
  font-size: 0.875rem;
  text-transform: uppercase;
}
```

## 5. 动画与过渡

### 5.1 过渡效果
```css
/* 标准过渡 */
.transition-default {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 快速过渡 */
.transition-fast {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 慢速过渡 */
.transition-slow {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 5.2 加载动画
```css
@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 40px rgba(0, 212, 255, 0.8);
  }
}

.loading-pulse {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

### 5.3 数据更新动画
```css
@keyframes data-update {
  0% {
    background-color: transparent;
  }
  50% {
    background-color: rgba(0, 212, 255, 0.2);
  }
  100% {
    background-color: transparent;
  }
}

.data-updated {
  animation: data-update 1s ease-in-out;
}
```

## 6. 响应式设计

### 6.1 断点定义
```css
/* 断点 */
--screen-sm: 640px;   /* 小屏幕 */
--screen-md: 768px;   /* 平板 */
--screen-lg: 1024px;  /* 桌面 */
--screen-xl: 1280px;  /* 大屏幕 */
--screen-2xl: 1536px; /* 超大屏幕 */
```

### 6.2 网格系统
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

## 7. 数据大屏设计

### 7.1 布局结构
```
┌─────────────────────────────────────────────────────────────┐
│                         顶部标题栏                            │
│  系统名称                    实时时间              用户信息   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  今日测试数   │  │   合格率    │  │  异常告警   │        │
│  │    256      │  │   98.5%     │  │     2       │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────┐  ┌────────────────────────────┐ │
│  │     实时测试进度        │  │      测试项目分布           │ │
│  │   [实时折线图]         │  │      [饼图]               │ │
│  └───────────────────────┘  └────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────┐  ┌────────────────────────────┐ │
│  │    产品合格率趋势       │  │      异常数据热力图         │ │
│  │   [柱状图]            │  │      [热力图]             │ │
│  └───────────────────────┘  └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 大屏专用样式
```css
/* 大屏容器 */
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0A0E27 0%, #0F172A 100%);
  padding: 24px;
  display: grid;
  gap: 24px;
}

/* 数据卡片 */
.metric-card {
  background: rgba(17, 24, 39, 0.6);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 12px;
  padding: 32px;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00D4FF, transparent);
  animation: scan 3s linear infinite;
}

@keyframes scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 大数字展示 */
.metric-value {
  font-size: 3.5rem;
  font-weight: 700;
  color: #00D4FF;
  font-family: var(--font-mono);
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}

/* 图表容器 */
.chart-container {
  background: rgba(17, 24, 39, 0.4);
  border: 1px solid #374151;
  border-radius: 12px;
  padding: 24px;
  height: 100%;
}
```

## 8. 图标系统

### 8.1 图标使用原则
- 使用 Lucide React 作为主要图标库
- 图标大小保持一致性（16px, 20px, 24px）
- 图标颜色跟随文本颜色
- 功能性图标使用描述性的 aria-label

### 8.2 常用图标映射
```javascript
const iconMap = {
  // 功能图标
  upload: Upload,
  download: Download,
  filter: Filter,
  search: Search,
  settings: Settings,
  
  // 状态图标
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  
  // 数据图标
  chart: BarChart3,
  dashboard: LayoutDashboard,
  database: Database,
  file: FileText,
  
  // 操作图标
  add: Plus,
  edit: Edit,
  delete: Trash2,
  view: Eye,
  refresh: RefreshCw
};
```

## 9. 交互反馈

### 9.1 加载状态
```jsx
// 骨架屏
<div className="skeleton">
  <div className="skeleton-line" />
  <div className="skeleton-line w-3/4" />
  <div className="skeleton-line w-1/2" />
</div>

// 加载动画
<div className="loader">
  <div className="loader-ring">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>
```

### 9.2 提示信息
```jsx
// Toast 提示
const toastStyles = {
  success: 'bg-green-900 border-green-700 text-green-100',
  error: 'bg-red-900 border-red-700 text-red-100',
  warning: 'bg-yellow-900 border-yellow-700 text-yellow-100',
  info: 'bg-blue-900 border-blue-700 text-blue-100'
};
```

## 10. 无障碍设计

### 10.1 颜色对比度
- 确保文本与背景的对比度符合 WCAG AA 标准
- 主要文本对比度 ≥ 4.5:1
- 大文本对比度 ≥ 3:1

### 10.2 键盘导航
- 所有交互元素支持键盘访问
- 清晰的焦点指示器
- 逻辑的 Tab 顺序

### 10.3 屏幕阅读器支持
- 使用语义化 HTML
- 提供适当的 ARIA 标签
- 图表提供文本描述

---

**文档维护**  
UI设计师：___________  
前端负责人：___________  
更新日期：___________