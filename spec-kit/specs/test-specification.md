# 测试规范文档：光伏关断器实验数据管理系统

**文档版本**: v1.0  
**创建日期**: 2025-09-13  
**状态**: 正式版

## 1. 测试策略

### 1.1 测试目标
- 确保系统功能符合产品需求文档（PRD）的要求
- 验证系统性能满足设计指标
- 保证数据准确性和完整性
- 确认用户体验流畅且符合预期
- 验证系统安全性和稳定性

### 1.2 测试范围
- **功能测试**：覆盖所有用户故事和功能需求
- **性能测试**：验证系统在高负载下的表现
- **安全测试**：检查认证、授权和数据保护
- **兼容性测试**：确保跨浏览器和设备的兼容性
- **用户接受测试**：验证系统满足最终用户需求

### 1.3 测试级别
1. **单元测试**：组件和函数级别
2. **集成测试**：模块间交互
3. **系统测试**：端到端功能验证
4. **验收测试**：用户场景验证

## 2. 测试环境

### 2.1 环境配置
```yaml
测试环境:
  前端:
    - Node.js: 18.x
    - Next.js: 14.x
    - 浏览器: Chrome 120+, Firefox 120+, Safari 17+
  
  后端:
    - Supabase: 最新版本
    - PostgreSQL: 15.x
  
  测试工具:
    - Jest: 单元测试
    - React Testing Library: 组件测试
    - Cypress: E2E测试
    - Lighthouse: 性能测试
```

### 2.2 测试数据
```typescript
// 测试数据集
const testDataSets = {
  // 正常数据
  validTestRecords: [
    {
      deviceSn: "PV-SD-2025-001",
      testDate: "2025-01-15",
      testItem: "耐压测试",
      testValue: { voltage: 1500, duration: 60 },
      result: "PASS"
    }
  ],
  
  // 边界数据
  boundaryData: [
    { fileSize: "50MB" }, // 最大文件
    { records: 10000 },   // 最大记录数
    { concurrent: 100 }   // 最大并发
  ],
  
  // 异常数据
  invalidData: [
    { deviceSn: null },           // 必填字段缺失
    { testValue: "invalid" },     // 数据类型错误
    { testDate: "2025-13-01" }    // 无效日期
  ]
}
```

## 3. 功能测试用例

### 3.1 数据导入功能

#### TC-001: Excel文件上传
```gherkin
Feature: Excel文件上传
  
  Scenario: 成功上传有效的Excel文件
    Given 用户已登录系统
    And 用户在数据导入页面
    When 用户选择一个有效的Excel文件（小于50MB）
    And 点击"上传"按钮
    Then 系统显示上传进度
    And 上传完成后显示"文件上传成功"
    And 显示数据预览表格
    
  Scenario: 上传超大文件被拒绝
    Given 用户已登录系统
    When 用户选择一个大于50MB的文件
    Then 系统显示错误提示"文件大小超过限制（最大50MB）"
    And 不执行上传操作
```

#### TC-002: 数据验证
```gherkin
Feature: 导入数据验证
  
  Scenario: 验证必填字段
    Given Excel文件已上传
    When 系统解析文件内容
    And 发现缺少必填字段（设备序列号）
    Then 标记该行数据为错误
    And 显示错误信息"第X行：设备序列号不能为空"
    
  Scenario: 验证数据格式
    Given Excel文件包含错误格式的日期
    When 系统验证数据
    Then 识别并标记格式错误
    And 提供修正建议
```

### 3.2 数据查询功能

#### TC-003: 基础查询
```typescript
describe('数据查询功能', () => {
  test('按日期范围查询', async () => {
    // 设置查询条件
    const filters = {
      dateFrom: '2025-01-01',
      dateTo: '2025-01-31'
    }
    
    // 执行查询
    const result = await queryTestRecords(filters)
    
    // 验证结果
    expect(result.data).toBeDefined()
    expect(result.data.length).toBeGreaterThan(0)
    result.data.forEach(record => {
      expect(new Date(record.testDate)).toBeGreaterThanOrEqual(new Date(filters.dateFrom))
      expect(new Date(record.testDate)).toBeLessThanOrEqual(new Date(filters.dateTo))
    })
  })
  
  test('按设备序列号查询', async () => {
    const deviceSn = 'PV-SD-2025-001'
    const result = await queryTestRecords({ deviceSn })
    
    expect(result.data.every(r => r.deviceSn === deviceSn)).toBe(true)
  })
})
```

### 3.3 数据分析功能

#### TC-004: 统计分析
```gherkin
Feature: 合格率统计
  
  Scenario: 计算日合格率
    Given 系统有今日的测试数据
    When 用户查看数据大屏
    Then 显示今日合格率百分比
    And 合格率 = (合格数/总数) × 100%
    And 数值保留一位小数
    
  Scenario: 趋势分析
    Given 系统有最近30天的数据
    When 用户查看趋势图表
    Then 显示30天的合格率趋势线
    And X轴为日期，Y轴为合格率
    And 支持缩放和平移操作
```

### 3.4 实时数据更新

