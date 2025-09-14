#!/bin/bash

echo "🧪 快速测试验证脚本"
echo "===================="
echo ""

# 检查 Node.js 版本
echo "📌 检查环境："
node --version
npm --version
echo ""

# 检查测试文件
echo "📋 测试文件清单："
echo "单元测试："
ls -la tests/unit/*.test.js 2>/dev/null || echo "  - 未找到单元测试文件"
echo ""
echo "集成测试："
ls -la tests/integration/*.test.js 2>/dev/null || echo "  - 未找到集成测试文件"
echo ""
echo "E2E测试："
ls -la cypress/e2e/*.cy.js 2>/dev/null || echo "  - 未找到E2E测试文件"
echo ""

# 检查配置文件
echo "⚙️  配置文件："
[ -f jest.config.js ] && echo "✅ jest.config.js" || echo "❌ jest.config.js"
[ -f jest.setup.js ] && echo "✅ jest.setup.js" || echo "❌ jest.setup.js"
[ -f cypress.config.js ] && echo "✅ cypress.config.js" || echo "❌ cypress.config.js"
echo ""

# 测试报告
echo "📊 测试报告："
[ -f TEST_REPORT.md ] && echo "✅ 测试报告已生成" || echo "❌ 测试报告未找到"
echo ""

echo "✨ 测试环境检查完成！"
echo ""
echo "下一步操作："
echo "1. 运行 'npm install' 安装依赖"
echo "2. 运行 'npm test' 执行单元测试"
echo "3. 运行 'npm run dev' 启动开发服务器"
echo "4. 运行 'npm run cypress:open' 执行E2E测试"