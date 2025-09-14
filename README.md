# PV-SDM: 光伏关断器实验数据管理系统

[![Netlify Status](https://api.netlify.com/api/v1/badges/46648482-644c-4c80-bafb-872057e51b6b/deploy-status)](https://app.netlify.com/sites/next-dev-starter/deploys)

## 项目概述

PV-SDM (Photovoltaic Shutdown Device Manager) 是一个专业的光伏关断器实验数据管理平台，采用现代化的Web技术栈，为光伏产业提供高效的测试数据管理解决方案。

### 核心特性
- 📊 **数据管理**：Excel批量导入，智能数据验证
- 🔍 **智能分析**：自动统计分析，异常检测预警  
- 📺 **可视化大屏**：实时数据监控，多维度图表展示
- 🔐 **安全可靠**：基于Supabase的企业级数据安全
- 🎨 **工业美学**：深色主题，霓虹光效，现代工业风

### 技术栈
- **前端框架**: Next.js 14+ (React 18)
- **UI组件**: Shadcn/ui + Tailwind CSS
- **数据可视化**: Chart.js + D3.js
- **后端服务**: Supabase (PostgreSQL + Realtime)
- **部署平台**: Netlify
- **开发规范**: TypeScript + ESLint + Prettier

## Table of Contents:

- [Getting Started](#getting-started)
- [Installation options](#installation-options)
- [Testing](#testing)
  - [Included Default Testing](#included-default-testing)
  - [Removing Renovate](#removing-renovate)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

### Installation options

**Option one:** One-click deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify-templates/next-netlify-starter&utm_source=github&utm_medium=nextstarter-cs&utm_campaign=devex-cs)

**Option two:** Manual clone

1. Clone this repo: `git clone https://github.com/netlify-templates/next-netlify-starter.git`
2. Navigate to the directory and run `npm install`
3. Run `npm run dev`
4. Make your changes
5. Connect to [Netlify](https://url.netlify.com/Bk4UicocL) manually (the `netlify.toml` file is the one you'll need to make sure stays intact to make sure the export is done and pointed to the right stuff)

## Testing

### Included Default Testing

We’ve included some tooling that helps us maintain these templates. This template currently uses:

- [Renovate](https://www.mend.io/free-developer-tools/renovate/) - to regularly update our dependencies
- [Cypress](https://www.cypress.io/) - to run tests against how the template runs in the browser
- [Cypress Netlify Build Plugin](https://github.com/cypress-io/netlify-plugin-cypress) - to run our tests during our build process

If your team is not interested in this tooling, you can remove them with ease!

### Removing Renovate

In order to keep our project up-to-date with dependencies we use a tool called [Renovate](https://github.com/marketplace/renovate). If you're not interested in this tooling, delete the `renovate.json` file and commit that onto your main branch.

## 项目任务追踪

### 当前任务 (2025-09-13)
- [x] 深入调研光伏关断器检测数据管理领域需求
- [x] 创建spec-kit规范的项目结构  
- [x] 编写高质量的PRD产品需求文档
- [ ] 设计系统架构和数据模型
- [ ] 创建UI界面规范和数据大屏设计
- [ ] 实现Supabase数据库架构
- [ ] 开发Next.js前端应用
- [ ] 实现数据可视化大屏
- [ ] 编写测试用例并执行测试
- [ ] 部署到Netlify平台

### 已完成任务
- 2025-09-13: 创建项目基础结构和PRD文档

### 待处理事项
- 设计数据导入模板和验证规则
- 实现实时数据推送机制
- 优化大屏显示性能
- 添加数据导出功能
- 实现用户权限管理系统