#### TC-005: 大屏实时刷新
```typescript
describe('实时数据更新', () => {
  test('新数据自动显示', async () => {
    // 打开数据大屏
    await page.goto('/dashboard')
    
    // 记录当前数据
    const initialCount = await page.$eval('#total-count', el => el.textContent)
    
    // 通过API添加新数据
    await api.createTestRecord(newTestData)
    
    // 等待更新（最多30秒）
    await page.waitForFunction(
      (init) => document.querySelector('#total-count').textContent !== init,
      { timeout: 30000 },
      initialCount
    )
    
    // 验证数据已更新
    const updatedCount = await page.$eval('#total-count', el => el.textContent)
    expect(parseInt(updatedCount)).toBe(parseInt(initialCount) + 1)
  })
})
```

## 4. 性能测试

### 4.1 响应时间测试

#### PT-001: 页面加载性能
```javascript
describe('页面加载性能', () => {
  test('首页加载时间', async () => {
    const metrics = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      onlyCategories: ['performance']
    })
    
    const { performance } = metrics.lhr.categories
    expect(performance.score).toBeGreaterThan(0.8) // 80分以上
    
    const fcp = metrics.lhr.audits['first-contentful-paint']
    expect(fcp.numericValue).toBeLessThan(1500) // FCP < 1.5秒
    
    const lcp = metrics.lhr.audits['largest-contentful-paint']
    expect(lcp.numericValue).toBeLessThan(2500) // LCP < 2.5秒
  })
})
```

#### PT-002: API响应时间
```typescript
describe('API性能测试', () => {
  test('查询接口响应时间', async () => {
    const startTime = Date.now()
    const response = await fetch('/api/test-records?limit=100')
    const endTime = Date.now()
    
    expect(response.status).toBe(200)
    expect(endTime - startTime).toBeLessThan(1000) // < 1秒
  })
  
  test('批量导入性能', async () => {
    const records = generateTestRecords(1000) // 1000条记录
    const startTime = Date.now()
    
    const response = await api.batchImport(records)
    const endTime = Date.now()
    
    expect(response.success).toBe(true)
    expect(endTime - startTime).toBeLessThan(10000) // < 10秒
  })
})
```

### 4.2 并发测试

#### PT-003: 并发用户测试
```javascript
// K6 负载测试脚本
import http from 'k6/http'
import { check } from 'k6'

export const options = {
  stages: [
    { duration: '2m', target: 50 },  // 逐步增加到50用户
    { duration: '5m', target: 100 }, // 保持100用户
    { duration: '2m', target: 0 },   // 逐步降低
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95%的请求小于3秒
    http_req_failed: ['rate<0.1'],     // 错误率小于10%
  },
}

export default function () {
  const res = http.get('https://app.example.com/api/test-records')
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 3s': (r) => r.timings.duration < 3000,
  })
}
```

## 5. 安全测试

### 5.1 认证测试

#### ST-001: 用户认证
```gherkin
Feature: 用户认证安全
  
  Scenario: 未认证用户访问受限
    Given 用户未登录
    When 访问 /dashboard 页面
    Then 重定向到登录页面
    And URL包含 redirect=/dashboard
    
  Scenario: Token过期处理
    Given 用户的JWT token已过期
    When 调用任何API接口
    Then 返回401状态码
    And 响应包含 "Token expired" 消息
```

### 5.2 授权测试

#### ST-002: 角色权限
```typescript
describe('角色权限测试', () => {
  test('查看者无法创建数据', async () => {
    // 以查看者身份登录
    const viewerToken = await login('viewer@example.com', 'password')
    
    // 尝试创建数据
    const response = await api.post('/test-records', testData, {
      headers: { Authorization: `Bearer ${viewerToken}` }
    })
    
    expect(response.status).toBe(403)
    expect(response.data.error).toBe('Insufficient permissions')
  })
  
  test('操作员可以创建数据', async () => {
    const operatorToken = await login('operator@example.com', 'password')
    
    const response = await api.post('/test-records', testData, {
      headers: { Authorization: `Bearer ${operatorToken}` }
    })
    
    expect(response.status).toBe(201)
    expect(response.data.id).toBeDefined()
  })
})
```

### 5.3 数据安全

#### ST-003: SQL注入测试
```typescript
describe('SQL注入防护', () => {
  const sqlInjectionPayloads = [
    "'; DROP TABLE test_records; --",
    "1' OR '1'='1",
    "\" OR 1=1 --",
    "<script>alert('XSS')</script>"
  ]
  
  sqlInjectionPayloads.forEach(payload => {
    test(`防护SQL注入: ${payload}`, async () => {
      const response = await api.get(`/test-records?deviceSn=${encodeURIComponent(payload)}`)
      
      expect(response.status).not.toBe(500)
      expect(response.data).toEqual({ data: [] }) // 返回空结果而非错误
    })
  })
})
```

## 6. 兼容性测试

### 6.1 浏览器兼容性

