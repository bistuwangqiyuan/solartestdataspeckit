import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { 
  getTodayStatistics, 
  getWeekStatistics, 
  getMonthStatistics,
  getPassRateTrend,
  getCategoryDistribution 
} from '@/services/statistics';
import { getTestRecords } from '@/services/testRecords';
import { formatNumber, formatPercent, formatDateTime } from '@/utils/format';
import { useTestRecordsRealtime } from '@/hooks/useRealtime';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  const [todayStats, setTodayStats] = useState<any>(null);
  const [weekStats, setWeekStats] = useState<any>(null);
  const [monthStats, setMonthStats] = useState<any>(null);
  const [recentTests, setRecentTests] = useState<any[]>([]);
  const [passRateTrend, setPassRateTrend] = useState<any>(null);
  const [categoryDistribution, setCategoryDistribution] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 实时订阅测试记录更新
  useTestRecordsRealtime((newData) => {
    // 更新统计数据
    loadStatistics();
    // 更新最近测试列表
    loadRecentTests();
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      loadStatistics(),
      loadRecentTests(),
      loadChartData(),
    ]);
    setLoading(false);
  };

  const loadStatistics = async () => {
    const [today, week, month] = await Promise.all([
      getTodayStatistics(),
      getWeekStatistics(),
      getMonthStatistics(),
    ]);

    if (today.success) setTodayStats(today.data);
    if (week.success) setWeekStats(week.data);
    if (month.success) setMonthStats(month.data);
  };

  const loadRecentTests = async () => {
    const result = await getTestRecords(
      undefined,
      { field: 'test_date', order: 'desc' },
      { page: 1, limit: 10 }
    );
    if (result.success) {
      setRecentTests(result.data || []);
    }
  };

  const loadChartData = async () => {
    const [trend, distribution] = await Promise.all([
      getPassRateTrend(30),
      getCategoryDistribution(),
    ]);

    setPassRateTrend(trend);
    setCategoryDistribution(distribution);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#E5E7EB',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#374151' },
      },
      y: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#374151' },
      },
    },
  };

  return (
    <Layout title="仪表盘 - PV-SDM">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold">数据概览</h1>
          <p className="text-muted mt-1">实时监控测试数据和系统状态</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 今日统计 */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">今日统计</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted">测试总数</span>
                <span className="text-xl font-bold">
                  {formatNumber(todayStats?.total_tests || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">合格率</span>
                <span className="text-xl font-bold text-success">
                  {formatPercent(todayStats?.pass_rate || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">不合格数</span>
                <span className="text-xl font-bold text-error">
                  {formatNumber(todayStats?.fail_count || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* 本周统计 */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">本周统计</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted">测试总数</span>
                <span className="text-xl font-bold">
                  {formatNumber(weekStats?.total_tests || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">合格率</span>
                <span className="text-xl font-bold text-success">
                  {formatPercent(weekStats?.pass_rate || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">日均测试</span>
                <span className="text-xl font-bold">
                  {formatNumber((weekStats?.total_tests || 0) / 7, 1)}
                </span>
              </div>
            </div>
          </div>

          {/* 本月统计 */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">本月统计</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted">测试总数</span>
                <span className="text-xl font-bold">
                  {formatNumber(monthStats?.total_tests || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">合格率</span>
                <span className="text-xl font-bold text-success">
                  {formatPercent(monthStats?.pass_rate || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">目标达成</span>
                <span className="text-xl font-bold text-primary">
                  {formatPercent(monthStats?.pass_rate >= 95 ? 100 : (monthStats?.pass_rate || 0) / 95 * 100)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 合格率趋势图 */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">30天合格率趋势</h3>
            <div className="h-64">
              {passRateTrend && (
                <Line data={passRateTrend} options={chartOptions} />
              )}
            </div>
          </div>

          {/* 测试分类分布 */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">测试项目分布</h3>
            <div className="h-64">
              {categoryDistribution && (
                <Doughnut 
                  data={categoryDistribution} 
                  options={{
                    ...chartOptions,
                    scales: undefined,
                  }} 
                />
              )}
            </div>
          </div>
        </div>

        {/* 最近测试记录 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">最近测试记录</h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>测试时间</th>
                  <th>设备序列号</th>
                  <th>产品型号</th>
                  <th>测试项目</th>
                  <th>测试结果</th>
                  <th>操作员</th>
                </tr>
              </thead>
              <tbody>
                {recentTests.map((record) => (
                  <tr key={record.id}>
                    <td>{formatDateTime(record.test_date)}</td>
                    <td>{record.device_sn}</td>
                    <td>{record.product?.model || '-'}</td>
                    <td>{record.test_item?.name || '-'}</td>
                    <td>
                      <span className={`badge ${
                        record.result === 'PASS' ? 'badge-success' : 'badge-error'
                      }`}>
                        {record.result}
                      </span>
                    </td>
                    <td>{record.operator?.name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}