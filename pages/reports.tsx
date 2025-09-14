import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { formatDate } from '@/utils/format';
import {
  DocumentTextIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  icon: any;
  lastGenerated?: string;
  status?: 'ready' | 'generating' | 'error';
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'daily-report',
    name: '日报表',
    description: '包含当日测试数据汇总、合格率统计、异常记录',
    type: 'daily',
    icon: CalendarDaysIcon,
    lastGenerated: '2025-01-15 18:30',
    status: 'ready',
  },
  {
    id: 'weekly-report',
    name: '周报表',
    description: '本周测试数据分析、趋势对比、质量评估',
    type: 'weekly',
    icon: ChartBarIcon,
    lastGenerated: '2025-01-14 09:00',
    status: 'ready',
  },
  {
    id: 'monthly-report',
    name: '月度质量报告',
    description: '月度综合质量分析、产品合格率排名、改进建议',
    type: 'monthly',
    icon: DocumentTextIcon,
    lastGenerated: '2025-01-01 08:00',
    status: 'ready',
  },
  {
    id: 'product-report',
    name: '产品质量报告',
    description: '按产品型号生成详细质量分析报告',
    type: 'custom',
    icon: DocumentTextIcon,
  },
  {
    id: 'test-item-report',
    name: '测试项目报告',
    description: '按测试项目分类的专项分析报告',
    type: 'custom',
    icon: DocumentTextIcon,
  },
  {
    id: 'batch-report',
    name: '批次质量报告',
    description: '按生产批次统计的质量追踪报告',
    type: 'custom',
    icon: DocumentTextIcon,
  },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    end: formatDate(new Date()),
  });
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerateReport = async (reportId: string) => {
    setGenerating(reportId);
    
    // 模拟报表生成
    setTimeout(() => {
      setGenerating(null);
      toast.success('报表生成成功');
    }, 2000);
  };

  const handleDownloadReport = (reportId: string) => {
    toast.success('报表下载中...');
    // TODO: 实现报表下载
  };

  return (
    <Layout title="报表中心 - PV-SDM">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold">报表中心</h1>
          <p className="text-muted mt-1">生成和管理各类质量分析报表</p>
        </div>

        {/* 快速报表 */}
        <div>
          <h2 className="text-lg font-medium mb-4">快速报表</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportTemplates.filter(r => r.type !== 'custom').map((report) => {
              const Icon = report.icon;
              const isGenerating = generating === report.id;

              return (
                <div key={report.id} className="glass-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/20 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    {report.status === 'ready' && (
                      <CheckCircleIcon className="w-5 h-5 text-success" />
                    )}
                  </div>
                  
                  <h3 className="font-medium mb-2">{report.name}</h3>
                  <p className="text-sm text-muted mb-4">{report.description}</p>
                  
                  {report.lastGenerated && (
                    <div className="flex items-center text-xs text-muted mb-4">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      最后生成：{report.lastGenerated}
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={isGenerating}
                      className="btn-primary text-sm flex-1 disabled:opacity-50"
                    >
                      {isGenerating ? '生成中...' : '生成报表'}
                    </button>
                    {report.status === 'ready' && (
                      <button
                        onClick={() => handleDownloadReport(report.id)}
                        className="btn-secondary p-2"
                        title="下载报表"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 自定义报表 */}
        <div>
          <h2 className="text-lg font-medium mb-4">自定义报表</h2>
          <div className="glass-card p-6">
            {/* 日期范围选择 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">开始日期</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">结束日期</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="input-field w-full"
                />
              </div>
            </div>

            {/* 报表类型选择 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reportTemplates.filter(r => r.type === 'custom').map((report) => {
                const Icon = report.icon;
                const isSelected = selectedReport === report.id;
                const isGenerating = generating === report.id;

                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`glass-card p-4 cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-primary' : 'hover:bg-dark-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-xs text-muted">{report.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 生成按钮 */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => selectedReport && handleGenerateReport(selectedReport)}
                disabled={!selectedReport || !!generating}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                生成自定义报表
              </button>
            </div>
          </div>
        </div>

        {/* 历史报表 */}
        <div>
          <h2 className="text-lg font-medium mb-4">历史报表</h2>
          <div className="glass-card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>报表名称</th>
                  <th>类型</th>
                  <th>时间范围</th>
                  <th>生成时间</th>
                  <th>文件大小</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2025年1月日报表</td>
                  <td><span className="badge badge-success">日报</span></td>
                  <td>2025-01-15</td>
                  <td>2025-01-15 18:30:25</td>
                  <td>1.2 MB</td>
                  <td>
                    <div className="flex space-x-2">
                      <button className="text-primary hover:text-primary-hover">
                        查看
                      </button>
                      <button className="text-primary hover:text-primary-hover">
                        下载
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>2025年第2周周报</td>
                  <td><span className="badge badge-warning">周报</span></td>
                  <td>2025-01-08 至 2025-01-14</td>
                  <td>2025-01-14 09:00:15</td>
                  <td>2.5 MB</td>
                  <td>
                    <div className="flex space-x-2">
                      <button className="text-primary hover:text-primary-hover">
                        查看
                      </button>
                      <button className="text-primary hover:text-primary-hover">
                        下载
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>2024年12月质量月报</td>
                  <td><span className="badge badge-error">月报</span></td>
                  <td>2024-12-01 至 2024-12-31</td>
                  <td>2025-01-01 08:00:30</td>
                  <td>5.8 MB</td>
                  <td>
                    <div className="flex space-x-2">
                      <button className="text-primary hover:text-primary-hover">
                        查看
                      </button>
                      <button className="text-primary hover:text-primary-hover">
                        下载
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}