#### CT-001: 跨浏览器测试矩阵
```yaml
浏览器测试矩阵:
  Chrome:
    - 版本: [120, 121, 122]
    - 平台: [Windows, macOS, Linux]
  
  Firefox:
    - 版本: [120, 121]
    - 平台: [Windows, macOS]
  
  Safari:
    - 版本: [17.0, 17.1]
    - 平台: [macOS]
  
  Edge:
    - 版本: [120, 121]
    - 平台: [Windows]
```

### 6.2 响应式测试

#### CT-002: 设备适配
```javascript
// Cypress 响应式测试
describe('响应式布局测试', () => {
  const viewports = [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 812 }
  ]
  
  viewports.forEach(viewport => {
    it(`在${viewport.name}设备上正确显示`, () => {
      cy.viewport(viewport.width, viewport.height)
      cy.visit('/dashboard')
      
      // 验证关键元素可见性
      cy.get('[data-testid="header"]').should('be.visible')
      cy.get('[data-testid="main-content"]').should('be.visible')
      
      if (viewport.width < 768) {
        // 移动端特定验证
        cy.get('[data-testid="mobile-menu"]').should('be.visible')
        cy.get('[data-testid="desktop-menu"]').should('not.be.visible')
      }
    })
  })
})
```

## 7. 用户接受测试（UAT）

### 7.1 测试场景

#### UAT-001: 质检工程师日常工作流
```gherkin
Feature: 质检工程师工作流程
  
  Background:
    Given 我是一名质检工程师
    And 我已登录系统
  
  Scenario: 完整的测试数据录入流程
    When 我点击"数据导入"
    And 选择今天的测试Excel文件
    And 确认数据预览无误
    And 点击"确认导入"
    Then 数据成功导入系统
    And 我可以在列表中看到新导入的数据
    
  Scenario: 查看测试报告
    When 我进入"报表"页面
    And 选择"本月质量报告"
    Then 显示本月的测试统计
    And 包含合格率趋势图
    And 可以导出为PDF格式
```

### 7.2 用户满意度评估
```yaml
用户体验评估标准:
  易用性:
    - 新用户上手时间: < 30分钟
    - 完成核心任务步骤: < 5步
    - 错误恢复难度: 简单
  
  效率:
    - 数据导入时间降低: > 50%
    - 报表生成时间: < 10秒
    - 查询响应时间: < 2秒
  
  满意度:
    - 整体满意度评分: > 4.0/5.0
    - 推荐意愿(NPS): > 50
```

## 8. 回归测试

### 8.1 自动化回归测试套件
```typescript
// 核心功能回归测试清单
const regressionTestSuite = {
  critical: [
    'user-authentication',
    'data-import',
    'data-query',
    'report-generation'
  ],
  
  important: [
    'data-validation',
    'real-time-updates',
    'chart-rendering',
    'export-functions'
  ],
  
  nice-to-have: [
    'ui-animations',
    'keyboard-shortcuts',
    'theme-switching'
  ]
}

// 执行策略
const executionStrategy = {
  onCommit: ['critical'],
  onPR: ['critical', 'important'],
  onRelease: ['critical', 'important', 'nice-to-have']
}
```

## 9. 缺陷管理

### 9.1 缺陷分类
```yaml
缺陷严重程度:
  Critical (P0):
    定义: 系统崩溃、数据丢失、安全漏洞
    响应时间: 立即
    修复时限: 4小时
    
  High (P1):
    定义: 功能无法使用、性能严重下降
    响应时间: 2小时内
    修复时限: 24小时
    
  Medium (P2):
    定义: 功能部分受影响、有变通方案
    响应时间: 1工作日
    修复时限: 3工作日
    
  Low (P3):
    定义: UI问题、优化建议
    响应时间: 3工作日
    修复时限: 下个版本
```

### 9.2 缺陷报告模板
```markdown
**缺陷ID**: BUG-2025-001
**标题**: 数据导入时大文件处理失败
**严重程度**: P1
**发现版本**: v1.0.0
**环境**: Production

**重现步骤**:
1. 登录系统
2. 进入数据导入页面
3. 选择一个45MB的Excel文件
4. 点击上传

**预期结果**: 
文件成功上传并解析

**实际结果**: 
上传进度卡在80%，然后显示"网络错误"

**附件**:
- 错误截图
- 浏览器控制台日志
- 测试文件样本
```

## 10. 测试报告

### 10.1 测试执行总结模板
```markdown
# 测试执行报告

**项目**: 光伏关断器实验数据管理系统
**版本**: v1.0.0
**测试周期**: 2025-03-01 至 2025-03-15

## 测试概况
- **计划测试用例**: 256
- **执行测试用例**: 248
- **通过**: 235
- **失败**: 13
- **通过率**: 94.8%

## 测试覆盖率
- **代码覆盖率**: 87%
- **需求覆盖率**: 100%
- **风险覆盖率**: 95%

## 关键问题
1. [P1] 大文件上传性能问题
2. [P2] IE11浏览器兼容性问题
3. [P2] 并发100用户时响应变慢

## 建议
- 建议修复所有P1问题后发布
- P2问题可在下个版本修复
- 增加性能优化措施

**测试负责人**: ___________
**日期**: 2025-03-15
```

---

**文档审批**  
测试经理：___________  
质量保证负责人：___________  
审批日期：___________